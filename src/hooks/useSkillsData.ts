import { useState, useEffect, useMemo } from 'react';
import type {
  SkillsData,
  SkillCategory,
  LabMember,
  SkillGap,
  Subcategory,
  VisualizationNode,
  VisualizationLink,
} from '../types/types';

const DATA_URL = '/data/skillsData.json';

export function useSkillsData() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load skills data');
        return res.json();
      })
      .then((json: SkillsData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, setData };
}

export function getSkillById(
  skills: Subcategory[],
  id: string,
): Subcategory | undefined {
  return skills.find((s) => s.id === id);
}

export function getCategoryById(
  categories: SkillCategory[],
  id: string,
): SkillCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function getSkillCategories(
  skill: Subcategory,
  categories: SkillCategory[],
): SkillCategory[] {
  return skill.belongsTo
    .map((catId) => getCategoryById(categories, catId))
    .filter((c): c is SkillCategory => c !== undefined);
}

export function getMembersWithSkill(
  members: LabMember[],
  skillId: string,
): LabMember[] {
  return members.filter((m) => m.skills.some((s) => s.skillId === skillId));
}

export function getMemberCategoryWeights(
  member: LabMember,
  data: SkillsData,
): Record<string, number> {
  const weights: Record<string, number> = {};

  for (const memberSkill of member.skills) {
    const skill = getSkillById(data.skills, memberSkill.skillId);
    if (!skill) continue;

    // Proficiency weight: expert=4, advanced=3, intermediate=2, beginner=1
    const profWeight = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }[
      memberSkill.proficiency
    ];

    for (const catId of skill.belongsTo) {
      weights[catId] = (weights[catId] || 0) + profWeight;
    }
  }

  return weights;
}

// Get a blended color for a member based on their category weights
export function getMemberBlendedColor(
  weights: Record<string, number>,
  categories: SkillCategory[],
): string {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return '#6366f1';

  let r = 0,
    g = 0,
    b = 0;

  for (const [catId, weight] of Object.entries(weights)) {
    const category = getCategoryById(categories, catId);
    if (!category) continue;

    const ratio = weight / totalWeight;
    const hex = category.color.replace('#', '');
    r += parseInt(hex.substr(0, 2), 16) * ratio;
    g += parseInt(hex.substr(2, 2), 16) * ratio;
    b += parseInt(hex.substr(4, 2), 16) * ratio;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function calculateSkillGaps(data: SkillsData): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const skill of data.skills) {
    const membersWithSkill = getMembersWithSkill(data.members, skill.id);
    const expertCount = membersWithSkill.filter((m) =>
      m.skills.some(
        (s) => s.skillId === skill.id && s.proficiency === 'expert',
      ),
    ).length;

    const categories = getSkillCategories(skill, data.categories);

    let recommendation = '';
    if (membersWithSkill.length === 0) {
      recommendation = 'No coverage - consider collaboration or hiring';
    } else if (expertCount === 0) {
      recommendation = 'No experts - consider training or external help';
    } else if (membersWithSkill.length < 2) {
      recommendation = 'Single point of failure - expand team coverage';
    }

    gaps.push({
      skill,
      categories,
      currentCoverage: membersWithSkill.length,
      expertCount,
      recommendation,
    });
  }

  return gaps.sort((a, b) => a.currentCoverage - b.currentCoverage);
}

// Build visualization graph data
export function buildVisualizationGraph(data: SkillsData): {
  nodes: VisualizationNode[];
  links: VisualizationLink[];
} {
  const nodes: VisualizationNode[] = [];
  const links: VisualizationLink[] = [];

  // Add category nodes (outer ring)
  for (const category of data.categories) {
    nodes.push({
      id: `cat-${category.id}`,
      name: category.name,
      type: 'category',
      color: category.color,
      size: 50,
      data: category,
    });
  }

  // Add skill nodes (with overlap info)
  for (const skill of data.skills) {
    const categories = getSkillCategories(skill, data.categories);
    // Blend colors for overlapping skills
    const blendedColor =
      categories.length === 1
        ? categories[0].color
        : getMemberBlendedColor(
            Object.fromEntries(skill.belongsTo.map((id) => [id, 1])),
            data.categories,
          );

    nodes.push({
      id: `skill-${skill.id}`,
      name: skill.name,
      type: 'skill',
      color: blendedColor,
      size: 20 + getMembersWithSkill(data.members, skill.id).length * 5,
      data: skill,
    });

    // Link skills to their categories
    for (const catId of skill.belongsTo) {
      links.push({
        source: `cat-${catId}`,
        target: `skill-${skill.id}`,
        strength: 0.3,
        type: 'category-skill',
      });
    }
  }

  // Add member nodes
  for (const member of data.members) {
    const weights = getMemberCategoryWeights(member, data);
    const color = getMemberBlendedColor(weights, data.categories);

    nodes.push({
      id: `member-${member.id}`,
      name: member.name,
      type: 'member',
      color,
      size: 25 + member.skills.length * 3,
      categoryWeights: weights,
      data: member,
    });

    // Link members to their skills
    for (const memberSkill of member.skills) {
      links.push({
        source: `skill-${memberSkill.skillId}`,
        target: `member-${member.id}`,
        strength: memberSkill.proficiency === 'expert' ? 0.8 : 0.5,
        type: 'skill-member',
      });
    }
  }

  // Add member-to-member links based on shared skills (for clustering)
  for (let i = 0; i < data.members.length; i++) {
    for (let j = i + 1; j < data.members.length; j++) {
      const m1 = data.members[i];
      const m2 = data.members[j];
      const sharedSkills = m1.skills.filter((s1) =>
        m2.skills.some((s2) => s2.skillId === s1.skillId),
      ).length;

      if (sharedSkills > 0) {
        links.push({
          source: `member-${m1.id}`,
          target: `member-${m2.id}`,
          strength: sharedSkills * 0.1,
          type: 'member-member',
        });
      }
    }
  }

  return { nodes, links };
}

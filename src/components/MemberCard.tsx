import React from 'react';
import { Card, Tag, Avatar, Tooltip } from 'antd';
import { UserOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import type { LabMember, SkillsData, MemberSkill } from '../types/types';
import { PROFICIENCY_COLORS, PROFICIENCY_LABELS } from '../types/types';
import {
  getSkillById,
  getMemberBlendedColor,
  getMemberCategoryWeights,
} from '../hooks/useSkillsData';

interface MemberCardProps {
  member: LabMember;
  data: SkillsData;
  onClick?: (member: LabMember) => void;
}

const SkillTag: React.FC<{
  skill: MemberSkill;
  data: SkillsData;
}> = ({ skill, data }) => {
  const skillInfo = getSkillById(data.skills, skill.skillId);
  if (!skillInfo) return null;

  // Get colors from all categories this skill belongs to
  const categories = skillInfo.belongsTo
    .map((id) => data.categories.find((c) => c.id === id))
    .filter(Boolean);

  const isOverlap = categories.length > 1;
  const primaryColor = categories[0]?.color || '#6366f1';

  return (
    <Tooltip
      title={
        <div>
          <div className='font-semibold'>{skillInfo.name}</div>
          <div className='text-xs opacity-80'>
            {PROFICIENCY_LABELS[skill.proficiency]}
          </div>
          {isOverlap && (
            <div className='text-xs mt-1'>
              Spans: {categories.map((c) => c?.name).join(', ')}
            </div>
          )}
        </div>
      }
    >
      <Tag
        className='category-badge m-1'
        style={{
          background: isOverlap
            ? `linear-gradient(135deg, ${categories.map((c) => c?.color).join(', ')})`
            : `${primaryColor}20`,
          borderColor: primaryColor,
          color: isOverlap ? '#fff' : primaryColor,
        }}
      >
        <span
          className='proficiency-dot'
          style={{ backgroundColor: PROFICIENCY_COLORS[skill.proficiency] }}
        />
        {skillInfo.name}
        {isOverlap && <span className='ml-1 opacity-60'>⟷</span>}
      </Tag>
    </Tooltip>
  );
};

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  data,
  onClick,
}) => {
  const categoryWeights = getMemberCategoryWeights(member, data);
  const blendedColor = getMemberBlendedColor(categoryWeights, data.categories);

  // Group skills by their primary category
  const skillsByCategory: Record<string, MemberSkill[]> = {};
  for (const memberSkill of member.skills) {
    const skill = getSkillById(data.skills, memberSkill.skillId);
    if (!skill) continue;
    const primaryCat = skill.belongsTo[0];
    if (!skillsByCategory[primaryCat]) {
      skillsByCategory[primaryCat] = [];
    }
    skillsByCategory[primaryCat].push(memberSkill);
  }

  return (
    <Card
      className='glass-card overflow-hidden'
      hoverable
      onClick={() => onClick?.(member)}
      styles={{
        body: { padding: '20px' },
      }}
    >
      <div className='flex items-start gap-4'>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={member.avatar}
          className='flex-shrink-0'
          style={{
            background: blendedColor,
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-white mb-1 truncate'>
            {member.name}
          </h3>
          <p className='text-sm text-gray-400 mb-2'>{member.role}</p>
          <div className='flex gap-2 mb-3'>
            {member.email && (
              <Tooltip title={member.email}>
                <a
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <MailOutlined />
                </a>
              </Tooltip>
            )}
            {member.github && (
              <Tooltip title={`@${member.github}`}>
                <a
                  href={`https://github.com/${member.github}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <GithubOutlined />
                </a>
              </Tooltip>
            )}
          </div>

          {/* Category distribution bar */}
          <div className='flex h-2 rounded-full overflow-hidden mb-3'>
            {Object.entries(categoryWeights).map(([catId, weight]) => {
              const category = data.categories.find((c) => c.id === catId);
              const totalWeight = Object.values(categoryWeights).reduce(
                (a, b) => a + b,
                0,
              );
              return (
                <Tooltip
                  key={catId}
                  title={`${category?.name}: ${Math.round((weight / totalWeight) * 100)}%`}
                >
                  <div
                    style={{
                      backgroundColor: category?.color,
                      width: `${(weight / totalWeight) * 100}%`,
                    }}
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-4'>
        {Object.entries(skillsByCategory).map(([categoryId, skills]) => {
          const category = data.categories.find((c) => c.id === categoryId);
          return (
            <div key={categoryId} className='mb-2'>
              <span
                className='text-xs font-medium uppercase tracking-wider'
                style={{ color: category?.color || '#fff' }}
              >
                {category?.name || categoryId}
              </span>
              <div className='flex flex-wrap mt-1'>
                {skills.map((skill) => (
                  <SkillTag key={skill.skillId} skill={skill} data={data} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MemberCard;

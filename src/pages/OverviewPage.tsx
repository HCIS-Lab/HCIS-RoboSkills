import React, { useState } from 'react';
import { Input, Select, Spin, Empty, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSkillsData } from '../hooks/useSkillsData';
import VennZoomChart from '../components/SkillChart';
import MemberCard from '../components/MemberCard';
import type { LabMember } from '../types/types';

const { Option } = Select;

export const OverviewPage: React.FC = () => {
  const { data, loading, error } = useSkillsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<LabMember | null>(null);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Spin size='large' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Empty description={error || 'No data available'} />
      </div>
    );
  }

  const filteredMembers = data.members.filter((member) => {
    const matchesSearch =
      searchTerm === '' ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      member.skills.some((s) => {
        const skill = data.skills.find((sk) => sk.id === s.skillId);
        return skill?.belongsTo.includes(selectedCategory);
      });

    return matchesSearch && matchesCategory;
  });

  const handleMemberClick = (member: LabMember) => {
    setSelectedMember(member);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2'>
          Lab Skills Overview
        </h1>
        <p className='text-gray-400 text-sm max-w-xl mx-auto'>
          Skills in overlapping regions span multiple categories. Scroll to
          zoom, drag to pan.
        </p>
      </div>

      {/* Venn Zoom Visualization */}
      <div className='glass-card overflow-hidden'>
        <VennZoomChart
          data={data}
          onMemberClick={handleMemberClick}
          height={550}
        />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3'>
        <Input
          placeholder='Search members...'
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-xs'
          allowClear
        />
        <Select
          placeholder='Filter by category'
          value={selectedCategory}
          onChange={setSelectedCategory}
          allowClear
          className='min-w-[180px]'
        >
          {data.categories.map((category) => (
            <Option key={category.id} value={category.id}>
              <span style={{ color: category.color }}>●</span> {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Members Grid */}
      <div>
        <h2 className='text-lg font-semibold text-white mb-3'>
          Lab Members ({filteredMembers.length})
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              data={data}
              onClick={setSelectedMember}
            />
          ))}
        </div>
        {filteredMembers.length === 0 && (
          <Empty description='No members match your filters' />
        )}
      </div>

      {/* Member Detail Modal */}
      <Modal
        open={!!selectedMember}
        onCancel={() => setSelectedMember(null)}
        footer={null}
        title={selectedMember?.name}
        width={600}
      >
        {selectedMember && (
          <div className='space-y-4'>
            <p className='text-gray-400'>{selectedMember.role}</p>

            <div>
              <h3 className='text-sm font-semibold mb-2'>Skills & Expertise</h3>
              <div className='space-y-2'>
                {selectedMember.skills.map((memberSkill) => {
                  const skill = data.skills.find(
                    (s) => s.id === memberSkill.skillId,
                  );
                  if (!skill) return null;
                  const categories = skill.belongsTo
                    .map((id) => data.categories.find((c) => c.id === id))
                    .filter(Boolean);

                  return (
                    <div
                      key={memberSkill.skillId}
                      className='p-2 rounded-lg bg-gray-800/50 border border-gray-700'
                    >
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-medium'>{skill.name}</span>
                        <span
                          className='text-xs px-2 py-0.5 rounded capitalize'
                          style={{
                            backgroundColor: `${
                              memberSkill.proficiency === 'expert'
                                ? '#9b59b6'
                                : memberSkill.proficiency === 'advanced'
                                  ? '#27ae60'
                                  : memberSkill.proficiency === 'intermediate'
                                    ? '#f39c12'
                                    : '#95a5a6'
                            }30`,
                            color:
                              memberSkill.proficiency === 'expert'
                                ? '#9b59b6'
                                : memberSkill.proficiency === 'advanced'
                                  ? '#27ae60'
                                  : memberSkill.proficiency === 'intermediate'
                                    ? '#f39c12'
                                    : '#95a5a6',
                          }}
                        >
                          {memberSkill.proficiency}
                        </span>
                      </div>
                      <p className='text-xs text-gray-400'>
                        {skill.description}
                      </p>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {categories.map((cat) => (
                          <span
                            key={cat?.id}
                            className='text-xs px-1.5 py-0.5 rounded-full'
                            style={{
                              backgroundColor: `${cat?.color}20`,
                              color: cat?.color,
                            }}
                          >
                            {cat?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OverviewPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Statistic, Space, Spin } from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PullRequestOutlined,
  GithubOutlined,
  GlobalOutlined,
  RocketOutlined,
  CarOutlined,
  RobotOutlined,
  RightOutlined,
  EyeOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import ResearchVisionChart from '../components/ResearchVisionChart';

const { Title, Paragraph, Text } = Typography;

interface HomeConfig {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  lab: {
    name: string;
    fullName: string;
    institution: string;
    description: string;
    website?: string;
    director?: {
      name: string;
      title: string;
      email?: string;
    };
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  statistics: {
    showStats: boolean;
    customStats: Array<{
      title: string;
      value: number;
      suffix?: string;
    }>;
  };
  quickLinks: Array<{
    title: string;
    description: string;
    link: string;
    icon: string;
  }>;
}

interface SkillsData {
  categories: Array<{ id: string; name: string }>;
  skills: Array<{ id: string; name: string }>;
  members: Array<{
    id: string;
    name: string;
    skills: Array<{ skillId: string }>;
  }>;
}

interface ResearchArea {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  url: string;
}

interface Pillar {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
}

interface Outcome {
  id: string;
  name: string;
  icon: string;
}

interface ResearchData {
  lab: {
    name: string;
    fullName: string;
    philosophy: string;
  };
  pillars: Pillar[];
  outcomes: Outcome[];
  researchAreas: ResearchArea[];
}

const iconMap: Record<string, React.ReactNode> = {
  TeamOutlined: <TeamOutlined />,
  SearchOutlined: <SearchOutlined />,
  PullRequestOutlined: <PullRequestOutlined />,
  RocketOutlined: <RocketOutlined />,
};

const pillarIconMap: Record<string, React.ReactNode> = {
  eye: <EyeOutlined />,
  brain: <BulbOutlined />,
  robot: <RobotOutlined />,
  team: <TeamOutlined />,
  rocket: <RocketOutlined />,
};

const outcomeIconMap: Record<string, React.ReactNode> = {
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  HeartOutlined: <HeartOutlined />,
  SmileOutlined: <SmileOutlined />,
};

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [stats, setStats] = useState<{
    members: number;
    skills: number;
    categories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [configRes, skillsRes, researchRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/homeConfig.json`),
          fetch(`${import.meta.env.BASE_URL}data/skillsData.json`),
          fetch(`${import.meta.env.BASE_URL}data/researchData.json`),
        ]);

        const configData = await configRes.json();
        const skillsData: SkillsData = await skillsRes.json();
        const researchDataJson = await researchRes.json();

        setConfig(configData);
        setResearchData(researchDataJson);
        setStats({
          members: skillsData.members.length,
          skills: skillsData.skills.length,
          categories: skillsData.categories.length,
        });
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAreaIcon = (icon: string) => {
    switch (icon) {
      case 'car':
        return <CarOutlined />;
      case 'robot':
        return <RobotOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (!config) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Text type='danger'>Failed to load home page configuration</Text>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Top Section: Logo + Research Vision */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='orb orb-1' style={{ top: '10%', left: '10%' }} />
          <div className='orb orb-2' style={{ top: '60%', right: '15%' }} />
        </div>
        <div className='container mx-auto px-4 pt-12 pb-8 relative z-10'>
          {/* HCIS Lab Logo + Title */}
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              <img
                src={`${import.meta.env.BASE_URL}hcis-lab-logo-dark.svg`}
                alt='HCIS Lab Logo'
                className='h-20 md:h-28 w-auto drop-shadow-2xl animate-fade-in'
              />
            </div>
            <Title
              level={1}
              className='!text-4xl md:!text-5xl !mb-3 !font-bold'
              style={{
                background: 'linear-gradient(to right, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {config.hero.title}
            </Title>
            <Paragraph className='!text-white/70 !text-lg !mb-0'>
              {config.hero.subtitle}
            </Paragraph>
          </div>

          {/* Research Vision Chart */}
          {researchData && (
            <div className='mb-8'>
              <ResearchVisionChart />
            </div>
          )}
        </div>
      </div>

      {/* Integrated Approach Section — from p.13 */}
      {researchData && researchData.pillars && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <div className='text-center mb-10'>
            <Title level={2} className='!text-white !mb-3'>
              Our Integrated Approach
            </Title>
            <Paragraph className='!text-white/60 max-w-3xl mx-auto text-base'>
              {researchData.lab.philosophy}
            </Paragraph>
          </div>

          {/* 5 Pillars */}
          <Row gutter={[16, 16]} justify='center'>
            {researchData.pillars.map((pillar) => (
              <Col xs={24} sm={12} md={8} lg={4} key={pillar.id}>
                <Card
                  className='backdrop-blur-md border-white/10 h-full text-center hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1'
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    borderTop: `3px solid ${pillar.color}`,
                  }}
                >
                  <div
                    className='text-3xl mb-3 inline-flex items-center justify-center w-14 h-14 rounded-xl'
                    style={{
                      background: `${pillar.color}20`,
                      color: pillar.color,
                    }}
                  >
                    {pillarIconMap[pillar.icon] || <GlobalOutlined />}
                  </div>
                  <Title level={5} className='!text-white !mb-1'>
                    {pillar.shortName}
                  </Title>
                  <Paragraph className='!text-white/50 !mb-0 !text-xs'>
                    {pillar.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 4 Outcomes */}
          {researchData.outcomes && (
            <div className='mt-10'>
              <div className='text-center mb-4'>
                <Text className='!text-white/40 uppercase tracking-widest text-xs font-semibold'>
                  Enhancing
                </Text>
              </div>
              <div className='flex flex-wrap justify-center gap-4'>
                {researchData.outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className='flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5'
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className='text-indigo-400 text-lg'>
                      {outcomeIconMap[outcome.icon] || <GlobalOutlined />}
                    </span>
                    <span className='text-white/80 font-medium text-sm'>
                      {outcome.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* About Lab Section */}
      <div className='container mx-auto px-4 py-12 bg-transparent'>
        <Card
          className='backdrop-blur-md border-white/10 shadow-2xl'
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
          }}
        >
          <Title level={2} className='!text-white !mb-4'>
            About {config.lab.name}
          </Title>
          <Title level={4} className='!text-white/80 !mb-2 !font-normal'>
            {config.lab.fullName}
          </Title>
          <Paragraph className='!text-white/70 !text-base !mb-4'>
            {config.lab.institution}
          </Paragraph>
          <Paragraph className='!text-white/80 !text-lg !mb-6'>
            {config.lab.description}
          </Paragraph>
          {config.lab.director && (
            <div className='bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10'>
              <Text className='!text-white/60 block mb-1'>Lab Director</Text>
              <Text className='!text-white text-lg font-semibold block'>
                {config.lab.director.name}
              </Text>
              <Text className='!text-white/70 block'>
                {config.lab.director.title}
              </Text>
              {config.lab.director.email && (
                <a
                  href={`mailto:${config.lab.director.email}`}
                  className='!text-indigo-400 hover:!text-indigo-300 transition-colors'
                >
                  {config.lab.director.email}
                </a>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Research Areas Section */}
      {researchData && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <Title level={2} className='!text-white text-center !mb-8'>
            Research Areas
          </Title>

          <Row gutter={[24, 24]}>
            {researchData.researchAreas.map((area) => (
              <Col xs={24} lg={12} key={area.id}>
                <Card
                  id={`area-${area.id}`}
                  className='glass-card h-full'
                  style={{ borderTop: `4px solid ${area.color}` }}
                >
                  <div className='flex items-center gap-3 mb-4'>
                    <div
                      className='text-2xl p-3 rounded-xl'
                      style={{
                        background: `${area.color}20`,
                        color: area.color,
                      }}
                    >
                      {getAreaIcon(area.icon)}
                    </div>
                    <Title level={3} className='!text-xl !text-white !mb-0'>
                      {area.name}
                    </Title>
                  </div>

                  <Paragraph className='text-white/70 mb-4'>
                    {area.description}
                  </Paragraph>

                  <div className='mt-6'>
                    {area.url && (
                      <a
                        href={area.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 text-white hover:text-indigo-300 transition-colors group'
                      >
                        <span className='font-medium'>Learn More</span>
                        <RightOutlined className='group-hover:translate-x-1 transition-transform' />
                      </a>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Statistics Section */}
      {config.statistics.showStats && stats && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <Card
            className='backdrop-blur-md border-white/10 shadow-2xl'
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
            }}
          >
            <Row gutter={[24, 24]} justify='center'>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={<span className='text-white/70'>Team Members</span>}
                  value={stats.members}
                  styles={{ content: { color: '#818cf8', fontSize: '2.5rem' } }}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={<span className='text-white/70'>Skills Tracked</span>}
                  value={stats.skills}
                  styles={{ content: { color: '#c084fc', fontSize: '2.5rem' } }}
                  prefix={<RocketOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={<span className='text-white/70'>Categories</span>}
                  value={stats.categories}
                  styles={{ content: { color: '#a78bfa', fontSize: '2.5rem' } }}
                  prefix={<SearchOutlined />}
                />
              </Col>
              {config.statistics.customStats.map((stat, index) => (
                <Col xs={24} sm={8} md={8} key={index}>
                  <Statistic
                    title={<span className='text-white/70'>{stat.title}</span>}
                    value={stat.value}
                    suffix={stat.suffix}
                    styles={{
                      content: { color: '#818cf8', fontSize: '2.5rem' },
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}

      {/* Quick Links Section */}
      <div className='container mx-auto px-4 py-12 pb-20 bg-transparent'>
        <Title level={2} className='!text-white text-center !mb-8'>
          Quick Links
        </Title>
        <Row gutter={[24, 24]}>
          {config.quickLinks.map((link, index) => (
            <Col xs={24} md={8} key={index}>
              <Link to={link.link}>
                <Card
                  className='backdrop-blur-md border-white/10 h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer'
                  variant='borderless'
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                  }}
                >
                  <div className='flex items-start gap-4'>
                    <div className='text-3xl text-purple-400'>
                      {iconMap[link.icon] || <RocketOutlined />}
                    </div>
                    <div className='flex-1'>
                      <Title level={5} className='!text-white !mb-2'>
                        {link.title}
                      </Title>
                      <Paragraph className='!text-white/70 !mb-0'>
                        {link.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <div className='bg-black/20 border-t border-white/10'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-white/60'>
            <Space size='middle'>
              <a
                href='https://github.com/HCIS-Lab/HCIS-RoboSkills'
                target='_blank'
                rel='noopener noreferrer'
                className='!text-white/60 hover:!text-white transition-colors'
              >
                <GithubOutlined className='text-xl' /> GitHub
              </a>
              {config.lab.website && (
                <>
                  <span>|</span>
                  <a
                    href={config.lab.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='!text-white/60 hover:!text-white transition-colors'
                  >
                    <GlobalOutlined /> Lab Website
                  </a>
                </>
              )}
            </Space>
            <Paragraph className='!text-white/50 !mt-4 !mb-0'>
              © {new Date().getFullYear()} {config.lab.name}. All rights
              reserved.
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

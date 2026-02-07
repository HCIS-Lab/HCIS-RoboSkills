import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Statistic,
  Space,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PullRequestOutlined,
  GithubOutlined,
  GlobalOutlined,
  RocketOutlined,
  CarOutlined,
  RobotOutlined,
  FileTextOutlined,
  CalendarOutlined,
  LinkOutlined,
  RightOutlined,
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

interface Publication {
  title: string;
  venue: string;
  authors: string[];
  links: {
    paper?: string;
    projectPage?: string;
    code?: string;
    ieee?: string;
    nvidia?: string;
  };
}

interface FocusArea {
  id: string;
  name: string;
  description: string;
}

interface ResearchArea {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  focusAreas: FocusArea[];
  publications: Publication[];
}

interface NewsItem {
  date: string;
  text: string;
  highlight?: boolean;
  links?: {
    paper?: string;
    website?: string;
  };
}

interface ResearchData {
  lab: {
    name: string;
    fullName: string;
    philosophy: string;
  };
  researchAreas: ResearchArea[];
  recentNews: NewsItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  TeamOutlined: <TeamOutlined />,
  SearchOutlined: <SearchOutlined />,
  PullRequestOutlined: <PullRequestOutlined />,
  RocketOutlined: <RocketOutlined />,
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
  const researchAreasRef = useRef<HTMLDivElement>(null);

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

  const handleAreaClick = (areaId: string) => {
    const element = document.getElementById(`area-${areaId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        <div className='absolute inset-0'>
          <div className='orb orb-1' style={{ top: '10%', left: '10%' }} />
          <div className='orb orb-2' style={{ top: '60%', right: '15%' }} />
        </div>
        <div className='container mx-auto px-4 py-20 md:py-32 relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            {/* HCIS Lab Logo */}
            <div className='flex justify-center mb-8'>
              <img
                src={`${import.meta.env.BASE_URL}hcis-lab-logo-dark.svg`}
                alt='HCIS Lab Logo'
                className='h-32 md:h-40 w-auto drop-shadow-2xl animate-fade-in'
              />
            </div>
            <Title
              level={1}
              className='!text-5xl md:!text-7xl !mb-6 !font-bold'
              style={{
                background: 'linear-gradient(to right, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {config.hero.title}
            </Title>
            <Title level={3} className='!text-white/90 !mb-4 !font-normal'>
              {config.hero.subtitle}
            </Title>
            <Paragraph className='!text-white/70 !text-lg !mb-8'>
              {config.hero.description}
            </Paragraph>
            <Space size='large' wrap>
              <Link to='/overview'>
                <Button
                  type='primary'
                  size='large'
                  icon={<RocketOutlined />}
                  className='shadow-lg hover:shadow-xl'
                >
                  Get Started
                </Button>
              </Link>
              {config.lab.website && (
                <a
                  href={config.lab.website}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button
                    size='large'
                    icon={<GlobalOutlined />}
                    ghost
                    className='!text-white !border-white/50 hover:!bg-white/10 hover:!border-white'
                  >
                    Visit Lab Website
                  </Button>
                </a>
              )}
            </Space>
          </div>
        </div>
      </div>

      {/* Research Vision Section */}
      {researchData && (
        <div className='container mx-auto px-4 py-16 bg-transparent'>
          <div className='text-center mb-8'>
            <Title level={2} className='!text-white !mb-4'>
              Research Vision
            </Title>
            <Paragraph className='!text-white/60 max-w-2xl mx-auto'>
              {researchData.lab.philosophy}
            </Paragraph>
          </div>

          <ResearchVisionChart onAreaClick={handleAreaClick} />

          <div className='text-center mt-6'>
            <Text className='text-white/50 text-sm italic'>
              Click on the circles to explore related research areas
            </Text>
          </div>
        </div>
      )}

      {/* Research Areas Section */}
      {researchData && (
        <div
          ref={researchAreasRef}
          className='container mx-auto px-4 py-12 bg-transparent'
        >
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

                  {/* Focus Areas */}
                  <div className='mb-6'>
                    <Text strong className='text-white/80 block mb-3'>
                      Focus Areas:
                    </Text>
                    <div className='space-y-3'>
                      {area.focusAreas.map((focus) => (
                        <div
                          key={focus.id}
                          className='p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all'
                        >
                          <Text strong className='text-white block mb-1'>
                            {focus.name}
                          </Text>
                          <Text className='text-white/60 text-sm'>
                            {focus.description}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Publications */}
                  <div>
                    <Text strong className='text-white/80 block mb-3'>
                      Selected Publications:
                    </Text>
                    <div className='space-y-3'>
                      {area.publications.slice(0, 3).map((pub, idx) => (
                        <div
                          key={idx}
                          className='p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all'
                        >
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1'>
                              <Text className='text-white text-sm block mb-1'>
                                {pub.title}
                              </Text>
                              <Tag color={area.color} className='text-xs mb-2'>
                                {pub.venue}
                              </Tag>
                            </div>
                          </div>
                          <div className='flex flex-wrap gap-2 mt-2'>
                            {pub.links.paper && (
                              <Tooltip title='Paper'>
                                <a
                                  href={pub.links.paper}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-white/60 hover:text-white transition-colors'
                                >
                                  <FileTextOutlined className='text-lg' />
                                </a>
                              </Tooltip>
                            )}
                            {pub.links.projectPage && (
                              <Tooltip title='Project Page'>
                                <a
                                  href={pub.links.projectPage}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-white/60 hover:text-white transition-colors'
                                >
                                  <GlobalOutlined className='text-lg' />
                                </a>
                              </Tooltip>
                            )}
                            {pub.links.code && (
                              <Tooltip title='Code'>
                                <a
                                  href={pub.links.code}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-white/60 hover:text-white transition-colors'
                                >
                                  <GithubOutlined className='text-lg' />
                                </a>
                              </Tooltip>
                            )}
                            {pub.links.ieee && (
                              <Tooltip title='IEEE'>
                                <a
                                  href={pub.links.ieee}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-white/60 hover:text-white transition-colors'
                                >
                                  <LinkOutlined className='text-lg' />
                                </a>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Recent News Section */}
      {researchData && researchData.recentNews.length > 0 && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <Title level={2} className='!text-white text-center !mb-8'>
            Recent News & Updates
          </Title>

          <Card className='glass-card'>
            <div className='space-y-4'>
              {researchData.recentNews.slice(0, 8).map((news, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    news.highlight
                      ? 'bg-indigo-500/10 border border-indigo-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className='flex-shrink-0'>
                    <Tag
                      color={news.highlight ? 'gold' : 'default'}
                      icon={<CalendarOutlined />}
                    >
                      {news.date}
                    </Tag>
                  </div>
                  <div className='flex-1'>
                    <Text className='text-white'>{news.text}</Text>
                    {news.links && (
                      <div className='flex gap-3 mt-2'>
                        {news.links.paper && (
                          <a
                            href={news.links.paper}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1'
                          >
                            <FileTextOutlined /> Paper
                          </a>
                        )}
                        {news.links.website && (
                          <a
                            href={news.links.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1'
                          >
                            <GlobalOutlined /> Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {news.highlight && (
                    <div className='flex-shrink-0'>
                      <Tag color='gold'>NEW</Tag>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='text-center mt-6'>
              <Button
                type='link'
                href='https://sites.google.com/site/yitingchen0524/home'
                target='_blank'
                icon={<RightOutlined />}
                className='text-indigo-400'
              >
                View All News
              </Button>
            </div>
          </Card>
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
                  valueStyle={{ color: '#818cf8', fontSize: '2.5rem' }}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={<span className='text-white/70'>Skills Tracked</span>}
                  value={stats.skills}
                  valueStyle={{ color: '#c084fc', fontSize: '2.5rem' }}
                  prefix={<RocketOutlined />}
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Statistic
                  title={<span className='text-white/70'>Categories</span>}
                  value={stats.categories}
                  valueStyle={{ color: '#a78bfa', fontSize: '2.5rem' }}
                  prefix={<SearchOutlined />}
                />
              </Col>
              {config.statistics.customStats.map((stat, index) => (
                <Col xs={24} sm={8} md={8} key={index}>
                  <Statistic
                    title={<span className='text-white/70'>{stat.title}</span>}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#818cf8', fontSize: '2.5rem' }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
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

      {/* Features Section */}
      <div className='container mx-auto px-4 py-12 bg-transparent'>
        <Title level={2} className='!text-white text-center !mb-8'>
          Key Features
        </Title>
        <Row gutter={[24, 24]}>
          {config.features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                className='backdrop-blur-md border-white/10 h-full hover:shadow-xl transition-all duration-300 hover:scale-105'
                bordered={false}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                }}
              >
                <div className='text-center'>
                  <div className='text-5xl mb-4 text-indigo-400'>
                    {iconMap[feature.icon] || <RocketOutlined />}
                  </div>
                  <Title level={4} className='!text-white !mb-3'>
                    {feature.title}
                  </Title>
                  <Paragraph className='!text-white/70'>
                    {feature.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

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
                  bordered={false}
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

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Statistic, Space, Spin, Tag } from 'antd';
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
  UserOutlined,
  EyeOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  SmileOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  BankOutlined,
  BookOutlined,
  PictureOutlined,
  LinkOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import ResearchVisionChart from '../components/ResearchVisionChart';
import PhysicalAIEvolutionChart from '../components/PhysicalAIEvolutionChart';

const { Title, Paragraph, Text } = Typography;

// Scroll-reveal hook using IntersectionObserver
const useScrollReveal = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach((el) => observerRef.current?.observe(el));
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return setupObserver;
};

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
      avatar?: string;
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
  url?: string;
  image?: string;
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

interface FeaturedResearch {
  id: string;
  title: string;
  subtitle: string;
  venue: string;
  description: string;
  authors: string;
  link: string;
  image: string;
  color: string;
}

interface TalentProgram {
  id: string;
  title: string;
  description: string;
  season: string;
  link: string;
  image: string;
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
  featuredResearch?: FeaturedResearch[];
  talentPrograms?: TalentProgram[];
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

const talentIconMap: Record<string, React.ReactNode> = {
  ExperimentOutlined: <ExperimentOutlined />,
  TrophyOutlined: <TrophyOutlined />,
  BankOutlined: <BankOutlined />,
  BookOutlined: <BookOutlined />,
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
  const setupObserver = useScrollReveal();

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

  // Setup scroll observer after data loads
  useEffect(() => {
    if (!loading) {
      // Small delay to let DOM render
      const timer = setTimeout(setupObserver, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, setupObserver]);

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

      {/* Physical AI Definition Banner */}
      <div className='container mx-auto px-4 py-8 bg-transparent'>
        <div
          className='reveal rounded-2xl px-6 py-5 md:px-10 md:py-6 text-center'
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(129, 140, 248, 0.15)',
          }}
        >
          <Title level={2} className='!text-white !mb-0'>
            What is Physical AI?
          </Title>
          <PhysicalAIEvolutionChart />
          <Paragraph className='!text-white/80 !text-base md:!text-lg !mb-0 max-w-4xl mx-auto italic mt-5'>
            "Physical AI refers to the use of AI techniques to enable systems to
            perceive, reason, and act in the physical world — by observing it
            through sensors and interacting with it through actuators."
          </Paragraph>
        </div>
      </div>

      {/* Integrated Approach Section — from p.13 */}
      {researchData && researchData.pillars && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <div className='text-center mb-10 reveal'>
            <Title level={2} className='!text-white !mb-3'>
              Our Integrated Approach
            </Title>
            <Paragraph className='!text-white/60 max-w-3xl mx-auto text-base'>
              {researchData.lab.philosophy}
            </Paragraph>
          </div>

          {/* 5 Pillars */}
          <div className='flex flex-wrap justify-center gap-4'>
            {researchData.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className={`reveal delay-${(idx + 1) * 100} flex-1 min-w-[160px] max-w-[220px]`}
              >
                <Card
                  className='backdrop-blur-md border-white/10 h-full text-center hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1'
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    borderTop: `3px solid ${pillar.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
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
              </div>
            ))}
          </div>

          {/* 4 Outcomes */}
          {researchData.outcomes && (
            <div className='mt-10 reveal'>
              <div className='text-center mb-4'>
                <Text className='!text-white/40 uppercase tracking-widest text-xs font-semibold'>
                  Enhancing
                </Text>
              </div>
              <div className='flex flex-wrap justify-center gap-4'>
                {researchData.outcomes.map((outcome, idx) => (
                  <div
                    key={outcome.id}
                    className={`reveal-scale delay-${(idx + 1) * 100} flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5`}
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
      <div className='container mx-auto px-4 py-12 bg-transparent reveal'>
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
            <div className='bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex flex-col md:flex-row items-center gap-4 md:gap-5'>
              {/* Director avatar */}
              <div
                className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-400/30'
                style={{ background: 'rgba(99, 102, 241, 0.1)' }}
              >
                {config.lab.director.avatar ? (
                  <img
                    src={
                      config.lab.director.avatar.startsWith('http')
                        ? config.lab.director.avatar
                        : `${import.meta.env.BASE_URL}${config.lab.director.avatar.replace(/^\//, '')}`
                    }
                    alt={config.lab.director.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-3xl text-indigo-400/60'>
                    <UserOutlined />
                  </div>
                )}
              </div>
              <div className='text-center md:text-left min-w-0'>
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
            </div>
          )}
        </Card>
      </div>

      {/* Research Areas Section */}
      {researchData && (
        <div className='container mx-auto px-4 py-12 bg-transparent'>
          <Title level={2} className='!text-white text-center !mb-8 reveal'>
            Research Areas
          </Title>

          <Row gutter={[24, 24]}>
            {researchData.researchAreas.map((area, idx) => (
              <Col xs={24} lg={12} key={area.id}>
                <div
                  className={`h-full ${idx % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                >
                  <Card
                    id={`area-${area.id}`}
                    className='glass-card h-full'
                    style={{ borderTop: `4px solid ${area.color}` }}
                  >
                    {/* Image area - fixed height for alignment */}
                    {area.image && (
                      <div
                        className='img-placeholder mb-4 overflow-hidden'
                        style={{ height: '200px' }}
                      >
                        <img
                          src={
                            area.image.startsWith('http')
                              ? area.image
                              : `${import.meta.env.BASE_URL}${area.image.replace(/^\//, '')}`
                          }
                          alt={area.name}
                          className='w-full h-full object-cover rounded-xl'
                        />
                      </div>
                    )}
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
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Featured Research Section */}
      {researchData?.featuredResearch &&
        researchData.featuredResearch.length > 0 && (
          <div className='container mx-auto px-4 py-12 bg-transparent'>
            <Title level={2} className='!text-white text-center !mb-3 reveal'>
              Featured Research
            </Title>
            <Paragraph className='!text-white/50 text-center !mb-10 reveal'>
              Recent publications advancing Human-Centered Physical AI
            </Paragraph>

            <Row gutter={[24, 24]}>
              {researchData.featuredResearch.map((project, idx) => (
                <Col xs={24} lg={12} key={project.id}>
                  <div
                    className={`h-full ${idx % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                  >
                    <Card
                      className='glass-card h-full'
                      style={{ borderLeft: `4px solid ${project.color}` }}
                    >
                      {/* Image area - fixed height for alignment */}
                      <div
                        className='img-placeholder mb-4 overflow-hidden'
                        style={{ height: '220px' }}
                      >
                        {project.image ? (
                          <img
                            src={
                              project.image.startsWith('http')
                                ? project.image
                                : `${import.meta.env.BASE_URL}${project.image.replace(/^\//, '')}`
                            }
                            alt={project.title}
                            className='w-full h-full object-contain rounded-xl'
                          />
                        ) : (
                          <div className='flex flex-col items-center gap-2'>
                            <PictureOutlined className='text-3xl' />
                            <span>Project Image</span>
                          </div>
                        )}
                      </div>

                      <div className='flex items-center gap-3 mb-3'>
                        <Title
                          level={3}
                          className='!text-xl !mb-0'
                          style={{ color: project.color }}
                        >
                          {project.title}
                        </Title>
                        <Tag
                          color={project.color}
                          className='!text-xs !font-semibold !rounded-full'
                        >
                          {project.venue}
                        </Tag>
                      </div>

                      <Paragraph className='!text-white/80 !text-sm !mb-2 !font-medium'>
                        {project.subtitle}
                      </Paragraph>
                      <Paragraph className='!text-white/60 !text-sm !mb-3'>
                        {project.description}
                      </Paragraph>
                      <Text className='!text-white/40 !text-xs block mb-3'>
                        {project.authors}
                      </Text>

                      {project.link && (
                        <a
                          href={project.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-white/70 hover:text-indigo-300 transition-colors group text-sm'
                        >
                          <LinkOutlined />
                          <span>Project Page</span>
                          <RightOutlined className='text-xs group-hover:translate-x-1 transition-transform' />
                        </a>
                      )}
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

      {/* Talent & Education Section */}
      {researchData?.talentPrograms &&
        researchData.talentPrograms.length > 0 && (
          <div className='container mx-auto px-4 py-12 bg-transparent'>
            <Title level={2} className='!text-white text-center !mb-3 reveal'>
              Talent & Education
            </Title>
            <Paragraph className='!text-white/50 text-center !mb-10 reveal'>
              Cultivating the next generation to thrive in a fast-changing world
            </Paragraph>

            <Row gutter={[24, 24]}>
              {researchData.talentPrograms.map((program, idx) => (
                <Col xs={24} sm={12} lg={6} key={program.id}>
                  <div className={`h-full reveal delay-${(idx + 1) * 100}`}>
                    <Card className='glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                      {/* Image area - fixed height for alignment */}
                      <div
                        className='img-placeholder mb-4 overflow-hidden'
                        style={{ height: '160px' }}
                      >
                        {program.image ? (
                          <img
                            src={
                              program.image.startsWith('http')
                                ? program.image
                                : `${import.meta.env.BASE_URL}${program.image.replace(/^\//, '')}`
                            }
                            alt={program.title}
                            className='w-full h-full object-cover rounded-xl'
                          />
                        ) : (
                          <div className='flex flex-col items-center gap-2'>
                            <PictureOutlined className='text-3xl' />
                            <span>Program Photo</span>
                          </div>
                        )}
                      </div>

                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl text-indigo-400'>
                          {talentIconMap[program.icon] || <RocketOutlined />}
                        </span>
                        <Title level={5} className='!text-white !mb-0 !text-sm'>
                          {program.title}
                        </Title>
                      </div>

                      <div className='flex items-center gap-1 mb-2'>
                        <CalendarOutlined className='text-white/40 text-xs' />
                        <Text className='!text-white/40 !text-xs'>
                          {program.season}
                        </Text>
                      </div>

                      <Paragraph className='!text-white/60 !text-xs !mb-3'>
                        {program.description}
                      </Paragraph>

                      {program.link && (
                        <a
                          href={program.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-xs'
                        >
                          <LinkOutlined />
                          <span>Learn more</span>
                        </a>
                      )}
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

      {/* Statistics Section */}
      {config.statistics.showStats && stats && (
        <div className='container mx-auto px-4 py-12 bg-transparent reveal-scale'>
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

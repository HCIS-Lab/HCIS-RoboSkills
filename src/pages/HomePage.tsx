import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Modal,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  RocketOutlined,
  RobotOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// --- CSS-in-JS Styles for Venn Diagrams ---
const vennStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .reveal-base {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .reveal-active {
    opacity: 1;
    transform: translateY(0);
  }

  .glass-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transition: 0.5s;
    transform: skewX(-15deg);
    pointer-events: none;
  }
  .glass-card:hover::before {
    animation: shine 1.2s ease-in-out;
  }
  .glass-card:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .circle-base {
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: screen;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  }
  .circle-base:hover {
    transform: scale(1.15);
    z-index: 20;
    box-shadow: 0 15px 45px rgba(255, 255, 255, 0.2);
  }
  .gradient-text {
    background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-move 5s ease infinite;
  }
  @keyframes gradient-move {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Ant Modal Customization */
  .ant-modal-content {
    background: rgba(20, 20, 35, 0.95) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 24px !important;
    padding: 0 !important;
  }
`;

// Helper for scroll reveal animation using Intersection Observer
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-base ${isVisible ? 'reveal-active' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface ResearchCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  index: number;
}

const ResearchCard: React.FC<ResearchCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  index,
}) => (
  <ScrollReveal delay={index * 100}>
    <div
      className='glass-card p-8 rounded-3xl h-full flex flex-col items-start cursor-pointer group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]'
      style={{ borderLeft: `4px solid ${color}` }}
      onClick={onClick}
    >
      <div className='absolute top-0 right-0 p-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />

      <div
        className='p-4 rounded-2xl mb-6 bg-opacity-20 transition-all group-hover:scale-110 duration-500 shadow-lg'
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        <span className='text-3xl filter drop-shadow-md'>{icon}</span>
      </div>
      <h3 className='text-2xl font-semibold text-white mb-3 group-hover:text-white/90 tracking-wide'>
        {title}
      </h3>
      <p className='text-white/60 text-base leading-relaxed font-light'>{description}</p>
      <div className='mt-auto pt-6 flex items-center text-sm font-medium opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2' style={{ color }}>
        Explore research <ArrowRightOutlined className="ml-2" />
      </div>
    </div>
  </ScrollReveal>
);

// Hardcoded config for reliability as per plan
const researchAreas = [
  {
    title: 'Human-Centered Robotics',
    description: 'Developing robots that understand and adapt to human needs, intentions, and physical capabilities.',
    icon: <RobotOutlined />,
    color: '#818cf8', // Indigo
    details: {
      projects: [],
      publications: []
    }
  },
  {
    title: 'Intelligent Environments',
    description: 'Creating smart spaces where agents, sensors, and humans interact seamlessly to accomplish complex tasks.',
    icon: <EnvironmentOutlined />,
    color: '#34d399', // Emerald
    details: {
      projects: [],
      publications: []
    }
  },
  {
    title: 'Caregiving & Assistance',
    description: 'Empowering care recipients and caregivers through physical AI that assists with daily living activities.',
    icon: <HeartOutlined />,
    color: '#f472b6', // Pink
    details: {
      projects: [],
      publications: []
    }
  },
  {
    title: 'Skill Visualization',
    description: 'Mapping the landscape of robotic capabilities to identify gaps and opportunities in research.',
    icon: <RocketOutlined />,
    color: '#fbbf24', // Amber
    details: {
      projects: [],
      publications: []
    }
  },
];

const HomePage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  // State for specific research modal content
  const [activeResearch, setActiveResearch] = useState<typeof researchAreas[0] | null>(null);


  return (
    <div className='min-h-screen pb-20'>
      <style>{vennStyles}</style>

      {/* Hero Section - "Google Style" Center Focus */}
      <div className='relative pt-40 pb-24 px-4'>
        {/* Simple Search Header Concept */}
        <div className='max-w-5xl mx-auto text-center z-10 relative'>
          <div className='mb-10 inline-block'>
            <img
              src={`${import.meta.env.BASE_URL}hcis-lab-logo-dark.svg`}
              alt="HCIS Lab"
              className="h-28 md:h-36 w-auto drop-shadow-[0_0_25px_rgba(129,140,248,0.4)] hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div style={{ animation: 'fadeInUp 1s ease-out' }}>
            <Title className='!text-6xl md:!text-8xl !mb-8 !font-extrabold tracking-tight'>
              <span className="gradient-text">
                Human-Centered
              </span>
              <br />
              <span className="text-white drop-shadow-xl">Physical AI</span>
            </Title>
          </div>

          <div style={{ animation: 'fadeInUp 1s ease-out 0.2s backwards' }}>
            <Paragraph className='!text-3xl md:!text-4xl !text-white/60 max-w-3xl mx-auto mb-16 font-light leading-relaxed'>
              Bridging the gap between robotic capabilities and human needs through intelligent, adaptive, and safe physical interaction.
            </Paragraph>
          </div>

          {/* "Search" Bar Visual - Main Call to Action */}
          <div className='max-w-3xl mx-auto relative group' style={{ animation: 'fadeInUp 1s ease-out 0.4s backwards' }}>
            <Link to="/overview">
              <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-3 pl-8 flex items-center shadow-2xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_0_50px_rgba(129,140,248,0.2)]'>
                <SearchOutlined className='text-2xl text-white/40 mr-4' />
                <span className='text-xl text-white/40 flex-1 text-left font-light tracking-wide'>
                  Search for robotic skills...
                </span>
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  className="!bg-indigo-600 hover:!bg-indigo-500 !border-none !h-14 !px-10 !text-lg !font-medium"
                >
                  Explore
                </Button>
              </div>
            </Link>
            {/* Trending section removed as requested */}
          </div>
        </div>
      </div>

      {/* Visualizations Section (The Schematic) */}
      <div className='container mx-auto px-4 py-20 relative'>
        {/* Connecting Line / Flow Element */}


        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 text-center'>

          {/* Left Diagram: Environment / Agent */}
          <ScrollReveal delay={0}>
            <div
              className='glass-card rounded-[3rem] p-12 relative overflow-hidden min-h-[500px] flex items-center justify-center cursor-pointer group'
              onClick={() => setActiveModal('environment')}
            >
              <div className='absolute top-8 left-8 text-left z-20 pointer-events-none'>
                <h3 className='text-white/90 font-bold text-2xl mb-1'>Environment (Agent)</h3>
                <div className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
                  <p className='text-sm text-white/50 uppercase tracking-widest'>Interactive Model</p>
                </div>
              </div>

              {/* Click Hint */}
              <div className='absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Tag color="cyan" className='!bg-emerald-500/20 !border-emerald-500/30 !text-emerald-300 py-1 px-3 rounded-full'>Click to Explore</Tag>
              </div>

              {/* Agent Circle (Container) */}
              <div className='relative w-[340px] h-[340px] border border-dashed border-amber-500/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite] group-hover:border-amber-500/40 transition-colors'>
                {/* Inner Content - Static */}
              </div>

              {/* Static Overlay for Content */}
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                {/* Robots */}
                <div className='circle-base w-36 h-36 bg-indigo-600/50 backdrop-blur-md -translate-x-12 -translate-y-8 z-10 border border-white/10 group-hover:bg-indigo-600/70'>
                  Robots
                </div>
                {/* Caregiver */}
                <div className='circle-base w-36 h-36 bg-blue-500/50 backdrop-blur-md translate-x-12 -translate-y-8 z-10 border border-white/10 group-hover:bg-blue-500/70'>
                  Caregiver
                </div>
                {/* Care Recipient */}
                <div className='circle-base w-36 h-36 bg-rose-500/50 backdrop-blur-md translate-y-16 z-20 border border-white/10 group-hover:bg-rose-500/70'>
                  Care<br />Recipient
                </div>
              </div>

              {/* Annotation Labels - Removed "Tasks" as requested */}
              <div className='absolute top-[18%] right-[8%] text-amber-200/80 font-handwriting transform rotate-12 text-lg'>
                Human-Centered<br />Intelligence
              </div>
            </div>
          </ScrollReveal>

          {/* Right Diagram: Human-Robot Intersection */}
          <ScrollReveal delay={200}>
            <div
              className='glass-card rounded-[3rem] p-12 relative overflow-hidden min-h-[500px] flex items-center justify-center cursor-pointer group'
              onClick={() => setActiveModal('interaction')}
            >
              <div className='absolute top-8 left-8 text-left z-20 pointer-events-none'>
                <h3 className='text-white/90 font-bold text-2xl mb-1'>Interaction Model</h3>
                <div className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></span>
                  <p className='text-sm text-white/50 uppercase tracking-widest'>Hardware vs. Behavior</p>
                </div>
              </div>

              {/* Click Hint */}
              <div className='absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Tag color="cyan" className='!bg-blue-500/20 !border-blue-500/30 !text-blue-300 py-1 px-3 rounded-full'>Click to Explore</Tag>
              </div>

              <div className='relative w-full h-full flex items-center justify-center pointer-events-none'>
                {/* Robot Sphere - Large (Outer Ring) */}
                <div
                  className='circle-base w-[320px] h-[320px] bg-blue-600/20 border-2 border-blue-500/50 z-0 flex pt-8 shadow-[0_0_60px_rgba(37,99,235,0.2)]'
                  style={{ alignItems: 'flex-start' }} // Force alignment to top
                >
                  {/* Robot Label - Top Center */}
                  <span className="text-blue-300 text-xl font-bold tracking-[0.2em] relative top-4">ROBOT</span>
                </div>

                {/* Human Sphere - Small (Strictly Centered) */}
                <div className='circle-base w-[140px] h-[140px] bg-yellow-400 text-black z-20 border-4 border-white/20 shadow-[0_0_50px_rgba(250,204,21,0.6)] absolute inset-0 m-auto'>
                  <span className="font-bold text-lg">HUMAN</span>
                </div>

                {/* Orbiting Elements for visual effect */}
                <div className='absolute inset-0 m-auto w-[250px] h-[250px] border border-white/10 rounded-full animate-spin-slow-reverse border-dashed opacity-50'></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Modals for Interactivity */}
      <Modal
        open={activeModal === 'environment'}
        onCancel={() => setActiveModal(null)}
        footer={null}
        width={800}
        centered
        className="glass-modal"
        closeIcon={<CloseOutlined className="text-white text-xl" />}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl">
              <ExperimentOutlined />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Environmental Intelligence</h2>
              <p className="text-emerald-400 font-medium">Multi-Agent Systems & Caregiving</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold mb-2">🤖 Robots</h3>
              <p className="text-white/60 text-sm">Autonomous agents capable of perception, navigation, and manipulation in unstructured environments.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold mb-2">👨‍⚕️ Caregivers</h3>
              <p className="text-white/60 text-sm">Human experts providing high-level supervision and specialized care interventions.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold mb-2">👴 Recipients</h3>
              <p className="text-white/60 text-sm">Individuals receiving care, whose safety, comfort, and dignity are the primary optimization goals.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">HCIS Lab Research Focus</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Collaborative Task Planning:</strong> How robots and caregivers coordinate to assist recipients efficiently.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span><strong>Safety-First Design:</strong> Ensuring physical safety in close-proximity human-robot interactions.</span>
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'interaction'}
        onCancel={() => setActiveModal(null)}
        footer={null}
        width={800}
        centered
        closeIcon={<CloseOutlined className="text-white text-xl" />}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-blue-500/20 text-blue-400 text-3xl">
              <SafetyCertificateOutlined />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Human-Robot Interaction Model</h2>
              <p className="text-blue-400 font-medium">Hardware Capabilities vs. Adaptive Behavior</p>
            </div>
          </div>

          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Our approach to Physical AI places the <strong>Human</strong> at the center of the robotic system. We view the Robot not just as hardware, but as an adaptive entity that encompasses the human within its operational logic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="relative p-6 rounded-2xl bg-blue-900/20 border border-blue-500/30 overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 bg-blue-500/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
              <h3 className="text-2xl font-bold text-blue-300 mb-2">Hardware Layer</h3>
              <p className="text-white/60">
                The physical substrate: Actuators, Sensors, Soft Materials. This forms the "Robot" circle's foundation—the robust, reliable machine body.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-yellow-900/20 border border-yellow-500/30 overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 bg-yellow-500/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Adaptive Layer</h3>
              <p className="text-white/60">
                The "Human" center: Whole-Body Control, Intent Recognition, and Social Awareness. This logic dictates <em>how</em> the hardware moves relative to the human.
              </p>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-indigo-500">
            <p className="text-white italic">
              "True physical AI doesn't just work near humans; it works <strong>with</strong> and <strong>for</strong> them, adjusting its very stiffness and behavior to match human frailty."
            </p>
          </div>
        </div>
      </Modal>

      {/* Research Directions Grid */}
      <div className='container mx-auto px-4 py-12 relative'>
        {/* Visual Bridge/Flow */}


        <div className='flex items-center justify-between mb-8'>
          <Title level={2} className='!text-white !m-0'>Research Directions</Title>
          <Button type="link" className='text-white/50 hover:text-white'>View All Publications</Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {researchAreas.map((area, index) => (
            <ResearchCard
              key={index}
              {...area}
              index={index}
              onClick={() => {
                setActiveResearch(area);
                setActiveModal('research_domain');
              }}
            />
          ))}
        </div>
      </div>

      {/* Research Domain Dynamic Modal */}
      <Modal
        open={activeModal === 'research_domain' && activeResearch !== null}
        onCancel={() => {
          setActiveModal(null);
          setTimeout(() => setActiveResearch(null), 300); // clear after anim
        }}
        footer={null}
        width={700}
        centered
        closeIcon={<CloseOutlined className="text-white text-xl" />}
      >
        {activeResearch && (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6" style={{ color: activeResearch.color }}>
              <div className="text-5xl">
                {activeResearch.icon}
              </div>
              <h2 className="text-3xl font-bold text-white mb-0">{activeResearch.title}</h2>
            </div>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {activeResearch.description}
            </p>

            <div className="space-y-6">
              {activeResearch.details.projects.length > 0 || activeResearch.details.publications.length > 0 ? (
                <>
                  {activeResearch.details.projects.length > 0 && (
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-white/20"></span> Active Projects
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {activeResearch.details.projects.map((project, i) => (
                          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                            <span className="text-white/90">{project}</span>
                            <ArrowRightOutlined className="text-white/30" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeResearch.details.publications.length > 0 && (
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-white/20"></span> Recent Publications
                      </h4>
                      <ul className="space-y-2">
                        {activeResearch.details.publications.map((pub, i) => (
                          <li key={i} className="text-white/50 text-sm hover:text-indigo-300 transition-colors cursor-pointer flex items-start gap-2">
                            <span className="mt-1">•</span>
                            {pub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/5 border border-white/5 p-8 rounded-2xl text-center">
                  <p className="text-white/50 text-lg">Content for this research area is coming soon.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <Button type="primary" size="large" onClick={() => setActiveModal(null)}
                style={{ backgroundColor: activeResearch.color }}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Projects Section - Templates */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          <Title level={2} className='!text-white !m-0'>Active Projects</Title>
          <p className='text-white/50 mt-2'>Ongoing robotics development and experiments (Template)</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className='glass-card p-8 rounded-3xl border border-white/5 relative group hover:border-indigo-500/30 transition-all duration-500'>
                <div className='absolute top-4 right-4'>
                  <Tag color="blue" className='!bg-indigo-500/20 !border-indigo-500/30 !text-indigo-300'>In Progress</Tag>
                </div>
                <div className='w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-2xl text-indigo-400 group-hover:scale-110 transition-transform'>
                  <RocketOutlined />
                </div>
                <h3 className='text-xl font-bold text-white mb-3'>Project Title {i}</h3>
                <p className='text-white/60 mb-6'>
                  This is a placeholder description for a research project. It details the objectives, methodology, and expected outcomes.
                </p>
                <div className='flex gap-2 flex-wrap'>
                  <span className='px-3 py-1 rounded-full bg-white/5 text-xs text-white/40'>Robotics</span>
                  <span className='px-3 py-1 rounded-full bg-white/5 text-xs text-white/40'>AI</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Featured Demonstrations - Dynamic Video Gallery */}
      <div className='container mx-auto px-4 py-16 border-t border-white/5'>
        <div className='text-center mb-12'>
          <Title level={2} className='!text-white !m-0'>Featured Demonstrations</Title>
          <p className='text-white/50 mt-2'>Watch our robots in action</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {(() => {
            // Dynamic Video/Image Loader Logic
            const mediaModules = import.meta.glob('../assets/demo-videos/*.{mp4,png,jpg,jpeg}', { eager: true, as: 'url' });

            const mediaFiles = Object.entries(mediaModules).map(([path, url]) => {
              // Extract filename with extension to check type
              const fileWithExt = path.split('/').pop() || '';
              // Remove extension for text parsing
              const filename = fileWithExt.replace(/\.(mp4|png|jpg|jpeg)$/i, '');
              const extension = fileWithExt.split('.').pop()?.toLowerCase();

              const parts = filename.split('_');

              const order = parseInt(parts[0]) || 999;
              const title = parts[1] || 'Untitled';
              const description = parts.slice(2).join('_') || 'No description available.';

              return { order, title, description, url, filename, extension };
            }).sort((a, b) => a.order - b.order);

            if (mediaFiles.length === 0) {
              return (
                <div className='col-span-full text-center py-12 glass-card rounded-3xl'>
                  <p className='text-white/50'>No media found in src/assets/demo-videos</p>
                  <p className='text-xs text-white/30 mt-2'>Add files named: Order_Title_Description.[mp4/png/jpg]</p>
                </div>
              );
            }

            return mediaFiles.map((item, index) => (
              <ScrollReveal key={item.filename} delay={index * 150}>
                <div className='glass-card rounded-3xl overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all'>
                  {/* Media Container */}
                  <div className='aspect-video bg-black/40 relative flex items-center justify-center group-hover:bg-black/30 transition-colors'>
                    {['mp4', 'webm'].includes(item.extension || '') ? (
                      <video
                        src={item.url}
                        controls
                        className='w-full h-full object-cover'
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    )}
                  </div>
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-white mb-2'>{item.title}</h3>
                    <p className='text-white/60 text-sm'>
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ));
          })()}
        </div>
      </div>

      {/* Timeline Section - Templates */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center mb-16'>
          <Title level={2} className='!text-white !m-0'>Lab History</Title>
          <p className='text-white/50 mt-2'>A timeline of our milestones and breakthroughs</p>
        </div>

        <div className='max-w-4xl mx-auto space-y-12 relative'>
          {/* Vertical Line */}
          <div className='absolute left-[28px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-30'></div>

          {[
            { year: 2026, title: 'Future Milestone', desc: 'Planned expansion into multi-agent collaborative caregiving scenarios.' },
            { year: 2025, title: 'Advanced Integration', desc: 'Deployment of full-stack physical AI systems in pilot clinical environments.' },
            { year: 2024, title: 'Core Technology', desc: 'Breakthroughs in adaptive force control and human-intent prediction.' },
            { year: 'Feb 2021', title: 'HCIS Lab Established', desc: 'Founded at National Yang Ming Chiao Tung University.' }
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className='relative pl-16 group'>
                {/* Dot */}
                <div className='absolute left-[20px] top-2 w-[18px] h-[18px] rounded-full bg-gray-900 border-2 border-indigo-500 z-10 group-hover:bg-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300'></div>

                <div className='glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors'>
                  <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2'>
                    <h4 className='text-xl font-bold text-white'>{item.title}</h4>
                    <span className='text-indigo-400 font-mono text-lg'>{item.year}</span>
                  </div>
                  <p className='text-white/60'>
                    {item.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Footer Simple */}
      <div className='text-center pt-12 pb-8 mt-12'>
        <Text className='text-white/30'>© {new Date().getFullYear()} HCIS Lab • National Yang Ming Chiao Tung University</Text>
      </div>

    </div>
  );
};

export default HomePage;

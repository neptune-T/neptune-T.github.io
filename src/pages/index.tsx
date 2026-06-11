import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { FaBook, FaFlask, FaUser, FaGithub } from 'react-icons/fa';

// 引入拆分出去的 Header 组件
import Header from '@/components/Header';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { GITHUB_URL, SITE_URL } from '@/lib/site';

const HomeHeroScene = dynamic(() => import('@/components/HomeHeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-xs font-mono opacity-70">LOADING SCENE...</div>
    </div>
  ),
});

export default function HomePage() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // body 背景由 ThemeProvider 统一同步；这里只保留历史兼容的 margin/padding 兜底
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: 'easeOut' } 
    },
  };

  const theme = {
    bg: isDarkMode ? 'bg-[#161310]' : 'bg-warm-canvas',
    
    // --- 字体颜色 ---
    heroTitle: isDarkMode ? 'text-[#f1e8dc]' : 'text-black',
    heroSubtitle: isDarkMode ? 'text-[#d8ccc0]' : 'text-gray-800',
    heroBody: isDarkMode ? 'text-[#aaa096]' : 'text-gray-600',
    
    // --- 参数网格 ---
    statsLabel: isDarkMode ? 'text-[#82786f]' : 'text-gray-400',
    statsValue: isDarkMode ? 'text-[#eee4d8]' : 'text-gray-900',
    statsBorder: isDarkMode ? 'border-[#f3e8dc]/10' : 'border-black/10',

    // --- 大卡片样式 (Academic Profile) ---
    academicProfileCard: isDarkMode
      ? 'bg-[#241f1b]/66 backdrop-blur-2xl backdrop-saturate-150 border border-[#f3e8dc]/10 ring-1 ring-[#cc785c]/[0.04] rounded-3xl p-10 md:p-16'
      : 'bg-warm-surface/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/70 ring-1 ring-black/[0.04] rounded-3xl p-10 md:p-16',

    // --- Footer ---
    newFooterContainer: isDarkMode
      ? 'bg-[#241f1b]/66 backdrop-blur-2xl backdrop-saturate-150 border border-[#f3e8dc]/10 text-[#d8ccc0] rounded-3xl p-8 md:p-10'
      : 'bg-warm-surface/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/70 text-warm-ink rounded-3xl p-8 md:p-10',
    footerDivider: isDarkMode ? 'bg-[#f3e8dc]/10' : 'bg-black/10',
    footerIcon: isDarkMode ? 'hover:text-[#f1e8dc] text-[#9f958b]' : 'hover:text-black text-gray-500',

    cardBorder: isDarkMode ? 'border-[#f3e8dc]/10' : 'border-black/5',
    cardBg: isDarkMode ? 'bg-[#1d1916]' : 'bg-warm-surface',
    buttonPrimary: isDarkMode ? 'bg-[#e7dacb] text-[#1b1714] hover:bg-[#f1e8dc] border-transparent' : 'bg-black text-white hover:bg-gray-800 border-transparent',
    buttonOutline: isDarkMode ? 'border-[#e7dacb]/25 hover:bg-[#e7dacb]/[0.07] text-[#e7dacb]' : 'border-black/20 hover:bg-black/5 text-black',
    
    // --- 学术专栏 (Columns) 样式 ---
    glassCard: isDarkMode 
      ? 'bg-[#241f1b]/62 backdrop-blur-xl backdrop-saturate-150 border border-[#f3e8dc]/[0.08] hover:bg-[#2b2520]/78 transition-colors duration-300'
      : 'bg-warm-surface/55 backdrop-blur-xl backdrop-saturate-150 border border-white/70 hover:bg-warm-surface/80 transition-colors duration-300',
    
    columnText: isDarkMode ? 'text-[#aaa096]' : 'text-gray-600',
    columnTitle: isDarkMode ? 'text-[#eee4d8]' : 'text-gray-900',
    
    // --- [修改] 图标背景 - 统一为单色调 ---
    iconBgMono: isDarkMode ? 'bg-coral/15' : 'bg-warm-panel',
    // --- [修改] 图标颜色 - 自适应 ---
    iconColor: isDarkMode ? 'text-[#dfa089]' : 'text-gray-900',

    // --- [修改] 标签条样式 - 统一为单色调 ---
    tagMono: isDarkMode 
      ? 'bg-[#2b2520]/75 text-[#d8ccc0] hover:bg-[#342c26] border border-[#f3e8dc]/[0.08]'
      : 'bg-warm-panel text-warm-ink hover:bg-[#e7ddcf] border border-black/5',
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ease-in-out ${theme.bg} font-sans selection:bg-purple-500/30 flex flex-col`}>
      
      <Head>
        <title>Tianshan Zhang (张天山) | 3D Vision and Generative AI</title>
        <meta
          key="description"
          name="description"
          content="Tianshan Zhang's academic homepage, with research on 3D vision, generative AI, computer graphics, and physically plausible hand-object interaction."
        />
        <meta key="og-title" property="og:title" content="Tianshan Zhang | 3D Vision and Generative AI" />
        <meta key="og-description" property="og:description" content="Research projects, publications, and technical notes by Tianshan Zhang." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Tianshan Zhang',
              alternateName: '张天山',
              url: SITE_URL,
              sameAs: [GITHUB_URL],
              knowsAbout: ['3D Vision', 'Generative AI', 'Computer Graphics', 'Physical Simulation'],
            }),
          }}
        />
      </Head>

      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative flex min-h-[100svh] w-full flex-col justify-center px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-24 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 md:flex-row lg:gap-14">
          <div className="z-10 flex w-full flex-col space-y-6 text-left md:w-[43%]">
            <div>
              <h1 className={`mb-5 text-5xl font-bold leading-[1.05] tracking-normal transition-colors duration-500 md:text-6xl lg:text-[64px] ${theme.heroTitle}`}>
                Tianshan Zhang 
              </h1>
              <p className={`mb-3 text-lg font-light tracking-normal transition-colors duration-500 md:text-xl ${theme.heroSubtitle}`}>
              B.S. Candidate
              </p>
              <p className={`text-sm md:text-base leading-relaxed max-w-md transition-colors duration-500 ${theme.heroBody}`}>
              Computer Science and Materials Science
                <br /><br />
                A view of computer graphics, expressed through {isDarkMode ? 'physical simulation' : 'generative imaging'}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/notes" className={`flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-bold tracking-normal transition-all ${theme.buttonPrimary}`}>
                Explore Notes <ArrowRight size={16} />
              </Link>
              <Link href="/papers" className={`rounded-lg border px-6 py-2.5 text-sm font-bold tracking-normal transition-all ${theme.buttonOutline}`}>
                View Papers
              </Link>
            </div>
              <div className={`grid grid-cols-3 gap-4 border-t pt-6 transition-colors duration-500 ${theme.statsBorder}`}>
                <div>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${theme.statsLabel}`}>FIELD</p>
                  <p className={`text-lg font-bold ${theme.statsValue}`}>CS & AI</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${theme.statsLabel}`}>INTEREST</p>
                  <p className={`text-lg font-bold ${theme.statsValue}`}>{isDarkMode ? '3D Vision' : 'GenAI'}</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${theme.statsLabel}`}>ROLE</p>
                  <p className={`text-lg font-bold ${theme.statsValue}`}>Research Intern</p>
                </div>
            </div>
          </div>
          <div className="flex w-full justify-center md:w-[52%] md:justify-end">
            <div className={`relative aspect-square w-full overflow-hidden rounded-[24px] border transition-all duration-700 md:max-w-[500px] ${theme.cardBorder} ${isDarkMode ? 'bg-[#1d1916]' : 'bg-warm-canvas'}`}>
              <div className={`absolute inset-3 rounded-[18px] border pointer-events-none z-10 ${isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`} />
              <div className={`absolute top-7 left-7 z-10 pointer-events-none transition-colors duration-700 ${isDarkMode ? 'text-[#e7dacb]' : 'text-[#242321]'}`}>
                <h2 className="text-sm font-semibold uppercase">
                  Stanford Bunny
                </h2>
                <div className={`h-px w-10 my-2.5 ${isDarkMode ? 'bg-white/25' : 'bg-black/20'}`} />
                <p className="font-mono text-[10px] leading-relaxed opacity-60">
                  PLY / INTERACTIVE SURFACE<br/>
                  DRAG TO ROTATE · HOVER TO DEFORM
                </p>
              </div>
              <div className={`absolute right-7 bottom-7 z-10 pointer-events-none rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase ${isDarkMode ? 'border-[#f3e8dc]/10 bg-[#161310]/30 text-[#c0b4a8]' : 'border-black/10 bg-warm-surface/60 text-black/50'}`}>
                {isDarkMode ? 'Night study' : 'Day study'}
              </div>
              <HomeHeroScene isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className={`py-20 relative z-20 transition-colors duration-700 flex-grow`}>
        {/* Profile - 大毛玻璃卡片包裹 */}
        <motion.div 
          id="profile"
          className={`px-4 md:px-10 lg:px-20 max-w-6xl mx-auto mb-24 ${theme.academicProfileCard}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInVariants}
        >
          <motion.h2 className={`text-3xl md:text-5xl font-bold mb-16 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Academic Profile
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Research Interests - [修改] 增加分行和列表结构 */}
              <div>
                  <h3 className={`text-3xl font-bold mb-8 opacity-90 ${theme.columnTitle}`}>Research Interests</h3>
                  <ul className={`${theme.columnText} leading-relaxed text-lg space-y-6`}>
                    <li>
                      <strong className={`block mb-2 ${theme.columnTitle} opacity-90`}>Theoretical Generative Modeling (Image & Video)</strong>
                      My research is grounded in the theoretical foundations of generative modeling. I approach this from a mathematical perspective, specifically studying Diffusion and Autoregressive models through their connections to Markov processes, SDEs, and Boltzmann-type distributions.
                    </li>
                    <li>
                      <strong className={`block mb-2 ${theme.columnTitle} opacity-90`}>Interactive & Navigable 3D Environments</strong>
                      I am interested in the autonomous generation of navigable 3D scenes. My goal is to develop systems that can generate complex 3D environments where users or agents can freely move and interact, bridging the gap between static 3D assets and dynamic virtual spaces.
                    </li>
                  </ul>
              </div>
              
              {/* Biography - [修改] 增加分段 */}
              <div>
                  <h3 className={`text-3xl font-bold mb-8 opacity-90 ${theme.columnTitle}`}>Biography</h3>
                  <div className={`${theme.columnText} leading-relaxed text-lg space-y-6 text-justify`}>
                    <p>
                      I am an undergraduate with a dual focus in Computer Science and Materials Science. My passion lies in understanding complex systems from first principles—ranging from deriving the Maxwell-Boltzmann distribution and Schrödinger equation in statistical mechanics, to engineering core systems in computer science.
                    </p>
                    <p>
                      My technical background is rooted in hands-on systems programming. I have implemented a compiler front-end (from source to AST/IR) and extended the xv6 operating system with advanced features like copy-on-write fork and priority-based scheduling.
                    </p>
                    <p>

                    </p>
                  </div>
              </div>
          </div>
          
          {/* Affiliations
          <div className="mt-16 pt-8 border-t border-white/10">
              <h3 className={`text-2xl font-bold mb-8 opacity-90 ${theme.columnTitle}`}>Affiliations</h3>
              <div className="flex flex-wrap gap-4">
                  <div className={`px-6 py-3 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-colors cursor-default text-sm font-medium`}>
                    Peking University (Visiting)
                  </div>
                  <div className={`px-6 py-3 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-colors cursor-default text-sm font-medium`}>
                    Institute of Automation, CAS (Visiting)
                  </div>
              </div>
          </div> */}
        </motion.div>

        {/* Columns - [修改] 应用单色调主题 */}
        <div className={`px-4 md:px-10 lg:px-20 max-w-7xl mx-auto border-t pt-20 mb-10 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
            <motion.h2 
              className={`text-3xl md:text-4xl font-bold mb-16 text-center ${theme.columnTitle}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeInVariants}
            >
              Academic Columns
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Notes */}
                <motion.div 
                  className={`p-8 rounded-2xl ${theme.glassCard}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInVariants}
                >
                    <div className="flex items-center mb-6">
                        {/* [修改] 使用 iconBgMono 和 iconColor */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${theme.iconBgMono}`}>
                            <FaFlask className={`w-4 h-4 ${theme.iconColor}`} />
                        </div>
                        <h3 className={`text-xl font-bold tracking-wide ${theme.columnTitle}`}>Notes</h3>
                    </div>
                    <p className={`${theme.columnText} mb-8 text-sm h-16 leading-relaxed`}>Research notes and methodological insights from my ongoing projects.</p>
                    <div className="space-y-3">
                        {/* [修改] 使用 tagMono */}
                        <Link href="/notes/SequenceModeling" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           Sequence Modeling
                        </Link>
                        <Link href="/notes/3DGaussianSplatting" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           3D Gaussian Splatting
                        </Link>
                    </div>
                </motion.div>
                
                {/* 2. Papers */}
                <motion.div 
                  className={`p-8 rounded-2xl ${theme.glassCard}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{delay: 0.1}} variants={fadeInVariants}
                >
                    <div className="flex items-center mb-6">
                          {/* [修改] 使用 iconBgMono 和 iconColor */}
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${theme.iconBgMono}`}>
                            <FaBook className={`w-4 h-4 ${theme.iconColor}`} />
                        </div>
                        <h3 className={`text-xl font-bold tracking-wide ${theme.columnTitle}`}>Papers</h3>
                    </div>
                    <p className={`${theme.columnText} mb-8 text-sm h-16 leading-relaxed`}>Critical reviews and summaries of influential papers in AI.</p>
                    <div className="space-y-3">
                        {/* [修改] 使用 tagMono */}
                        <a href="https://github.com/AIGeeksGroup/DragMesh-2" target="_blank" rel="noreferrer" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           DragMesh-2
                        </a>
                        <a href="https://arxiv.org/abs/2512.06424" target="_blank" rel="noreferrer" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           DragMesh
                        </a>
                    </div>
                </motion.div>

                {/* 3. About Me */}
                <motion.div 
                  className={`p-8 rounded-2xl ${theme.glassCard}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{delay: 0.2}} variants={fadeInVariants}
                >
                    <div className="flex items-center mb-6">
                        {/* [修改] 使用 iconBgMono 和 iconColor */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${theme.iconBgMono}`}>
                            <FaUser className={`w-4 h-4 ${theme.iconColor}`} />
                        </div>
                        <h3 className={`text-xl font-bold tracking-wide ${theme.columnTitle}`}>About Me</h3>
                    </div>
                    <p className={`${theme.columnText} mb-8 text-sm h-16 leading-relaxed`}>Personal reflections on academic life and philosophy.</p>
                    <div className="space-y-3">
                        {/* [修改] 使用 tagMono */}
                        <Link href="/about" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           Academic Journey
                        </Link>
                        <Link href="/about#honors" className={`block w-full py-2.5 px-4 rounded text-xs font-medium tracking-wide transition-all ${theme.tagMono}`}>
                           Honors &amp; Awards
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* FOOTER (保持不变) */}
      <footer className="w-full py-10 px-4 md:px-10 lg:px-20 flex justify-center relative z-10">
        <div className={`w-full max-w-6xl rounded-3xl border p-8 md:p-10 transition-all duration-500 ${theme.newFooterContainer}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h3 className="text-xl font-bold tracking-tight mb-1">Plote</h3>
               <p className="opacity-80 text-sm">Academic Homepage</p>
            </div>
            <div className="flex gap-6 items-center">
               <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={`transition-colors duration-300 ${theme.footerIcon}`} aria-label="GitHub"> <FaGithub size={24} /> </a>
            </div>
          </div>
          <div className={`w-full h-px my-8 ${theme.footerDivider}`}></div>
          <div className="text-center text-sm opacity-60">
            <p>© 2026 Plote · “We can only see a short distance ahead, but we can see plenty there that needs to be done.” — Alan Turing</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

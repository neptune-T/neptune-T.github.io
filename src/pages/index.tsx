import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { GITHUB_URL, SITE_URL } from '@/lib/site';

const researchExperience = [
  {
    institution: 'Peking University',
    period: '2025 – Present',
    focus: 'Vision-Language-Action Models, Generative Models, Robotic Manipulation',
    description: 'Exploring VLA models and generative policies for robot manipulation.',
  },
  {
    institution: 'Zhipu AI',
    period: '2025 – 2026',
    focus: 'Mathematical Reasoning, LLM Inference',
    description: 'Studying inference strategies for mathematical problem solving in large language models.',
  },
  {
    institution: 'Institute of Automation, CAS',
    period: '2024 – 2025',
    focus: 'Generative Models',
    description: 'Worked on GAN-based generative models for visual content synthesis.',
  },
];

const indexLinks = [
  { href: '/notes', title: 'Notes', description: 'Research notes and methodological insights' },
  { href: '/papers', title: 'Papers', description: 'Publications and preprints' },
  { href: '/about', title: 'About', description: 'Journey, honors, and footprints' },
];

const HomeHeroScene = dynamic(() => import('@/components/HomeHeroScene'), {
  ssr: false,
  loading: () => null,
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function HomePage() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
      <Head>
        <title>Tianshan Zhang | 张天山</title>
        <meta
          key="description"
          name="description"
          content="Tianshan Zhang's academic homepage, with research on 3D vision, generative AI, computer graphics, and physically plausible hand-object interaction."
        />
        <meta key="og-title" property="og:title" content="Tianshan Zhang | 张天山" />
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

      <Header />

      <main className="flex-grow">
        {/* HERO */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-28 md:pt-36">
          <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="text-sm text-muted dark:text-dmuted">
                B.S. Candidate — Computer Science &amp; Materials Science
              </p>
              <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.08] md:text-[64px]">
                Tianshan Zhang
                <span className="ml-4 align-middle font-serif text-2xl text-muted dark:text-dmuted md:text-3xl">
                  张天山
                </span>
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted dark:text-dmuted">
                I work on generative models and vision-language-action systems — toward machines
                that can perceive, reason, and act in the physical world.
              </p>
              <nav className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                {indexLinks.map(({ href, title }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-[15px] text-ink no-underline transition-colors duration-300 hover:text-coral dark:text-dink dark:hover:text-coral"
                  >
                    {title}
                    <ArrowRight
                      size={15}
                      className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-coral dark:text-dfaint"
                    />
                  </Link>
                ))}
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line dark:border-dline">
                <HomeHeroScene isDarkMode={isDarkMode} />
              </div>
              <p className="mt-3 text-center text-xs text-faint dark:text-dfaint">
                Stanford Bunny — an interactive point-cloud study
              </p>
            </motion.div>
          </div>
        </section>

        {/* RESEARCH */}
        <motion.section
          className="mx-auto mt-24 w-full max-w-5xl px-6 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="grid gap-10 border-t border-line pt-14 dark:border-dline md:grid-cols-[1fr_2fr] md:gap-16">
            <h2 className="font-serif text-3xl font-medium md:text-4xl">Research</h2>
            <div className="space-y-8 text-[17px] leading-relaxed text-muted dark:text-dmuted">
              <p>
                <strong className="font-serif font-medium italic text-ink dark:text-dink">
                  Generative AI for embodied intelligence.
                </strong>{' '}
                I am interested in connecting generative AI with robotics, particularly through
                vision-language-action models that integrate perception, reasoning, and physical
                action.
              </p>
              <p>
                <strong className="font-serif font-medium italic text-ink dark:text-dink">
                  Robot learning and manipulation.
                </strong>{' '}
                My work explores how multimodal representations and generative models can help
                robots understand instructions, interact with their environment, and perform robust
                manipulation tasks.
              </p>
            </div>
          </div>
        </motion.section>

        {/* EXPERIENCE */}
        <motion.section
          className="mx-auto mt-24 w-full max-w-5xl px-6 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
        >
          <div className="grid gap-10 border-t border-line pt-14 dark:border-dline md:grid-cols-[1fr_2fr] md:gap-16">
            <h2 className="font-serif text-3xl font-medium md:text-4xl">Experience</h2>
            <div>
              {researchExperience.map((experience) => (
                <article
                  key={`${experience.institution}-${experience.period}`}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-6 first:pt-0 last:border-b-0 dark:border-dline"
                >
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-medium leading-snug">
                      {experience.institution}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-ink/80 dark:text-dink/80">
                      {experience.focus}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted dark:text-dmuted">
                      {experience.description}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-faint dark:text-dfaint">
                    {experience.period}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        {/* INDEX */}
        <motion.section
          className="mx-auto mb-28 mt-24 w-full max-w-5xl px-6 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="grid gap-10 border-t border-line pt-14 dark:border-dline md:grid-cols-[1fr_2fr] md:gap-16">
            <h2 className="font-serif text-3xl font-medium md:text-4xl">Index</h2>
            <div>
              {indexLinks.map(({ href, title, description }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between gap-6 border-b border-line py-6 no-underline first:pt-0 last:border-b-0 dark:border-dline"
                >
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="font-serif text-2xl font-medium text-ink transition-colors duration-300 group-hover:text-coral dark:text-dink dark:group-hover:text-coral">
                      {title}
                    </span>
                    <span className="text-sm text-muted dark:text-dmuted">{description}</span>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-coral dark:text-dfaint"
                  />
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

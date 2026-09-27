import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { withBasePath } from '@/lib/basePath';
import { GITHUB_URL, SITE_URL, X_URL } from '@/lib/site';
import Section from '@/components/Section';
import LazyVideo from '@/components/LazyVideo';
import { getSortedPapersData } from '@/lib/papers';
import { getSortedNotesData } from '@/lib/notes';

type PaperSummary = {
  id: string;
  title: string;
  date: string;
  venue: string;
  authors: string;
  image: string | null;
  video: string | null;
  url: string | null;
  arxiv_url: string | null;
  github_url: string | null;
};

type NoteSummary = { id: string; title: string; date: string; summary: string };

export async function getStaticProps() {
  // getStaticProps must return JSON: gray-matter parses YAML dates into Date objects,
  // and optional fields become null rather than undefined.
  const papers: PaperSummary[] = getSortedPapersData().map((paper) => {
    const date = paper.date as unknown;
    return {
      id: paper.id,
      title: paper.title,
      date: date instanceof Date ? date.toISOString() : String(date),
      venue: paper.venue,
      authors: paper.authors,
      image: paper.image ?? null,
      video: paper.video ?? null,
      url: paper.url ?? null,
      arxiv_url: paper.arxiv_url ?? null,
      github_url: paper.github_url ?? null,
    };
  });

  const notes: NoteSummary[] = getSortedNotesData()
    .slice(0, 3)
    .map(({ id, title, date, summary }) => ({ id, title, date, summary }));

  return { props: { papers, notes } };
}

const MY_NAME = 'Tianshan Zhang';

const researchExperience = [
  {
    institution: 'Peking University',
    mark: '北',
    period: '2025 – Present',
    focus: 'Vision-Language-Action Models, Generative Models, Robotic Manipulation',
    current: true,
  },
  {
    institution: 'Zhipu AI',
    mark: '智',
    period: '2025 – 2026',
    focus: 'Mathematical Reasoning, LLM Inference',
    current: false,
  },
  {
    institution: 'Institute of Automation, CAS',
    mark: '自',
    period: '2024 – 2025',
    focus: 'Generative Models',
    current: false,
  },
];

const indexLinks = [
  { href: '/notes', title: 'Notes' },
  { href: '/papers', title: 'Papers' },
  { href: '/about', title: 'About' },
];

const externalLinks = [
  { href: GITHUB_URL, title: 'GitHub' },
  { href: X_URL, title: 'X' },
];

const researchThemes = [
  {
    title: 'Generative models and world models',
    body: 'I am interested in generative models that learn how the world looks and changes: video generation, and world models that predict what happens next under an action. A model that can imagine the future is a natural substrate for planning, simulation, and learning without a real robot in the loop.',
  },
  {
    title: 'Robot learning and embodied intelligence',
    body: 'On the robotics side I work on vision-language-action models and humanoid robots: policies that ground language and vision in physical action, from dexterous hand-object interaction to whole-body control.',
  },
];

const HomeHeroScene = dynamic(() => import('@/components/HomeHeroScene'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage({ papers, notes }: { papers: PaperSummary[]; notes: NoteSummary[] }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
      <Head>
        <title>Tianshan Zhang | 张天山</title>
        <meta
          key="description"
          name="description"
          content="Tianshan Zhang's academic homepage, with research on generative models, world models, video generation, vision-language-action models, and humanoid robots."
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
              sameAs: [GITHUB_URL, X_URL],
              knowsAbout: ['Generative Models', 'World Models', 'Video Generation', 'Vision-Language-Action Models', 'Humanoid Robots'],
            }),
          }}
        />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* HERO */}
        <section className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 pb-16 pt-24 md:pt-14">
          <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="text-sm text-muted dark:text-dmuted">
                B.S. Candidate in Computer Science &amp; Materials Science
              </p>
              <h1 className="mt-6 font-serif text-[56px] font-normal leading-[1.0] sm:text-7xl md:text-[84px]">
                Tianshan Zhang
              </h1>
              <p className="mt-4 font-serif text-2xl text-muted dark:text-dmuted md:text-[28px]">
                张天山
              </p>
              <p className="mt-8 max-w-md text-[17px] leading-relaxed text-muted dark:text-dmuted">
                I work on generative models of the world — video generation and world models — and
                on bringing them to robots that perceive, reason, and act in the physical world.
              </p>
              <nav className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
                {indexLinks.map(({ href, title }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-ink dark:text-dink"
                  >
                    <span className="link-title">{title}</span>
                    <ArrowRight
                      size={15}
                      className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-coral dark:text-dfaint"
                    />
                  </Link>
                ))}
                <span aria-hidden className="hidden h-4 w-px bg-line dark:bg-dline sm:block" />
                {externalLinks.map(({ href, title }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-muted transition-colors duration-300 hover:text-ink dark:text-dmuted dark:hover:text-dink"
                  >
                    {title}
                    <ArrowUpRight
                      size={14}
                      className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral dark:text-dfaint"
                    />
                  </a>
                ))}
              </nav>
            </motion.div>

            <motion.figure
              className="order-first md:order-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <div className="mx-auto aspect-square w-full max-w-[260px] md:max-w-none">
                <HomeHeroScene isDarkMode={isDarkMode} />
              </div>
              <figcaption className="mt-1 hidden text-center font-serif text-sm italic text-faint dark:text-dfaint md:block">
                Stanford Bunny, as a point cloud — hover to disturb it.
              </figcaption>
            </motion.figure>
          </div>
        </section>

        {/* RESEARCH */}
        <Section title="Research" className="!mt-0">
          <div className="space-y-12">
            {researchThemes.map(({ title, body }, index) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-x-2">
                <span className="pt-1 font-serif text-sm tabular-nums text-coral">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-normal leading-snug">{title}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted dark:text-dmuted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* PUBLICATIONS */}
        {papers.length > 0 && (
          <Section title="Publications" action={{ href: '/papers', label: 'All publications' }}>
            {papers.map((paper) => {
              const href = paper.url || paper.arxiv_url || paper.github_url;
              return (
                <article
                  key={paper.id}
                  className="grid gap-5 border-b border-line py-8 first:pt-0 last:border-b-0 dark:border-dline sm:grid-cols-[200px_1fr] sm:gap-8"
                >
                  {(paper.video || paper.image) && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white dark:brightness-[0.88]">
                      {paper.video ? (
                        <LazyVideo
                          className="h-full w-full object-cover"
                          src={withBasePath(paper.video)}
                          poster={paper.image ? withBasePath(paper.image) : undefined}
                        />
                      ) : (
                        <Image
                          src={withBasePath(paper.image as string)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-faint dark:text-dfaint">{paper.venue}</p>
                    <h3 className="mt-1.5 font-serif text-[22px] font-normal leading-snug">
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer" className="link-title text-ink dark:text-dink">
                          {paper.title}
                        </a>
                      ) : (
                        paper.title
                      )}
                    </h3>
                    <p className="mt-2 font-serif text-base italic leading-relaxed text-muted dark:text-dmuted">
                      {paper.authors.split(MY_NAME).map((part, idx, parts) => (
                        <span key={idx}>
                          {part}
                          {idx < parts.length - 1 && (
                            <span className="not-italic text-ink dark:text-dink">{MY_NAME}</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                </article>
              );
            })}
          </Section>
        )}

        {/* EXPERIENCE */}
        <Section title="Experience">
          {researchExperience.map((experience) => (
            <article
              key={`${experience.institution}-${experience.period}`}
              className="group flex items-center justify-between gap-6 border-b border-line py-6 first:pt-0 last:border-b-0 dark:border-dline"
            >
              <div className="flex min-w-0 items-center gap-5">
                {/* Seal-style mark: one serif character in a hairline square, drawn in code so
                    all three institutions share one visual language. Coral marks the current one. */}
                <span
                  aria-hidden
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border font-serif text-[21px] leading-none transition-colors duration-500 ${
                    experience.current
                      ? 'border-coral/70 text-coral'
                      : 'border-line text-muted group-hover:border-ink/30 group-hover:text-ink dark:border-dline dark:text-dmuted dark:group-hover:border-dink/30 dark:group-hover:text-dink'
                  }`}
                >
                  {experience.mark}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-[22px] font-normal leading-snug">
                    {experience.institution}
                  </h3>
                  <p className="mt-1 text-[15px] text-muted dark:text-dmuted">{experience.focus}</p>
                </div>
              </div>
              <p className="shrink-0 text-sm tabular-nums text-faint dark:text-dfaint">
                {experience.period}
              </p>
            </article>
          ))}
        </Section>

        {/* LATEST NOTES */}
        {notes.length > 0 && (
          <Section title="Notes" action={{ href: '/notes', label: 'All notes' }} className="mb-28">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group block border-b border-line py-6 first:pt-0 last:border-b-0 dark:border-dline"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="font-serif text-[22px] font-normal leading-snug text-ink dark:text-dink">
                    <span className="link-title">{note.title}</span>
                  </h3>
                  <time className="shrink-0 text-sm tabular-nums text-faint dark:text-dfaint">{note.date}</time>
                </div>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                  {note.summary}
                </p>
              </Link>
            ))}
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}

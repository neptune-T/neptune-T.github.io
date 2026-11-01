import fs from 'fs';
import path from 'path';
import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
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
import FadeImage from '@/components/FadeImage';
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

type NoteSummary = { id: string; title: string; date: string; summary: string; coverImage: string; coverPlaceholder: string };

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
    .map(({ id, title, date, summary, coverImage, coverPlaceholder }) => ({
      id, title, date, summary, coverImage: coverImage || '', coverPlaceholder: coverPlaceholder || '',
    }));

  // The three logos are tiny (~15 KB total), so they are inlined as data URIs: they
  // render with the HTML and can never show a broken-image icon on a flaky connection.
  const logos: Record<string, string> = {};
  for (const { logo } of researchExperience) {
    const file = fs.readFileSync(path.join(process.cwd(), 'public', logo));
    const type = logo.endsWith('.svg') ? 'image/svg+xml' : 'image/webp';
    logos[logo] = `data:${type};base64,${file.toString('base64')}`;
  }

  return { props: { papers, notes, logos } };
}

const MY_NAME = 'Tianshan Zhang';

const researchExperience = [
  {
    institution: 'Peking University',
    logo: '/logos/research/pku.webp',
    // Deep seal red nearly vanishes on the dark paper; lift it in dark mode only.
    logoDarkClass: 'dark:brightness-[1.7] dark:saturate-[0.85]',
    period: '2025 – Present',
    focus: 'Vision-Language-Action Models, Generative Models, Robotic Manipulation',
  },
  {
    institution: 'Zhipu AI',
    logo: '/logos/research/zhipu.svg',
    period: '2025 – 2026',
    focus: 'Mathematical Reasoning, LLM Inference',
  },
  {
    institution: 'Institute of Automation, CAS',
    logo: '/logos/research/casia.webp',
    period: '2024 – 2025',
    focus: 'Generative Models',
  },
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

export default function HomePage({
  papers,
  notes,
  logos,
}: {
  papers: PaperSummary[];
  notes: NoteSummary[];
  logos: Record<string, string>;
}) {
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

      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {/* HERO */}
        <section className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 pb-8 pt-28 md:pt-14">
          <div className="grid items-center gap-8 md:py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="flex items-start gap-3 text-sm text-muted dark:text-dmuted">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                B.S. Candidate in Computer Science &amp; Materials Science
              </p>
              <h1 className="mt-6 font-serif text-[56px] font-normal leading-[1.0] sm:text-7xl md:text-[84px]">
                Tianshan<br />Zhang<span className="text-coral">.</span>
              </h1>
              <p className="mt-4 font-serif text-2xl text-muted dark:text-dmuted md:text-[28px]">
                张天山
              </p>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted dark:text-dmuted">
                I work on generative models of the world — video generation and world models — and
                on bringing them to robots that perceive, reason, and act in the physical world.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href="#publications" className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-muted dark:bg-dink dark:text-dpaper dark:hover:bg-dmuted">
                  Explore my research <ArrowDown size={15} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
                </a>
                <Link href="/about" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink dark:text-dink">
                  <span className="link-title">About me</span><ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <nav aria-label="Social profiles" className="mt-5 flex items-center gap-6 text-sm">
                {externalLinks.map(({ href, title }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink">
                    {title}<ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </motion.div>

            <motion.figure
              className="min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <div className="mx-auto aspect-square w-full max-w-[220px] sm:max-w-[300px] md:max-w-none">
                <HomeHeroScene isDarkMode={isDarkMode} />
              </div>
              <figcaption className="mt-1 text-center font-serif text-sm italic text-muted dark:text-dmuted">
                A small study in geometry.
                <span className="mt-1 block font-sans text-xs not-italic">Stanford Bunny · Drag to rotate</span>
              </figcaption>
            </motion.figure>
          </div>
          <nav aria-label="On this page" className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-xs text-muted dark:border-dline dark:text-dmuted md:mt-16">
            <span className="mr-auto font-serif text-sm italic">Learning to imagine. Learning to act.</span>
            {[['research', 'Research'], ['publications', 'Publications'], ['experience', 'Experience'], ['notes', 'Notes']].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="link-title inline-flex min-h-11 items-center text-muted dark:text-dmuted">{label}</a>
            ))}
          </nav>
        </section>

        {/* RESEARCH */}
        <Section id="research" title="Research" className="!mt-0 scroll-mt-24">
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
          <Section id="publications" className="scroll-mt-24" title="Publications" action={{ href: '/papers', label: 'All publications' }}>
            {papers.map((paper) => {
              const href = paper.url || paper.arxiv_url || paper.github_url;
              return (
                <article
                  key={paper.id}
                  className="grid gap-5 border-b border-line py-10 first:pt-0 last:border-b-0 dark:border-dline"
                >
                  {(paper.video || paper.image) && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-white dark:brightness-[0.88]">
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
                          sizes="(min-width: 1024px) 600px, (min-width: 768px) 60vw, 100vw"
                        />
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm ${/arxiv/i.test(paper.venue) ? 'text-faint dark:text-dfaint' : 'text-coral'}`}>
                      {paper.venue}
                    </p>
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
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                      {[{ href: paper.url, label: 'Project' }, { href: paper.arxiv_url, label: 'Paper' }, { href: paper.github_url, label: 'Code' }].filter((link) => link.href).map(({ href, label }) => (
                        <a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={`${label}: ${paper.title}`} className="inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink">
                          <span className="link-title">{label}</span><ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </Section>
        )}

        {/* EXPERIENCE */}
        <Section id="experience" title="Experience" className="scroll-mt-24">
          {researchExperience.map((experience) => (
            <article
              key={`${experience.institution}-${experience.period}`}
              className="group flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between sm:gap-6 border-line py-6 first:pt-0 last:border-b-0 dark:border-dline"
            >
              <div className="flex min-w-0 items-center gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- inline data URI */}
                  <img
                    src={logos[experience.logo]}
                    alt={`${experience.institution} logo`}
                    width={44}
                    height={44}
                    className={`h-full w-full object-contain ${'logoDarkClass' in experience ? experience.logoDarkClass : ''}`}
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-[22px] font-normal leading-snug">
                    {experience.institution}
                  </h3>
                  <p className="mt-1 text-[15px] text-muted dark:text-dmuted">{experience.focus}</p>
                </div>
              </div>
              <p className="pl-16 text-sm tabular-nums text-muted dark:text-dmuted sm:shrink-0 sm:pl-0">
                {experience.period}
              </p>
            </article>
          ))}
        </Section>

        {/* LATEST NOTES */}
        {notes.length > 0 && (
          <Section id="notes" title="Notes" action={{ href: '/notes', label: 'All notes' }} className="mb-28 scroll-mt-24">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group flex items-start gap-5 border-b border-line py-7 first:pt-0 last:border-b-0 dark:border-dline"
              >
                <div className="min-w-0 flex-1">
                <time className="text-xs tabular-nums text-muted dark:text-dmuted">{note.date}</time>
                <div className="mt-2">
                  <h3 className="font-serif text-[22px] font-normal leading-snug text-ink dark:text-dink">
                    <span className="link-title">{note.title}</span>
                  </h3>
                </div>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                  {note.summary}
                </p>
                </div>
                {note.coverImage && (
                  <div className="relative mt-1 hidden h-24 w-28 shrink-0 overflow-hidden rounded-sm sm:block">
                    <FadeImage src={note.coverImage} placeholder={note.coverPlaceholder} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                )}
              </Link>
            ))}
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}

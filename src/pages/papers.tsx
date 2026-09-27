import { getSortedPapersData } from '@/lib/papers';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Github, Globe, Link as LinkIcon, Trophy } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';
import LazyVideo from '@/components/LazyVideo';

type Paper = {
  id: string;
  title: string;
  date: string;
  image?: string;
  video?: string;
  summary: string;
  authors: string;
  venue: string;
  url?: string;
  arxiv_url?: string;
  github_url?: string;
  huggingface_url?: string;
  daily_paper_url?: string;
  daily_paper_rank?: number;
};

export async function getStaticProps() {
  const rawData = getSortedPapersData();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPapersData = rawData.map((paper: any) => ({
    ...paper,
    date: paper.date instanceof Date ? paper.date.toISOString() : String(paper.date),
  }));

  return {
    props: {
      allPapersData,
    },
  };
}

const MY_NAME = 'Tianshan Zhang';

const renderAuthors = (authors: string) => {
  if (!authors || !authors.includes(MY_NAME)) {
    return <span className="font-serif italic">{authors}</span>;
  }
  const parts = authors.split(MY_NAME);
  return (
    <span className="font-serif italic">
      {parts.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < parts.length - 1 && (
            <span className="not-italic text-ink dark:text-dink">{MY_NAME}</span>
          )}
        </span>
      ))}
    </span>
  );
};

type PaperLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function Papers({ allPapersData }: { allPapersData: Paper[] }) {
  return (
    <>
      <Head>
        <title>Publications | Tianshan Zhang</title>
        <meta key="description" name="description" content="Publications and research projects by Tianshan Zhang in 3D vision, generative AI, and physically plausible interaction." />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />

        <main className="mx-auto w-full max-w-5xl flex-grow px-6 pb-24 pt-28 md:pt-36">
          <motion.header
            className="mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="font-serif text-5xl font-normal leading-[1.05] md:text-[64px]">
              Publications
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted dark:text-dmuted">
              Selected research papers, conference proceedings, and preprints in computer vision
              and generative AI.
            </p>
          </motion.header>

          <div className="border-t border-line dark:border-dline">
            {allPapersData.map((paper, index) => {
              const links: PaperLink[] = [
                paper.arxiv_url && { href: paper.arxiv_url, label: 'arXiv', icon: <FileText size={13} /> },
                paper.github_url && { href: paper.github_url, label: 'Code', icon: <Github size={13} /> },
                paper.url && { href: paper.url, label: 'Website', icon: <Globe size={13} /> },
                paper.huggingface_url && { href: paper.huggingface_url, label: 'Hugging Face', icon: <LinkIcon size={13} /> },
              ].filter(Boolean) as PaperLink[];

              return (
                <motion.article
                  key={paper.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 + 0.15, ease: 'easeOut' }}
                  className="grid min-w-0 gap-8 border-b border-line py-12 dark:border-dline md:grid-cols-[5fr_7fr] md:gap-12"
                >
                  {(paper.video || paper.image) && (
                    <div className="relative aspect-[16/10] w-full self-start overflow-hidden rounded-xl border border-line bg-white dark:border-dline dark:brightness-[0.88]">
                      {paper.video ? (
                        <LazyVideo
                          className="h-full w-full object-cover"
                          src={withBasePath(paper.video)}
                          poster={paper.image ? withBasePath(paper.image) : undefined}
                        />
                      ) : (
                        <Image
                          src={withBasePath(paper.image!)}
                          alt={paper.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex min-w-0 flex-col">
                    <p className="text-sm text-faint dark:text-dfaint">
                      {paper.venue}
                      <span className="mx-2" aria-hidden>·</span>
                      {paper.date.substring(0, 7)}
                    </p>

                    <h2 className="mt-3 font-serif text-[26px] font-normal leading-snug md:text-[30px]">
                      {paper.title}
                    </h2>

                    {paper.daily_paper_url && (
                      <a
                        href={paper.daily_paper_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] text-muted transition-colors duration-300 hover:text-coral dark:text-dmuted dark:hover:text-coral"
                        title="Hugging Face Daily Papers"
                      >
                        <Trophy size={13} className="shrink-0 text-coral" />
                        #{paper.daily_paper_rank ?? 2} Paper of the Day on Hugging Face
                      </a>
                    )}

                    <p className="mt-4 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                      {renderAuthors(paper.authors)}
                    </p>

                    <p className="mt-4 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                      {paper.summary}
                    </p>

                    {links.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-all duration-300 hover:border-ink/30 hover:text-ink dark:border-dline dark:text-dmuted dark:hover:border-dink/30 dark:hover:text-dink"
                          >
                            {link.icon}
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {allPapersData.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted dark:text-dmuted">No papers found.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

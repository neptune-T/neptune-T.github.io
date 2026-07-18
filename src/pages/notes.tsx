import { getSortedNotesData } from '@/lib/notes';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export async function getStaticProps() {
  const allNotesData = getSortedNotesData();
  return {
    props: {
      allNotesData,
    },
  };
}

type Note = {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  coverImage?: string;
};

export default function Notes({ allNotesData }: { allNotesData: Note[] }) {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const uniqueTags = ['all', ...new Set(allNotesData.flatMap((note) => note.tags || []))];
  const filteredNotes =
    selectedTag === 'all'
      ? allNotesData
      : allNotesData.filter((note) => note.tags?.includes(selectedTag));

  return (
    <>
      <Head>
        <title>Research Notes | Tianshan Zhang</title>
        <meta key="description" name="description" content="Technical notes by Tianshan Zhang on 3D vision, generative modeling, computer graphics, mathematics, and physics." />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />

        <main className="mx-auto w-full max-w-3xl flex-grow px-6 pb-24 pt-28 md:pt-36">
          <motion.header
            className="mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="font-serif text-5xl font-medium leading-[1.08] md:text-6xl">Notes</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted dark:text-dmuted">
              Working notes on generative models, computer graphics, mathematics, and physics —
              written to think clearly.
            </p>
          </motion.header>

          {/* Tag filter */}
          <motion.div
            className="mb-4 flex flex-wrap gap-x-6 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`relative pb-1 text-sm transition-colors duration-300 ${
                  selectedTag === tag
                    ? 'text-ink dark:text-dink'
                    : 'text-faint hover:text-muted dark:text-dfaint dark:hover:text-dmuted'
                }`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                {selectedTag === tag && (
                  <span className="absolute -bottom-0.5 left-0 h-px w-full bg-coral" />
                )}
              </button>
            ))}
          </motion.div>

          {/* Notes list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            {filteredNotes.map(({ id, date, title, summary, tags }) => (
              <Link
                key={id}
                href={`/notes/${id}`}
                className="group block border-b border-line py-8 no-underline first:border-t dark:border-dline"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <p className="shrink-0 text-sm text-faint dark:text-dfaint">{date}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    {tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="hidden text-xs text-faint dark:text-dfaint sm:inline">
                        {tag}
                      </span>
                    ))}
                    <ArrowRight
                      size={16}
                      className="text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-coral group-hover:opacity-100 dark:text-dfaint"
                    />
                  </div>
                </div>
                <h2 className="mt-2.5 font-serif text-2xl font-medium leading-snug text-ink transition-colors duration-300 group-hover:text-coral dark:text-dink dark:group-hover:text-coral">
                  {title}
                </h2>
                <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                  {summary}
                </p>
              </Link>
            ))}
          </motion.div>

          {filteredNotes.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted dark:text-dmuted">No notes found with this tag.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

import { getSortedNotesData } from '@/lib/notes';
import Link from 'next/link';
import Image from 'next/image';
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
  const [showAllTags, setShowAllTags] = useState(false);

  const tagCounts = new Map<string, number>();
  allNotesData.forEach((note) =>
    note.tags?.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)),
  );
  // Most-used tags first; the long tail of one-off tags folds behind "more".
  const TAG_LIMIT = 6;
  const sortedTags = [...tagCounts.keys()].sort((a, b) => tagCounts.get(b)! - tagCounts.get(a)!);
  const visibleTags =
    showAllTags || sortedTags.length <= TAG_LIMIT
      ? sortedTags
      : sortedTags.slice(0, TAG_LIMIT).concat(
          sortedTags.slice(TAG_LIMIT).includes(selectedTag) ? [selectedTag] : [],
        );
  const hiddenCount = sortedTags.length - visibleTags.length;
  const uniqueTags = ['all', ...visibleTags];
  const filteredNotes =
    selectedTag === 'all'
      ? allNotesData
      : allNotesData.filter((note) => note.tags?.includes(selectedTag));

  // Notes arrive newest first, so years come out in descending order.
  const notesByYear: [string, Note[]][] = [];
  filteredNotes.forEach((note) => {
    const year = note.date.slice(0, 4);
    const group = notesByYear.find(([y]) => y === year);
    if (group) group[1].push(note);
    else notesByYear.push([year, [note]]);
  });

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
            <h1 className="font-serif text-5xl font-normal leading-[1.05] md:text-[64px]">Notes</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted dark:text-dmuted">
              Working notes on generative models, computer graphics, mathematics, and physics —
              written to think clearly.
            </p>
          </motion.header>

          {/* Tag filter */}
          <motion.div
            className="scrollbar-none -mx-6 mb-6 flex gap-x-6 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:gap-y-3 sm:overflow-visible sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {uniqueTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  aria-pressed={active}
                  className={`relative shrink-0 whitespace-nowrap pb-1.5 text-sm transition-colors duration-300 ${
                    active
                      ? 'text-ink dark:text-dink'
                      : 'text-faint hover:text-muted dark:text-dfaint dark:hover:text-dmuted'
                  }`}
                >
                  {tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                  <span className="ml-1.5 text-xs text-faint dark:text-dfaint">
                    {tag === 'all' ? allNotesData.length : tagCounts.get(tag)}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="note-tag-underline"
                      className="absolute bottom-0 left-0 h-px w-full bg-coral"
                    />
                  )}
                </button>
              );
            })}
            {(hiddenCount > 0 || showAllTags) && sortedTags.length > TAG_LIMIT && (
              <button
                onClick={() => setShowAllTags((v) => !v)}
                className="shrink-0 whitespace-nowrap pb-1.5 font-serif text-sm italic text-faint transition-colors duration-300 hover:text-ink dark:text-dfaint dark:hover:text-dink"
              >
                {showAllTags ? 'fewer' : `+${hiddenCount} more`}
              </button>
            )}
          </motion.div>

          {/* Notes list, grouped by year */}
          <motion.div
            key={selectedTag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {notesByYear.map(([year, notes]) => (
              <section key={year} className="border-t border-line dark:border-dline">
                <h2 className="pt-8 font-serif text-lg tabular-nums text-coral">{year}</h2>
                {notes.map(({ id, date, title, summary, tags, coverImage }) => (
                  <Link
                    key={id}
                    href={`/notes/${id}`}
                    className="group block border-b border-line py-8 no-underline last:border-b-0 dark:border-dline"
                  >
                    <div className="flex items-start gap-4 sm:gap-8">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3 text-sm text-faint dark:text-dfaint">
                          <time className="shrink-0 tabular-nums">{date}</time>
                          {tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="hidden truncate text-xs sm:inline">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="mt-2.5 font-serif text-[22px] font-normal leading-snug text-ink dark:text-dink sm:text-[26px]">
                          <span className="link-title">{title}</span>
                        </h3>
                        <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-muted dark:text-dmuted">
                          {summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-faint transition-colors duration-300 group-hover:text-coral dark:text-dfaint">
                          Read
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                      {coverImage && (
                        <div className="relative mt-1 aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border border-line dark:border-dline sm:w-40">
                          <Image
                            src={coverImage}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 96px, 160px"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </section>
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

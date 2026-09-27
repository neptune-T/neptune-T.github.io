import { getAllNoteIds, getNoteData, getSortedNotesData } from '@/lib/notes';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface IParams extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllNoteIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;
  const noteData = await getNoteData(id);

  // Notes are sorted newest first: "newer" is the previous entry, "older" the next one.
  const sorted = getSortedNotesData();
  const index = sorted.findIndex((note) => note.id === id);
  const toLink = (note?: (typeof sorted)[number]) =>
    note ? { id: note.id, title: note.title } : null;

  return {
    props: {
      noteData,
      newer: toLink(sorted[index - 1]),
      older: toLink(sorted[index + 1]),
    },
  };
};

type NoteData = {
  title: string;
  date: string;
  summary: string;
  contentHtml: string;
  coverImage?: string;
  readingMinutes: number;
  tags: string[];
};

type NoteLink = { id: string; title: string } | null;

export default function Note({
  noteData,
  newer,
  older,
}: {
  noteData: NoteData;
  newer: NoteLink;
  older: NoteLink;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <>
      <Head>
        <title>{`${noteData.title} | Tianshan Zhang`}</title>
        <meta key="description" name="description" content={noteData.summary} />
        <meta key="og-type" property="og:type" content="article" />
        <meta key="og-title" property="og:title" content={noteData.title} />
        <meta key="og-description" property="og:description" content={noteData.summary} />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-14 z-50 h-px origin-left bg-coral"
          style={{ scaleX: progress }}
        />

        <motion.main
          className="mx-auto w-full max-w-3xl flex-grow px-6 pb-24 pt-28 md:pt-36"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-sm text-faint no-underline transition-colors duration-300 hover:text-ink dark:text-dfaint dark:hover:text-dink"
          >
            <ArrowLeft size={15} />
            All notes
          </Link>

          <header className="mt-10 border-b border-line pb-10 dark:border-dline">
            <h1 className="font-serif text-4xl font-medium leading-[1.15] md:text-5xl">
              {noteData.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-faint dark:text-dfaint">
              <time>{noteData.date}</time>
              <span aria-hidden>·</span>
              <span>{noteData.readingMinutes} min read</span>
              {noteData.tags.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  {noteData.tags.map((tag) => (
                    <span key={tag} className="text-muted dark:text-dmuted">
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          </header>

          <article className="note-prose prose prose-lg mt-10 max-w-none note-prose-light dark:prose-invert dark:note-prose-dark">
            <div dangerouslySetInnerHTML={{ __html: noteData.contentHtml }} />
          </article>

          {(newer || older) && (
            <nav
              aria-label="More notes"
              className="mt-20 grid border-y border-line dark:border-dline sm:grid-cols-2"
            >
              {[
                { link: older, label: 'Older', align: 'text-left', Icon: ArrowLeft },
                { link: newer, label: 'Newer', align: 'sm:text-right', Icon: ArrowRight },
              ].map(({ link, label, align, Icon }) =>
                link ? (
                  <Link
                    key={label}
                    href={`/notes/${link.id}`}
                    className={`group block py-7 no-underline ${align} ${
                      label === 'Newer' ? 'border-t border-line dark:border-dline sm:border-l sm:border-t-0 sm:pl-8' : 'sm:pr-8'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm text-faint dark:text-dfaint ${
                        label === 'Newer' ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      <Icon
                        size={14}
                        className="transition-transform duration-300 group-hover:text-coral"
                      />
                      {label}
                    </span>
                    <span className="mt-2 block font-serif text-lg font-medium leading-snug text-ink transition-colors duration-300 group-hover:text-coral dark:text-dink">
                      {link.title}
                    </span>
                  </Link>
                ) : (
                  <span key={label} aria-hidden />
                ),
              )}
            </nav>
          )}
        </motion.main>

        <Footer />
      </div>
    </>
  );
}

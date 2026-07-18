import { getAllNoteIds, getNoteData } from '@/lib/notes';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
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
  return {
    props: {
      noteData,
    },
  };
};

type NoteData = {
  title: string;
  date: string;
  summary: string;
  contentHtml: string;
  coverImage?: string;
};

export default function Note({ noteData }: { noteData: NoteData }) {
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
            <FiArrowLeft size={15} />
            All notes
          </Link>

          <header className="mt-10 border-b border-line pb-10 dark:border-dline">
            <h1 className="font-serif text-4xl font-medium leading-[1.15] md:text-5xl">
              {noteData.title}
            </h1>
            <p className="mt-5 text-sm text-faint dark:text-dfaint">{noteData.date}</p>
          </header>

          <article className="note-prose prose prose-lg mt-10 max-w-none note-prose-light dark:prose-invert dark:note-prose-dark">
            <div dangerouslySetInnerHTML={{ __html: noteData.contentHtml }} />
          </article>
        </motion.main>

        <Footer />
      </div>
    </>
  );
}

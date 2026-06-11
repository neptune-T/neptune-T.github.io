import { getAllNoteIds, getNoteData } from '@/lib/notes';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';

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
  const { isDarkMode } = useTheme();

  return (
    <>
      <Head>
        <title>{`${noteData.title} | Tianshan Zhang`}</title>
        <meta key="description" name="description" content={noteData.summary} />
        <meta key="og-type" property="og:type" content="article" />
        <meta key="og-title" property="og:title" content={noteData.title} />
        <meta key="og-description" property="og:description" content={noteData.summary} />
      </Head>
      <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-coral/30 flex flex-col ${isDarkMode ? 'bg-[#161310] text-[#eee4d8]' : 'bg-warm-canvas text-warm-ink'}`}>
        <Header />

        <motion.div 
          className="flex-grow pt-32 md:pt-40 px-4 md:px-10 lg:px-20 pb-20 max-w-7xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-10">
            <Link href="/notes" className={`inline-flex items-center transition-colors font-medium ${isDarkMode ? 'text-[#aaa096] hover:text-[#eee4d8]' : 'text-warm-muted hover:text-warm-ink'}`}>
              <FiArrowLeft className="mr-2" />
              Back to all notes
            </Link>
          </div>
          <div className={`p-8 md:p-12 rounded-2xl border ${isDarkMode ? 'bg-[#241f1b]/66 border-[#f3e8dc]/[0.08] backdrop-blur-xl backdrop-saturate-150' : 'bg-warm-surface border-black/5 shadow-sm'}`}>
            <article className={`note-prose prose prose-lg max-w-none ${isDarkMode ? 'prose-invert note-prose-dark' : 'note-prose-light'}`}>
              <h1>{noteData.title}</h1>
              <p className={`text-base -mt-4 mb-8 ${isDarkMode ? 'text-[#82786f]' : 'text-warm-muted'}`}>{noteData.date}</p>
              <div dangerouslySetInnerHTML={{ __html: noteData.contentHtml }} />
            </article>
          </div>
        </motion.div>
      </div>
    </>
  );
}

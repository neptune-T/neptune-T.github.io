import { getSortedPapersData } from '@/lib/papers';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Calendar, MapPin, Users, FileText, Github, Globe, Link as LinkIcon, Trophy } from 'lucide-react';
import { withBasePath } from '@/lib/basePath';
import { useTheme } from '@/context/ThemeContext';

// --- 类型定义 (移到顶部是更好的实践) ---
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

// --- 数据获取 ---
export async function getStaticProps() {
  const rawData = getSortedPapersData();
  
  // 🟢 修复：添加 eslint-disable 注释来允许这里使用 any
  // 因为 md gray-matter 解析出的原始数据类型确实很难定义，使用 any 是合理的妥协
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPapersData = rawData.map((paper: any) => ({
    ...paper,
    // 如果是 Date 对象就转 ISO 字符串，如果是字符串就保持原样
    date: paper.date instanceof Date ? paper.date.toISOString() : String(paper.date),
  }));

  return {
    props: {
      allPapersData,
    },
  };
}

export default function Papers({ allPapersData }: { allPapersData: Paper[] }) {
  const { isDarkMode } = useTheme();

  const MY_NAME = 'Tianshan Zhang';
  const renderAuthors = (authors: string) => {
    if (!authors || !authors.includes(MY_NAME)) return <span className="italic">{authors}</span>;
    const parts = authors.split(MY_NAME);
    return (
      <span className="italic">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span
                className={`not-italic font-extrabold ${
                  isDarkMode ? 'text-[#eee4d8]' : 'text-black'
                }`}
              >
                {MY_NAME}
              </span>
            )}
          </span>
        ))}
      </span>
    );
  };

  // --- 样式主题 ---
  const theme = {
    wrapper: isDarkMode ? 'bg-[#161310] text-[#eee4d8]' : 'bg-warm-canvas text-warm-ink',
    titleColor: isDarkMode ? 'text-[#eee4d8]' : 'text-warm-ink',
    textColor: isDarkMode ? 'text-[#aaa096]' : 'text-warm-muted',
    metaColor: isDarkMode ? 'text-[#9f958b]' : 'text-warm-muted',
    accentColor: isDarkMode ? 'text-[#dfa089]' : 'text-[#9f4f3b]',

    card: isDarkMode
      ? 'bg-[#241f1b]/66 backdrop-blur-xl backdrop-saturate-150 border border-[#f3e8dc]/[0.08] hover:border-[#cc785c]/25 overflow-hidden'
      : 'bg-warm-surface border border-black/5 hover:border-black/10 shadow-sm hover:shadow-md overflow-hidden',
    
    // 链接按钮 (Small Pills)
    linkBtn: isDarkMode
      ? 'bg-[#2b2520]/80 hover:bg-[#342c26] text-[#d8ccc0] border border-[#f3e8dc]/[0.08]'
      : 'bg-black/5 hover:bg-black/10 text-black border border-black/5',
      
    divider: isDarkMode ? 'border-[#f3e8dc]/10' : 'border-black/10',
  };

  const linkBtnByType = (type: 'paper' | 'code' | 'website' | 'huggingface') => {
    if (type === 'huggingface') {
      return isDarkMode
        ? 'bg-[#b7923f]/15 hover:bg-[#b7923f]/25 text-[#e6cf8a] border border-[#b7923f]/30'
        : 'bg-[#f2e7c8] hover:bg-[#ebddb4] text-[#725913] border border-[#ddca8c]';
    }
    if (type === 'paper') {
      return isDarkMode
        ? 'bg-coral/15 hover:bg-coral/25 text-[#efb29d] border border-coral/30'
        : 'bg-[#f4e1da] hover:bg-[#edd2c8] text-[#9f4f3b] border border-[#dfb8aa]';
    }
    if (type === 'website') {
      return isDarkMode
        ? 'bg-[#6f9482]/15 hover:bg-[#6f9482]/25 text-[#a9c9b9] border border-[#6f9482]/30'
        : 'bg-[#e5ece7] hover:bg-[#d9e4dc] text-[#376453] border border-[#bfd1c6]';
    }
    // code
    return theme.linkBtn;
  };

  return (
    <>
      <Head>
        <title>Publications | Tianshan Zhang</title>
        <meta key="description" name="description" content="Publications and research projects by Tianshan Zhang in 3D vision, generative AI, and physically plausible interaction." />
      </Head>

      <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 font-sans selection:bg-coral/30 flex flex-col ${theme.wrapper}`}>
        
        <Header />

        <main className="flex-grow overflow-x-hidden pt-32 md:pt-40 px-4 md:px-10 lg:px-20 pb-20 max-w-7xl mx-auto w-full">
          
          {/* 标题区域 */}
          <header className="mb-20 text-center md:text-left">
            <motion.h1 
              className={`text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight ${theme.titleColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Publications
            </motion.h1>
            <motion.p 
              className={`text-lg md:text-xl max-w-3xl leading-relaxed ${theme.textColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Selected research papers, conference proceedings, and preprints in Computer Vision and Generative AI.
            </motion.p>
          </header>

          {/* 论文列表 (Grid Layout) */}
          <div className={`grid w-full min-w-0 grid-cols-1 gap-8 ${allPapersData.length > 1 ? 'lg:grid-cols-2' : 'max-w-5xl mx-auto'}`}>
            {allPapersData.map((paper, index) => (
              <motion.article
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className={`group min-w-0 w-full max-w-[calc(100vw-2rem)] lg:max-w-none rounded-2xl flex flex-col transition-all duration-300 ${theme.card}`}
              >
                
                {/* 1. 封面区域（优先视频，其次图片） */}
                {(paper.video || paper.image) && (
                  <div className="relative h-64 w-full min-w-0 overflow-hidden border-b border-opacity-10 border-gray-500">
                    {paper.video ? (
                      <video
                        className="w-full h-full object-cover"
                        src={withBasePath(paper.video)}
                        poster={paper.image ? withBasePath(paper.image) : undefined}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={withBasePath(paper.image!)}
                        alt={paper.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-md text-white border border-white/10 z-10">
                      {paper.venue}
                    </div>
                  </div>
                )}

                {/* 2. 内容区域 */}
                <div className="flex min-w-0 flex-col flex-grow p-6 sm:p-8">
                  
                  {/* Meta Info (没有图片时显示 Venue) */}
                  {!(paper.video || paper.image) && (
                    <div className={`flex items-center gap-2 text-xs font-mono mb-4 uppercase tracking-wider ${theme.accentColor}`}>
                      <MapPin size={12} />
                      <span className="font-bold">{paper.venue}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className={`text-2xl font-bold mb-3 leading-tight break-words group-hover:underline decoration-2 decoration-current underline-offset-4 ${theme.titleColor}`}>
                    {paper.title}
                  </h2>

                  {paper.daily_paper_url && (
                    <a
                      href={paper.daily_paper_url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mb-4 inline-flex w-fit max-w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                        isDarkMode
                          ? 'bg-[#b7923f]/15 hover:bg-[#b7923f]/25 text-[#e6cf8a] border border-[#b7923f]/30'
                          : 'bg-[#f2e7c8] hover:bg-[#ebddb4] text-[#725913] border border-[#ddca8c]'
                      }`}
                      title="Hugging Face Daily Papers"
                    >
                      <Trophy size={14} className="shrink-0" />
                      <span className="min-w-0 truncate">
                        #{paper.daily_paper_rank ?? 2} Paper of the Day · Hugging Face
                      </span>
                    </a>
                  )}

                  {/* Authors */}
                  <div className={`flex min-w-0 items-start gap-2 text-sm mb-5 ${theme.metaColor}`}>
                    <Users size={14} className="mt-1 flex-shrink-0" />
                    {renderAuthors(paper.authors)}
                  </div>

                  {/* Summary */}
                  <p className={`text-sm leading-relaxed mb-6 line-clamp-3 flex-grow break-words ${theme.textColor}`}>
                    {paper.summary}
                  </p>

                  {/* 3. 底部操作栏 (链接按钮) */}
                  <div className={`border-t border-dashed pt-4 ${theme.divider}`}>
                    <div className="grid grid-cols-[auto,minmax(0,1fr),minmax(0,1fr)] items-center gap-1.5">
                      <div className={`inline-flex items-center gap-1.5 pr-2 text-[11px] font-mono opacity-70 ${theme.metaColor}`}>
                        <Calendar size={11} />
                        {paper.date.substring(0, 7)}
                      </div>

                      {paper.arxiv_url && (
                        <a
                          href={paper.arxiv_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ${linkBtnByType('paper')}`}
                        >
                          <FileText size={13} className="shrink-0" /> <span className="truncate">arXiv</span>
                        </a>
                      )}
                      {paper.github_url && (
                        <a href={paper.github_url} target="_blank" rel="noreferrer" className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ${linkBtnByType('code')}`}>
                          <Github size={13} className="shrink-0" /> <span className="truncate">Code</span>
                        </a>
                      )}
                      <div aria-hidden="true" />
                      {paper.url && (
                        <a href={paper.url} target="_blank" rel="noreferrer" className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ${linkBtnByType('website')}`}>
                          <Globe size={13} className="shrink-0" /> <span className="truncate">Website</span>
                        </a>
                      )}
                      {paper.huggingface_url && (
                        <a href={paper.huggingface_url} target="_blank" rel="noreferrer" className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold transition-all ${linkBtnByType('huggingface')}`}>
                          <LinkIcon size={13} className="shrink-0" /> <span className="truncate">HuggingFace</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </motion.article>
            ))}
          </div>

          {allPapersData.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <p className={`text-xl ${theme.textColor}`}>No papers found.</p>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

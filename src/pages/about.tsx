import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import { ArrowUpRight } from 'lucide-react';
import { getTravelData } from '@/lib/travel';
import { getHonorsData } from '@/lib/honors';
import { withBasePath } from '@/lib/basePath';
import { GITHUB_URL, X_URL } from '@/lib/site';
import { useTheme } from '@/context/ThemeContext';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type TravelData = {
  details: {
    world: Record<string, { description: string; visits: number }>;
    china: Record<string, { description: string; visits: number }>;
  };
};

type Honor = {
  award: string;
  event: string;
  year: string | null;
};

type AboutProps = {
  travelData: TravelData;
  honorsData: Honor[];
};

export async function getStaticProps() {
  const travelData = getTravelData();
  // honors.json keeps the year at the end of the description ("CMO, 2021"); split it out
  // so it can sit in its own column.
  const honorsData: Honor[] = getHonorsData().map(
    (honor: { title: string; description: string }) => {
      const match = honor.description.match(/^(.*?),\s*(\d{4})$/);
      return {
        award: honor.title,
        event: match ? match[1] : honor.description,
        year: match ? match[2] : null,
      };
    },
  );
  return {
    props: { travelData, honorsData },
  };
}

export default function About({ travelData, honorsData }: AboutProps) {
  const { isDarkMode } = useTheme();
  const [mapScope, setMapScope] = useState<'world' | 'china'>('world');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [echarts, worldRes, chinaRes] = await Promise.all([
          import('echarts'),
          fetch(withBasePath('/world.json')),
          fetch(withBasePath('/china.json')),
        ]);
        if (!worldRes.ok || !chinaRes.ok) return;
        const worldJson = await worldRes.json();
        const chinaJson = await chinaRes.json();
        echarts.registerMap('world', worldJson);
        echarts.registerMap('china', chinaJson);
        setMapLoaded(true);
      } catch (err) {
        console.error('Map loading failed:', err);
      }
    };
    loadMapData();
  }, []);

  const mapColors = {
    area: isDarkMode ? '#292420' : '#e6e1d4',
    border: isDarkMode ? '#161310' : '#f6f4ee',
    highlight: '#cc785c',
    highlightShadow: isDarkMode ? 'rgba(204, 120, 92, 0.30)' : 'rgba(204, 120, 92, 0.25)',
  };

  const getOption = () => {
    if (!mapLoaded) return {};

    const detailsData = travelData.details[mapScope === 'world' ? 'world' : 'china'];
    const visitedListRaw = Object.keys(detailsData);

    // world.json 使用中文国家名，这里做一个英文->中文的别名映射，保证“去过的地方”能正确命中区域
    const WORLD_NAME_ALIASES: Record<string, string[]> = {
      China: ['中国'],
      Japan: ['日本'],
      'United States': ['美国'],
      Australia: ['澳大利亚'],
      'United Kingdom': ['英国'],
    };

    const visitedItems =
      mapScope === 'world'
        ? visitedListRaw.flatMap((originalName) => {
            const aliases = WORLD_NAME_ALIASES[originalName] ?? [originalName];
            return aliases.map((name) => ({ name, originalName }));
          })
        : visitedListRaw.map((name) => ({ name, originalName: name }));

    const data = visitedItems.map(({ name, originalName }) => ({
      name,
      originalName,
      value: detailsData[originalName].visits,
      details: detailsData[originalName].description,
      itemStyle: {
        areaColor: mapColors.highlight,
        shadowBlur: 12,
        shadowColor: mapColors.highlightShadow,
      },
    }));

    // 让去过的地方“常亮”：即使鼠标移走/缩放拖拽也保持高亮样式
    const regions = visitedItems.map(({ name }) => ({
      name,
      itemStyle: {
        areaColor: mapColors.highlight,
        shadowBlur: 12,
        shadowColor: mapColors.highlightShadow,
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: isDarkMode ? 'rgba(36,31,27,0.94)' : 'rgba(255,255,255,0.92)',
        borderColor: isDarkMode ? '#594b41' : '#ddd',
        textStyle: { color: isDarkMode ? '#eae2d4' : '#23211c' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (!params.data) return params.name;
          const info = params.data;
          return `
            <div style="font-weight:bold; margin-bottom:4px;">${info.originalName || params.name}</div>
            <div style="font-size:12px; opacity:0.8;">Visits: ${info.value}</div>
            ${info.details ? `<div style="font-size:12px; opacity:0.8; margin-top:2px;">${info.details}</div>` : ''}
          `;
        },
      },
      geo: {
        map: mapScope,
        roam: true,
        selectedMode: false,
        regions,
        center: mapScope === 'world' ? [150, 25] : [105, 36],
        zoom: 1.2,
        label: { show: false },
        itemStyle: {
          areaColor: mapColors.area,
          borderColor: mapColors.border,
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: mapColors.highlight,
            shadowBlur: 8,
            shadowColor: mapColors.highlightShadow,
          },
          label: { show: false },
        },
      },
      series: [
        {
          type: 'map',
          geoIndex: 0,
          selectedMode: false,
          data,
        },
      ],
    };
  };

  const placeCounts = {
    world: Object.keys(travelData.details.world).length,
    china: Object.keys(travelData.details.china).length,
  };

  return (
    <>
      <Head>
        <title>About | Tianshan Zhang</title>
        <meta key="description" name="description" content="Biography, academic interests, honors, and travel history of Tianshan Zhang." />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />

        <main className="w-full flex-grow pb-24 pt-28 md:pt-36">
          {/* Intro */}
          <motion.header
            className="mx-auto grid w-full max-w-5xl gap-10 px-6 md:grid-cols-[1fr_2fr] md:gap-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="font-serif text-5xl font-normal leading-[1.05] md:text-[64px]">About</h1>
            <div>
              <p className="text-[17px] leading-relaxed text-muted dark:text-dmuted">
                I study computer science and materials science. My research has two halves that
                keep meeting in the middle: generative models of the world — video generation and
                world models that predict how a scene evolves — and robots that act in it, through
                vision-language-action models and humanoid platforms. I have also worked on
                generative models at the Institute of Automation, CAS, and on mathematical
                reasoning at Zhipu AI.
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 text-sm dark:border-dline sm:grid-cols-3">
                <div>
                  <dt className="text-faint dark:text-dfaint">Currently</dt>
                  <dd className="mt-1 text-ink dark:text-dink">Peking University</dd>
                </div>
                <div>
                  <dt className="text-faint dark:text-dfaint">Studying</dt>
                  <dd className="mt-1 text-ink dark:text-dink">CS &amp; Materials Science</dd>
                </div>
                <div>
                  <dt className="text-faint dark:text-dfaint">Elsewhere</dt>
                  <dd className="mt-1 flex gap-4">
                    {[
                      { href: GITHUB_URL, label: 'GitHub' },
                      { href: X_URL, label: 'X' },
                    ].map(({ href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-ink dark:text-dink"
                      >
                        <span className="link-title">{label}</span>
                        <ArrowUpRight
                          size={14}
                          className="text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral dark:text-dfaint"
                        />
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.header>

          {/* Honors */}
          <Section title="Honors" id="honors">
            {honorsData.map((honor) => (
              <div
                key={`${honor.event}-${honor.award}`}
                className="flex items-baseline justify-between gap-6 border-b border-line py-6 first:pt-0 last:border-b-0 dark:border-dline"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-[22px] font-normal leading-snug">{honor.event}</h3>
                  <p className="mt-1 text-[15px] text-muted dark:text-dmuted">{honor.award}</p>
                </div>
                {honor.year && (
                  <p className="shrink-0 text-sm tabular-nums text-faint dark:text-dfaint">{honor.year}</p>
                )}
              </div>
            ))}
          </Section>

          {/* Footprints */}
          <motion.section
            className="mx-auto mt-24 w-full max-w-5xl px-6 md:mt-32"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="border-t border-line pt-14 dark:border-dline">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h2 className="font-serif text-3xl font-normal leading-tight md:text-[40px]">Footprints</h2>
                  <p className="mt-3 text-[15px] text-muted dark:text-dmuted">
                    <span className="font-serif text-ink dark:text-dink">{placeCounts.world}</span>{' '}
                    countries ·{' '}
                    <span className="font-serif text-ink dark:text-dink">{placeCounts.china}</span>{' '}
                    provinces in China. Drag to pan, scroll to zoom.
                  </p>
                </div>
                <div
                  role="tablist"
                  aria-label="Map scope"
                  className="flex gap-1 rounded-full border border-line p-1 dark:border-dline"
                >
                  {(['world', 'china'] as const).map((scope) => (
                    <button
                      key={scope}
                      role="tab"
                      aria-selected={mapScope === scope}
                      onClick={() => setMapScope(scope)}
                      className={`rounded-full px-4 py-1 text-[13px] transition-colors duration-300 ${
                        mapScope === scope
                          ? 'bg-ink text-paper dark:bg-dink dark:text-dpaper'
                          : 'text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink'
                      }`}
                    >
                      {scope === 'world' ? 'World' : 'China'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-line dark:border-dline sm:h-[420px] md:h-[500px]">
                {mapLoaded ? (
                  <ReactECharts
                    option={getOption()}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-faint dark:text-dfaint">
                    Loading map…
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin } from 'lucide-react';
import { getTravelData } from '@/lib/travel';
import { getHonorsData } from '@/lib/honors';
import { withBasePath } from '@/lib/basePath';
import { useTheme } from '@/context/ThemeContext';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type TravelData = {
  details: {
    world: Record<string, { description: string; visits: number }>;
    china: Record<string, { description: string; visits: number }>;
  };
};

type Honor = {
  title: string;
  description: string;
  date: string;
};

type AboutProps = {
  travelData: TravelData;
  honorsData: Honor[];
};

export async function getStaticProps() {
  const travelData = getTravelData();
  const honorsData = getHonorsData();
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

  const totalPlaces = Object.keys(
    travelData.details[mapScope === 'world' ? 'world' : 'china'],
  ).length;

  return (
    <>
      <Head>
        <title>About | Tianshan Zhang</title>
        <meta key="description" name="description" content="Biography, academic interests, honors, and travel history of Tianshan Zhang." />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />

        <main className="mx-auto w-full max-w-5xl flex-grow px-6 pb-24 pt-28 md:pt-36">
          {/* Intro */}
          <motion.header
            className="mb-20 max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="font-serif text-5xl font-medium leading-[1.08] md:text-6xl">About</h1>
            <p className="mt-6 text-[17px] leading-relaxed text-muted dark:text-dmuted">
              I am a researcher and developer navigating the spaces between generative AI,
              cognitive science, and interactive design. This page chronicles my journey — both
              geographical and academic.
            </p>
          </motion.header>

          {/* Footprints */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium md:text-4xl">Footprints</h2>
              <div className="flex gap-2">
                {(['world', 'china'] as const).map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setMapScope(scope)}
                    className={`rounded-full border px-4 py-1.5 text-[13px] transition-all duration-300 ${
                      mapScope === scope
                        ? 'border-ink bg-ink text-paper dark:border-dink dark:bg-dink dark:text-dpaper'
                        : 'border-line text-muted hover:border-ink/30 hover:text-ink dark:border-dline dark:text-dmuted dark:hover:border-dink/30 dark:hover:text-dink'
                    }`}
                  >
                    {scope === 'world' ? 'World' : 'China'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-line dark:border-dline">
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

            <div className="mt-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-sm text-faint dark:text-dfaint">
                <MapPin size={14} />
                <span>Total locations</span>
              </div>
              <p className="text-sm text-muted dark:text-dmuted">
                <span className="font-serif text-lg text-ink dark:text-dink">{totalPlaces}</span>{' '}
                visited
              </p>
            </div>
          </motion.section>

          {/* Honors */}
          <motion.section
            id="honors"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="mb-8 font-serif text-3xl font-medium md:text-4xl">Honors &amp; Awards</h2>
            <div className="border-t border-line dark:border-dline">
              {honorsData.map((honor, index) => (
                <div
                  key={index}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-6 dark:border-dline"
                >
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-medium leading-snug">{honor.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted dark:text-dmuted">
                      {honor.description}
                    </p>
                  </div>
                  {honor.date && (
                    <p className="shrink-0 text-sm text-faint dark:text-dfaint">{honor.date}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </>
  );
}

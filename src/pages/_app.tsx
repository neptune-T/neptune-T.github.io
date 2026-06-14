import '@/styles/globals.css'
import 'katex/dist/katex.min.css';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withBasePath } from '@/lib/basePath';
import { ThemeProvider } from '@/context/ThemeContext';
import { SITE_NAME, toAbsoluteUrl, toCanonicalUrl } from '@/lib/site';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canonicalUrl = toCanonicalUrl(router.asPath);

  return (
    <>
      <Head>
        <meta
          key="description"
          name="description"
          content="Tianshan Zhang's academic homepage, featuring research in 3D vision, generative AI, computer graphics, and physically plausible interaction."
        />
        <meta name="author" content="Tianshan Zhang" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link key="canonical" rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta key="og-type" property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta key="og-title" property="og:title" content="Tianshan Zhang | 张天山" />
        <meta key="og-description" property="og:description" content="Research, publications, and technical notes by Tianshan Zhang." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={toAbsoluteUrl(withBasePath('/favicon.ico'))} />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp;

import { Html, Head, Main, NextScript } from "next/document";

// Runs before first paint so the correct theme class is on <html> immediately —
// prevents any light/dark flash on the statically exported site.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.backgroundColor=t==='dark'?'#161310':'#F6F4EE';}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <meta name="theme-color" content="#161310" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F6F4EE" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.ico`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,500;1,400&family=Noto+Serif+SC:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

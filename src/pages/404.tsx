import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found | Tianshan Zhang</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink transition-colors duration-500 dark:bg-dpaper dark:text-dink">
        <Header />

        <main className="mx-auto flex w-full max-w-3xl flex-grow flex-col justify-center px-6 pb-24 pt-28 md:pt-36">
          <p className="font-serif text-sm text-coral">404</p>
          <h1 className="mt-4 font-serif text-5xl font-normal leading-[1.05] md:text-[64px]">
            This page is not on the shelf.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted dark:text-dmuted">
            The link may be outdated, or the note may have moved. The index below is a good place
            to start again.
          </p>
          <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-ink transition-colors duration-300 hover:text-coral dark:text-dink"
            >
              <ArrowLeft size={15} className="text-faint transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-coral dark:text-dfaint" />
              Home
            </Link>
            <Link href="/notes" className="text-ink transition-colors duration-300 hover:text-coral dark:text-dink">
              Notes
            </Link>
            <Link href="/papers" className="text-ink transition-colors duration-300 hover:text-coral dark:text-dink">
              Papers
            </Link>
          </nav>
        </main>

        <Footer />
      </div>
    </>
  );
}

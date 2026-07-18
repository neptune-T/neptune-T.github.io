import { FaGithub } from 'react-icons/fa';
import { GITHUB_URL } from '@/lib/site';

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-14 pt-4">
      <div className="border-t border-line pt-8 transition-colors duration-500 dark:border-dline">
        <div className="flex items-center justify-between gap-6">
          <p className="text-sm text-muted dark:text-dmuted">
            <span className="font-serif text-[15px] font-medium text-ink dark:text-dink">
              Tianshan Zhang
            </span>
            <span className="mx-2 text-faint dark:text-dfaint">·</span>
            Academic Homepage
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-faint transition-colors duration-300 hover:text-ink dark:text-dfaint dark:hover:text-dink"
          >
            <FaGithub size={18} />
          </a>
        </div>
        <p className="mt-6 font-serif text-sm italic leading-relaxed text-faint dark:text-dfaint">
          “We can only see a short distance ahead, but we can see plenty there that needs to be
          done.” — Alan Turing
        </p>
        <p className="mt-3 text-xs text-faint dark:text-dfaint">© 2026 Tianshan Zhang</p>
      </div>
    </footer>
  );
};

export default Footer;

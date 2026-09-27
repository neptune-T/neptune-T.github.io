import { Github } from 'lucide-react';
import XIcon from '@/components/XIcon';
import { GITHUB_URL, X_URL } from '@/lib/site';

const SOCIAL_LINKS = [
  { href: GITHUB_URL, label: 'GitHub', icon: <Github size={17} /> },
  { href: X_URL, label: 'X', icon: <XIcon size={15} /> },
];

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-14 pt-4">
      <div className="grid gap-8 border-t border-line pt-10 transition-colors duration-500 dark:border-dline md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <p className="font-serif text-lg text-ink dark:text-dink">
            Tianshan Zhang
            <span className="ml-2 text-muted dark:text-dmuted">张天山</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-faint transition-colors duration-300 hover:text-ink dark:text-dfaint dark:hover:text-dink"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <p className="max-w-lg font-serif text-[17px] italic leading-relaxed text-muted dark:text-dmuted">
            “We can only see a short distance ahead, but we can see plenty there that needs to be
            done.”
            <span className="not-italic text-faint dark:text-dfaint"> — Alan Turing</span>
          </p>
          <p className="text-xs text-faint dark:text-dfaint">© 2026 Tianshan Zhang</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

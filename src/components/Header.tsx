"use client";

import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/notes', label: 'Notes' },
  { href: '/papers', label: 'Papers' },
  { href: '/about', label: 'About' },
];

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md transition-colors duration-500 dark:border-dline dark:bg-dpaper/85">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-[17px] font-medium text-ink no-underline transition-colors duration-500 dark:text-dink"
        >
          Tianshan Zhang
        </Link>

        <nav className="flex items-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm no-underline transition-colors duration-300 ${
                  isActive(href)
                    ? 'text-ink dark:text-dink'
                    : 'text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink'
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute -bottom-[7px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral" />
                )}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-ink active:scale-95 dark:text-dmuted dark:hover:text-dink"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-ink active:scale-95 dark:text-dmuted dark:hover:text-dink md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-paper/95 backdrop-blur-md dark:border-dline dark:bg-dpaper/95 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-2">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`border-b border-line py-3 text-sm no-underline last:border-b-0 dark:border-dline ${
                  isActive(href)
                    ? 'text-ink dark:text-dink'
                    : 'text-muted dark:text-dmuted'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

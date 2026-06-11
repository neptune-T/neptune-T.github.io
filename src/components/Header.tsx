"use client";

import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  // 兼容旧用法：如果页面仍传入 isDarkMode/setIsDarkMode，就使用它
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode: isDarkModeProp, setIsDarkMode }) => {
  const { isDarkMode: isDarkModeCtx, toggleTheme } = useTheme();
  const isDarkMode = isDarkModeProp ?? isDarkModeCtx;
  const onToggleTheme = () => {
    if (setIsDarkMode) setIsDarkMode(!isDarkMode);
    else toggleTheme();
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep the fixed header compact so it does not compete with the hero.
  const glassNavClass = isDarkMode 
    ? 'bg-[#1a1714]/72 border-[#f3e8dc]/10 text-[#eee4d8]'
    : 'bg-warm-surface/72 border-white/70 text-warm-ink';
  const navLinkStyle = { color: isDarkMode ? '#eee4d8' : '#242321' };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 py-2.5 transition-colors duration-500 border-b backdrop-blur-2xl backdrop-saturate-150 ${glassNavClass}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-[15px] md:text-base font-bold no-underline" style={navLinkStyle}>
        Plote Motion Field
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-2.5 md:gap-5 text-[13px] font-medium">
         <Link href="/" className="hidden md:inline cursor-pointer hover:opacity-60 transition-opacity no-underline" style={navLinkStyle}>
            Home
         </Link>
         <Link href="/notes" className="hidden md:inline cursor-pointer hover:opacity-60 transition-opacity no-underline" style={navLinkStyle}>
            Notes
         </Link>
         <Link href="/papers" className="hidden md:inline cursor-pointer hover:opacity-60 transition-opacity no-underline" style={navLinkStyle}>
            Papers
         </Link>
         <Link href="/about" className="hidden md:inline cursor-pointer hover:opacity-60 transition-opacity no-underline" style={navLinkStyle}>
            About
         </Link>
         
         {/* Theme Toggle Button */}
         <button 
           onClick={onToggleTheme}
           className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 hover:bg-current/5 transition-colors active:scale-95 text-current"
           aria-label="Toggle Dark Mode"
         >
           {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
         </button>

         {/* Mobile Menu Button */}
         <button
           onClick={() => setMobileOpen((v) => !v)}
           className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-current/20 hover:bg-current/5 transition-colors active:scale-95 text-current"
           aria-label="Toggle Navigation Menu"
         >
           {mobileOpen ? <X size={18} /> : <Menu size={18} />}
         </button>
      </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2.5 rounded-2xl border border-current/10 overflow-hidden">
          <div className={`flex flex-col ${isDarkMode ? 'bg-[#1a1714]/82' : 'bg-warm-surface/78'} backdrop-blur-2xl backdrop-saturate-150`}>
            <Link
              href="/"
              className="px-4 py-3 hover:bg-current/5 transition-colors"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/notes"
              className="px-4 py-3 hover:bg-current/5 transition-colors"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              Notes
            </Link>
            <Link
              href="/papers"
              className="px-4 py-3 hover:bg-current/5 transition-colors"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              Papers
            </Link>
            <Link
              href="/about"
              className="px-4 py-3 hover:bg-current/5 transition-colors"
              style={navLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

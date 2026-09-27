import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type SectionProps = {
  title: string;
  id?: string;
  action?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
};

// Two-column editorial section: the heading sits in a narrow left column and stays
// pinned while the right column scrolls past it on wide screens.
export default function Section({ title, id, action, className = '', children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`mx-auto mt-24 w-full max-w-5xl px-6 md:mt-32 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="grid gap-10 border-t border-line pt-14 dark:border-dline md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="font-serif text-3xl font-normal leading-tight md:text-[40px]">{title}</h2>
          {action && (
            <Link
              href={action.href}
              className="group mt-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-ink dark:text-dmuted dark:hover:text-dink"
            >
              {action.label}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-coral"
              />
            </Link>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </motion.section>
  );
}

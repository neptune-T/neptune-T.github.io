import { useEffect, useMemo, useState } from 'react';
import type { TocItem } from '@/lib/notes';

type TocGroup = TocItem & { children: TocItem[] };

const groupToc = (toc: TocItem[]): TocGroup[] => {
  const top = Math.min(...toc.map((item) => item.depth));
  const groups: TocGroup[] = [];
  toc.forEach((item) => {
    if (item.depth === top || groups.length === 0) groups.push({ ...item, children: [] });
    else groups[groups.length - 1].children.push(item);
  });
  return groups;
};

// The heading currently being read: the last one whose top has scrolled past the header.
const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
        else if (el) break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
};

function TocList({ groups, active, onNavigate }: { groups: TocGroup[]; active: string | null; onNavigate?: () => void }) {
  return (
    <ol className="space-y-2.5 text-sm">
      {groups.map((group) => {
        const inGroup = active === group.id || group.children.some((c) => c.id === active);
        return (
          <li key={group.id}>
            <a
              href={`#${group.id}`}
              onClick={onNavigate}
              className={`-ml-px block border-l py-0.5 pl-3 leading-snug transition-colors duration-300 ${
                inGroup
                  ? 'border-coral text-ink dark:text-dink'
                  : 'border-transparent text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: group.html }} />
            </a>
            {inGroup && group.children.length > 0 && (
              <ol className="mt-2 space-y-2 pl-6">
                {group.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      onClick={onNavigate}
                      className={`block text-[13px] leading-snug transition-colors duration-300 ${
                        active === child.id
                          ? 'text-ink dark:text-dink'
                          : 'text-faint hover:text-ink dark:text-dfaint dark:hover:text-dink'
                      }`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: child.html }} />
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function NoteTocAside({ toc }: { toc: TocItem[] }) {
  const groups = useMemo(() => groupToc(toc), [toc]);
  const ids = useMemo(() => toc.map((item) => item.id), [toc]);
  const active = useActiveHeading(ids);

  return (
    <aside className="absolute bottom-0 left-full top-0 ml-12 hidden w-56 min-[1360px]:block">
      <nav
        aria-label="Contents"
        className="scrollbar-none sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto border-l border-line dark:border-dline"
      >
        <p className="mb-4 pl-3 font-serif text-sm italic text-faint dark:text-dfaint">Contents</p>
        <TocList groups={groups} active={active} />
      </nav>
    </aside>
  );
}

export function NoteTocInline({ toc }: { toc: TocItem[] }) {
  const groups = useMemo(() => groupToc(toc), [toc]);
  const [open, setOpen] = useState(false);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group mt-8 border-y border-line py-4 dark:border-dline min-[1360px]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-muted dark:text-dmuted [&::-webkit-details-marker]:hidden">
        <span className="font-serif italic">Contents</span>
        <span className="text-faint transition-transform duration-300 group-open:rotate-45 dark:text-dfaint">+</span>
      </summary>
      <div className="mt-4 border-l border-line dark:border-dline">
        <ol className="space-y-2.5 text-sm">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                onClick={() => setOpen(false)}
                className="block pl-3 leading-snug text-muted hover:text-ink dark:text-dmuted dark:hover:text-dink"
              >
                <span dangerouslySetInnerHTML={{ __html: group.html }} />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

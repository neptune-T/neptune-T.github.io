import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // SSR 与客户端首次渲染必须一致（React hydration），因此初始值固定为 'dark'；
  // 真实的主题由 _document 里的预置脚本写到了 <html> class 上，挂载后再同步过来。
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Tailwind darkMode: 'class' -> 需要 html 上有 'dark'
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;

    // 同步背景，避免页面边缘/滚动区域闪白
    const bg = theme === 'dark' ? '#161310' : '#F6F4EE';
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (undefined === context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

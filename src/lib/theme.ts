
type Theme = 'dark' | 'light';

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

export function getThemeFromStorage(): Theme | null {
  const theme = localStorage.getItem('theme');
  return theme === 'dark' || theme === 'light' ? theme : null;
}

export function initializeTheme() {
  const storedTheme = getThemeFromStorage();
  const theme = storedTheme || getSystemTheme();
  setTheme(theme);
}

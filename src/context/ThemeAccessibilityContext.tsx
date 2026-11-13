import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExhibitId } from '../three/proceduralScenes';

export type ThemeMode = 'dark' | 'light';
export type FontSizeScale = 'normal' | 'large' | 'larger';

interface ThemeAccessibilityContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
  fontSize: FontSizeScale;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  is3DStudioOpen: boolean;
  threeExhibit: ExhibitId;
  open3DStudio: (exhibit?: ExhibitId) => void;
  close3DStudio: () => void;
}

const ThemeAccessibilityContext = createContext<ThemeAccessibilityContextType | undefined>(undefined);

export const ThemeAccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('gmf_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gmf_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [fontSize, setFontSizeState] = useState<FontSizeScale>(() => {
    try {
      const saved = localStorage.getItem('gmf_font_size');
      if (saved === 'large' || saved === 'larger') return saved;
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [threeExhibit, setThreeExhibit] = useState<ExhibitId>('cavalo');

  // Apply classes to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // High Contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-size-large', 'font-size-larger');
    if (fontSize === 'large') {
      root.classList.add('font-size-large');
    } else if (fontSize === 'larger') {
      root.classList.add('font-size-larger');
    }

    try {
      localStorage.setItem('gmf_theme', theme);
      localStorage.setItem('gmf_high_contrast', String(highContrast));
      localStorage.setItem('gmf_font_size', fontSize);
    } catch {
      // Ignore storage errors in restrictive environments
    }
  }, [theme, highContrast, fontSize]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K for search, Alt+C for high contrast, Alt+T for theme)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K -> Quick Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      // Alt+C -> Toggle High Contrast
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        toggleHighContrast();
      }
      // Alt+T -> Toggle Theme (Dark / Light)
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => !prev);
  };

  const setHighContrast = (value: boolean) => {
    setHighContrastState(value);
  };

  const increaseFontSize = () => {
    setFontSizeState((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'larger';
      return 'larger';
    });
  };

  const decreaseFontSize = () => {
    setFontSizeState((prev) => {
      if (prev === 'larger') return 'large';
      if (prev === 'large') return 'normal';
      return 'normal';
    });
  };

  const resetFontSize = () => {
    setFontSizeState('normal');
  };

  const open3DStudio = (exhibit: ExhibitId = 'cavalo') => {
    setThreeExhibit(exhibit);
    setIs3DStudioOpen(true);
  };

  const close3DStudio = () => {
    setIs3DStudioOpen(false);
  };

  return (
    <ThemeAccessibilityContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        highContrast,
        toggleHighContrast,
        setHighContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        isSearchOpen,
        setIsSearchOpen,
        is3DStudioOpen,
        threeExhibit,
        open3DStudio,
        close3DStudio,
      }}
    >
      {children}
    </ThemeAccessibilityContext.Provider>
  );
};

export const useAccessibility = (): ThemeAccessibilityContextType => {
  const context = useContext(ThemeAccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within a ThemeAccessibilityProvider');
  }
  return context;
};

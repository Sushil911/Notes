import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform, useColorScheme, useWindowDimensions } from 'react-native';

// Centralized Types
export type ColorScheme = 'light' | 'dark';

export interface Colors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentDark: string;
  destructive: string;
  shadow: string;
  placeholder: string;
}

export interface Theme {
  mode: ColorScheme;
  isDark: boolean;
  colors: Colors;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  borders: typeof BORDERS;
  shadow: ReturnType<typeof createShadow>;
  getShadow: (offset?: { width: number; height: number }) => ReturnType<typeof createShadow>;
}

// Font families
const FONT_FAMILIES = {
  heading: 'SpaceGrotesk-Bold',
  body: 'JetBrainsMono-Regular',
  ui: 'SpaceGrotesk-Regular',
  uiMedium: 'SpaceGrotesk-Medium',
  button: 'JetBrainsMono-Bold',
};

// Typography
export const TYPOGRAPHY = {
  display: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: 24,
    lineHeight: 28,
  },
  body: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 18,
    lineHeight: 28,
  },
  small: {
    fontFamily: FONT_FAMILIES.uiMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  tiny: {
    fontFamily: FONT_FAMILIES.uiMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: FONT_FAMILIES.button,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
} as const;

// Spacing and Borders
export const SPACING = {
  xs: 8,
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
  xxl: 64,
} as const;

export const BORDERS = {
  width: 3,
  radius: 0,
} as const;

// Color Palette
const LIGHT_COLORS: Colors = {
  background: '#FCFAF2',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#2D2D2D',
  border: '#000000',
  accent: '#FFE600',
  accentDark: '#F0D800',
  destructive: '#FF3B30',
  shadow: '#000000',
  placeholder: '#999999',
};

const DARK_COLORS: Colors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#FFFFFF',
  accent: '#FFE600',
  accentDark: '#F0D800',
  destructive: '#FF3B30',
  shadow: '#FFFFFF',
  placeholder: '#777777',
};

// Creating shadows
export const createShadow = (shadowColor: string) => {
  // The standard old-style shadow for iOS, in case boxShadow is not supported
  const iosShadowStyle = {
    shadowColor,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  };

  // Using new cross-platform boxShadow API
  if (Platform.OS !== 'web') {
    return {
      ...iosShadowStyle,
      boxShadow: `4px 4px 0px 0px ${shadowColor}`,
    };
  }
  return iosShadowStyle;
};

// Theme Generator 
export const getTheme = (colorScheme: ColorScheme): Theme => {
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    mode: colorScheme,
    isDark,
    colors,
    typography: TYPOGRAPHY,
    spacing: SPACING,
    borders: BORDERS,
    shadow: createShadow(colors.shadow),
    getShadow: (offset = { width: 4, height: 4 }) => ({
      ...createShadow(colors.shadow),
      shadowOffset: { width: offset.width, height: offset.height },
    }),
  };
};

// Theme Context
type ThemeMode = ColorScheme | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
  isTablet: boolean;
  dimensions: { width: number; height: number };
  scale: number;
}

const defaultTheme = getTheme('light');
const defaultContext: ThemeContextType = {
  themeMode: 'system',
  setThemeMode: () => {},
  theme: defaultTheme,
  isTablet: false,
  dimensions: { width: 0, height: 0 },
  scale: 1,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme() ?? 'light';
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const dimensions = useWindowDimensions();
  const isTablet = dimensions.width >= 600;
  const scale = isTablet ? 1.3 : 1;

  const resolvedMode: ColorScheme = useMemo(() => {
    if (themeMode === 'system') return systemScheme as ColorScheme;
    return themeMode;
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

  return (
    <ThemeContext.Provider
      value={{ themeMode, setThemeMode, theme, isTablet, dimensions, scale }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
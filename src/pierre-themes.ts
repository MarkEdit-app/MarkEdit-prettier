import { normalizeTheme } from 'shiki/core';
import type { ThemeRegistration } from 'shiki/core';

type ThemeLoader = () => Promise<{ default: ThemeRegistration }>;

interface ThemeOptions {
  name: string;
  colorScheme?: 'light' | 'dark';
  collection?: string;
  displayName?: string;
  load: ThemeLoader;
}

export function createTheme(options: ThemeOptions) {
  return {
    ...options,
    load: async() => normalizeTheme((await options.load()).default),
  };
}

const descriptors = [
  createTheme({
    name: 'github-light-default',
    colorScheme: 'light',
    collection: 'github',
    displayName: 'GitHub Light Default',
    load: () => import('@shikijs/themes/github-light-default'),
  }),
  createTheme({
    name: 'github-dark-default',
    colorScheme: 'dark',
    collection: 'github',
    displayName: 'GitHub Dark Default',
    load: () => import('@shikijs/themes/github-dark-default'),
  }),
];

export const pierreThemes = {
  getTheme: (name: string) => descriptors.find((theme) => theme.name === name),
  getThemes: () => descriptors,
};

export const shikiThemes = {
  getTheme: () => undefined,
  getThemes: () => [],
};

export const themes = pierreThemes;

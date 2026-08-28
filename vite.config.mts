import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { defaultViteConfig } from 'markedit-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const config = defaultViteConfig();

export default defineConfig({
  ...config,
  resolve: {
    alias: [
      {
        find: /^@pierre\/theming\/themes$/,
        replacement: fileURLToPath(new URL('./src/pierre-themes.ts', import.meta.url)),
      },
      {
        find: /^shiki(?:\/wasm)?$/,
        replacement: fileURLToPath(new URL('./src/shiki.ts', import.meta.url)),
      },
    ],
  },
  plugins: [...(config.plugins ?? []), viteSingleFile()],
});

import { defineConfig } from 'vite';
import { defaultViteConfig } from 'markedit-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const config = defaultViteConfig();

export default defineConfig({
  ...config,
  plugins: [...(config.plugins ?? []), viteSingleFile()],
});

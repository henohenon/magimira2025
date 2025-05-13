import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  root: 'src',
  envDir: '../',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
      }
    }
  },
  plugins: [
    tailwind(),
    visualizer({ open: true })
  ]
});

import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  root: 'src',
  envDir: '../',
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
    tailwind()
  ]
});

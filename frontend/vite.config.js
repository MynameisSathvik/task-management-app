import { defineConfig } from 'vite';

// Minimal Vite config without ESM-only plugin to avoid environment resolver issues.
export default defineConfig({
  server: { port: 3000 }
});

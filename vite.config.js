import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    // ═══ CHUNK SIZE OPTIMIZATION ═══
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // ═══ MANUAL CHUNKING ═══
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'motion-vendor': ['framer-motion'],
          // Charts
          'chart-vendor': ['recharts'],
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // Icons
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // ═══ MINIFY WITH TERSER ═══
    minify: 'esbuild',
    // ═══ CSS CODE SPLIT ═══
    cssCodeSplit: true,
    // ═══ SOURCE MAP OFF (PRODUCTION) ═══
    sourcemap: false,
    // ═══ REPORT COMPRESSED SIZE ═══
    reportCompressedSize: false,
    // ═══ TARGET MODERN BROWSERS ═══
    target: 'esnext',
  },
  // ═══ DEPENDENCY PRE-BUNDLING ═══
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'framer-motion',
      'lucide-react',
    ],
  },
  // ═══ GZIP BUILD ═══
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
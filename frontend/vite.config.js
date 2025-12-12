// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { fileURLToPath, URL } from 'node:url';


// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // AJOUTE ÇA :
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  
  },
  server: {
    historyApiFallback: true
  }
});
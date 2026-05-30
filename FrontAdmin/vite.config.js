import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    base: '/admin/',
    plugins: [react()],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                assetFileNames: 'admin/assets/[name]-[hash][extname]',
                chunkFileNames: 'admin/assets/[name]-[hash].js',
                entryFileNames: 'admin/assets/[name]-[hash].js',
            }
        }
    }
}) 
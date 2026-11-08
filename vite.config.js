import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import os from "os"
import { fileURLToPath } from "url" // <--- 1. Tambah import ini

// 2. Buat __dirname secara manual untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Cache di luar folder proyek: menghindari EPERM saat folder node_modules/.vite dikunci proses lain
  cacheDir: path.join(os.tmpdir(), "vite-cache-westside"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- Sekarang ini akan berhasil
    },
  },
})
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE &&
      visualizer({
        open: false, // IMPORTANT for EC2
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
});

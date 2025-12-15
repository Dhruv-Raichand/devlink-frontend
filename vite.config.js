import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];

  if (process.env.ANALYZE) {
    const { visualizer } = await import("rollup-plugin-visualizer");
    plugins.push(
      visualizer({
        open: false, // EC2 safe
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return { plugins };
});

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Export library configuration
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // Ganti ini ke entry point JS, bukan Vue component
      entry: "src/index.js",
      name: "VueStrokeWriter",
      fileName: (format) => `vue-stroke-writer.${format}.js`,
    },
    rollupOptions: {
      // Jangan lupa tambahkan `vue` sebagai external dependency
      external: ["vue"],
      output: {
        // Kalau pakai Vue 3, global-nya adalah `Vue`
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

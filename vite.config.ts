import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true, // dist/index.d.ts 자동 생성
      outputDir: "dist", // 타입을 dist/ 폴더에 배치
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts", // 🔥 빌드 진입점
      name: "ExclusiveTypeScriptSDK",
      fileName: (format) => `index.${format}.js`, // 🔥 index.js, index.esm.js 생성
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});

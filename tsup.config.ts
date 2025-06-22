import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // .d.ts 타입도 함께 출력
  sourcemap: true,
  clean: true,
  external: ["react"],
});

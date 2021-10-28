import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

export const hooks = {
  input: "src/hooks/index.ts",
  output: [
    {
      file: "dist/hooks/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/hooks/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [commonjs(), typescript(), babel({ extensions: [".ts"] }), terser()],
};

export default [hooks];

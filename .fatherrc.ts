import { defineConfig } from 'father';

export default defineConfig({
  esm: { output: 'esm' },
  cjs: { output: 'lib' },
});

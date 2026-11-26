import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: [],
    typecheck: {
      enabled: true,
      only: true,
      include: ['projects/ngx-formpulse/**/*.test-d.ts'],
      tsconfig: './tsconfig.typecheck.json'
    }
  }
});

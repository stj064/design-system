import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

function copyTokensPlugin() {
  return {
    name: 'copy-tokens',
    closeBundle() {
      mkdirSync('dist/tokens', { recursive: true })
      const tokens = ['colors', 'typography', 'spacing', 'effects', 'base']
      for (const t of tokens) {
        copyFileSync(`src/tokens/${t}.css`, `dist/tokens/${t}.css`)
      }
      copyFileSync('src/styles.css', 'dist/styles.css')
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], rollupTypes: true }),
    copyTokensPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React' },
      },
    },
    cssCodeSplit: false,
  },
})

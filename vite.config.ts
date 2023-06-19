import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  server: {
    open: "/src/index.html",
    host: true,
  },

  resolve: {
    alias: {
      "@utils": "/src/utils/",
      "@const": "/src/const.ts",
    },
  },

  optimizeDeps: {
    entries: "/src/main.ts",
  },

  build: {
    emptyOutDir: false,
    lib: {
      entry: "/src/main.ts",
      formats: [ "iife" ],
      name: "init",
      fileName: "bundle",
    },
    outDir: "public",
    // rollupOptions: {
    //   input: "/src/main.ts",
    //   output: {
    //     dir: "public",
    //     entryFileNames: "bundle.js",
    //     paths: {
    //       three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.module.min.js",
    //     },
    //   },
    //   external: [ "three" ],
    // },
  },
})

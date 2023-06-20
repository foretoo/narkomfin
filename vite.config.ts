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

    rollupOptions: {
      output: {
        globals: {
          three: "THREE",
        },
      },
      external: [ "three" ],
    },
  },
})

import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  server: {
    open: "/src/index.html",
    host: true,
  },
  resolve: {
    alias: {
      init: "/src/init.ts",
      utils: "/src/utils.ts",
    },
  },
  optimizeDeps: {
    entries: "/src/index.ts",
  },
  build: {
    rollupOptions: {
      input: "/src/index.ts",
      external: ["three"],
      output: {
        dir: "dist",
        entryFileNames: "bundle.js",
        paths: {
          three: "../public/three.module.js"
        }
      },
    }
  }
})

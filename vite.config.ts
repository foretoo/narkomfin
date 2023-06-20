import { defineConfig } from "vite"
import fs from "fs"
import PACKAGE from "./package.json"



export default (env: { command: "serve" | "build" }) => {

  let version = parseInt(PACKAGE.version)
  if (env.command === "build") {
    updateVersion(++version)
  }

  return defineConfig({
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
      },

      outDir: "public",

      rollupOptions: {
        output: {
          entryFileNames: `bundle${version}.js`,
          globals: {
            three: "THREE",
          },
        },
        external: [ "three" ],
      },
    },
  })
}



const updateVersion = (
  version: number,
) => {
  const str = `${version}`

  const pkgPath = "./package.json"
  const pkgRgx = /(?<="version": ")\d+(?=",)/m
  editFile(pkgPath, pkgRgx, str)

  const htmlPath = "./index.html"
  const htmlRgx = /(?<=src="\.\/public\/bundle)\d+(?=\.js")/m
  editFile(htmlPath, htmlRgx, str)
}



const editFile = (
  path: string,
  regex: RegExp,
  str: string,
) => {
  fs.readFile(path, "utf8", (readError, data) => {
    if (readError) throw readError
    fs.writeFile(
      path,
      data.replace(regex, str),
      (writeError) => { if (writeError) throw writeError },
    )
  })
}
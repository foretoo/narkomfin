import { DataTexture, LoadingManager, Texture, TextureLoader } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

import { IFetchedData } from "src/types"
import { pngs } from "@const"



const manager = new LoadingManager() // 20 items



const unpkgDracoPath = "https://unpkg.com/three@0.149.0/examples/jsm/libs/draco/"
const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath(unpkgDracoPath)

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

const textureLoader = new TextureLoader(manager)
const hdrLoader = new RGBELoader(manager)



type IFetches = Promise<GLTF | Texture | DataTexture>[]



export const loadModel = async (
  path: string,
  onProgress: (loaded: number) => void = () => {},
  onError: Parameters<typeof gltfLoader.load>[3]  = () => {},
  onDecode: () => void  = () => {},
): Promise<IFetchedData> => {

  const fetches: IFetches = [
    ...pngs.map<Promise<Texture>>((name) => (
      new Promise((res) => void textureLoader.load(`${path}${name}.png`, res, undefined, onError))
    )),

    ...pngs.map<Promise<Texture>>((name) => (
      new Promise((res) => void textureLoader.load(`${path}${name}_night.png`, res, undefined, onError))
    )),

    new Promise((res) => void textureLoader.load(`${path}glass_night.png`, res, undefined, onError)),

    new Promise((res) => void textureLoader.load(`${path}bulbs.png`, res, undefined, onError)),

    new Promise((res) => void hdrLoader.load(`${path}env.hdr`, res, undefined, onError)),

    new Promise((res) => void gltfLoader.load(`${path}narkom14.txt`, res, undefined, onError)),
  ]

  let n = 0
  onProgress(0)
  manager.onProgress = (url, loaded, total) => {
    if (!url.match(/^data:/) && url.match(/png|txt|hdr/)) {
      n++
      onProgress(n / fetches.length)
    }
  }

  manager.itemStart = (url) => {
    (/^data:/.test(url) && onDecode && onDecode())
  }

  return Promise.all(fetches)
}

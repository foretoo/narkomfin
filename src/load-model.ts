import { DataTexture, Loader, LoadingManager, Texture, TextureLoader } from "three"
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
  onError = () => {},
  onDecode: () => void  = () => {},
): Promise<IFetchedData> => new Promise((all_res, rej) => {

  const fetches: IFetches = []
  const fetchMap = new Map<string, TextureLoader | RGBELoader | GLTFLoader>()

  for (const name of pngs) {
    fetchMap.set(`${path}${name}.png`, textureLoader)
    fetchMap.set(`${path}${name}_night.png`, textureLoader)
  }
  fetchMap.set(`${path}glass_night.png`, textureLoader)
  fetchMap.set(`${path}bulbs.png`, textureLoader)
  fetchMap.set(`${path}env.hdr`, hdrLoader)
  fetchMap.set(`${path}narkom14.txt`, gltfLoader)

  for (const [ src, loader ] of fetchMap.entries()) {
    fetches.push(new Promise((res) => void loader.load(src, res, undefined, () => rej(src))))
  }



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

  Promise.all(fetches).then((data) => all_res(data))
})

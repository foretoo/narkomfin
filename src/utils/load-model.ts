import { DataTexture, LoadingManager, Texture, TextureLoader } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

import { IFetchedData } from "src/types"
import { pngs } from "@const"



const manager = new LoadingManager()



const unpkgDracoPath = "https://unpkg.com/three@0.149.0/examples/jsm/libs/draco/"
const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath(unpkgDracoPath)

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

const textureLoader = new TextureLoader(manager)
const hdrLoader = new RGBELoader(manager)



type IFetches = Promise<GLTF | Texture | DataTexture>[]



export const loadModel = async (
  modelPath: string,
  texturePath: string,
  onProgress?: Parameters<typeof gltfLoader.load>[2],
  onError?: Parameters<typeof gltfLoader.load>[3],
  onDecode?: () => void,
): Promise<IFetchedData> => {

  manager.itemStart = (url) => void (/^data:/.test(url) && onDecode && onDecode())

  const fetches: IFetches = [
    ...pngs.map<Promise<Texture>>((name) => (
      new Promise((res) => void textureLoader.load(`${texturePath}${name}.png`, res))
    )),

    ...pngs.map<Promise<Texture>>((name) => (
      new Promise((res) => void textureLoader.load(`${texturePath}${name}_night.png`, res))
    )),

    new Promise((res) => void textureLoader.load(`${texturePath}glass_night.png`, res)),

    new Promise((res) => void textureLoader.load(`${texturePath}bulbs.png`, res)),

    new Promise((res) => void hdrLoader.load(`${texturePath}env.hdr`, res)),

    new Promise((res) => void gltfLoader.load(modelPath, res, onProgress, onError)),
  ]

  return Promise.all(fetches)
}

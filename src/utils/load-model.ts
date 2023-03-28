import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { LoadingManager } from "three"



const base = import.meta.env.PROD
  ? "https://foretoo.github.io/narkomfin"
  : ""



const manager = new LoadingManager()

const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath(base + "/public/vendors/")

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)



export const loadModel = (
  name: string,
  onProgress?: Parameters<typeof gltfLoader.load>[2],
  onError?: Parameters<typeof gltfLoader.load>[3],
  onDecode?: () => void,
): Promise<GLTF> => {

  manager.itemStart = (url) => void (/^data:/.test(url) && onDecode && onDecode())

  return new Promise((res) => {
    gltfLoader.load(
      base + `/public/${name}.gltf`,
      res,
      onProgress,
      onError,
    )
  })
}

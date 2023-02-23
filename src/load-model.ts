import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"



const base = import.meta.env.PROD
  ? "https://foretoo.github.io/narkomfin"
  : ""

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(base + "/dist/vendor/")
dracoLoader.setDecoderConfig({ type: "js" })

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export const loadModel = (
  onProgress?: Parameters<typeof gltfLoader.load>[2]
): Promise<GLTF> => {
  return new Promise((res) => {
    gltfLoader.load(
      base + "/public/narkom_compressed.gltf",
      res,
      onProgress,
    )
  })
}

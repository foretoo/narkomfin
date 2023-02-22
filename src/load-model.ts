import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"



const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("../public/")
dracoLoader.setDecoderConfig({ type: "js" })

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export const loadModel = (): Promise<GLTF> => {
  return new Promise((res) => {
    gltfLoader.load("../public/narkom_compressed.gltf", res)
  })
}

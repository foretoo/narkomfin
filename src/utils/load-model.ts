import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { LoadingManager } from "three"



const manager = new LoadingManager()



const unpkgDracoPath = "https://unpkg.com/three@0.149.0/examples/jsm/libs/draco/"
const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath(unpkgDracoPath)

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)



export const loadModel = (
  path: string,
  onProgress?: Parameters<typeof gltfLoader.load>[2],
  onError?: Parameters<typeof gltfLoader.load>[3],
  onDecode?: () => void,
): Promise<GLTF> => {

  manager.itemStart = (url) => void (/^data:/.test(url) && onDecode && onDecode())

  return new Promise((res) => {
    gltfLoader.load(
      path,
      res,
      onProgress,
      onError,
    )
  })
}

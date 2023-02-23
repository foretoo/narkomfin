import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { LoadingManager } from "three"



const base = import.meta.env.PROD
? "https://foretoo.github.io/narkomfin"
: ""

let _onDecode: (() => void) | undefined
const manager = new LoadingManager()
manager.itemStart = (url) => {
  if (/^data:/.test(url)) {
    _onDecode && _onDecode()
  }
}

const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath(base + "/dist/vendor/")
dracoLoader.setDecoderConfig({ type: "js" })

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

export const loadModel = (
  onProgress?: Parameters<typeof gltfLoader.load>[2],
  onError?: Parameters<typeof gltfLoader.load>[3],
  onDecode?: () => void,
): Promise<GLTF> => {
  _onDecode = onDecode
  return new Promise((res) => {
    gltfLoader.load(
      base + "/public/narkom_compressed.gltf",
      res,
      onProgress,
      onError,
    )
  })
}

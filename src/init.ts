import { ACESFilmicToneMapping, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



export const scene = new Scene()

export const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)

export const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.outputEncoding = sRGBEncoding
renderer.toneMapping = ACESFilmicToneMapping
document.querySelector(".canvas-container")!.append(renderer.domElement)

export const controls = new OrbitControls(camera, renderer.domElement)

onresize = () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

export const progressLabel = document.querySelector(".progress-label") as HTMLDivElement
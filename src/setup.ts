import { ACESFilmicToneMapping, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BG } from "@const"



export const progressLabel = document.querySelector(".progress-label") as HTMLDivElement

export const setup = (canvas: HTMLCanvasElement) => {
  const scene = new Scene()
  scene.background = new Color(BG)

  const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)

  const renderer = new WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const controls = new OrbitControls(camera, canvas)

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })

  return {
    scene,
    camera,
    renderer,
    controls,
  }
}
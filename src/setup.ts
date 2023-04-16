import { ACESFilmicToneMapping, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three"
import { BG } from "@const"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



export const setup = () => {
  const scene = new Scene()
  scene.background = new Color(BG)

  const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const cameraPivot = new PerspectiveCamera()

  const controls = new OrbitControls(cameraPivot, renderer.domElement)
  controls.enablePan = false
  controls.minDistance = 5
  controls.maxDistance = 11
  controls.minPolarAngle = Math.PI * 0.05
  controls.maxPolarAngle = Math.PI * 0.45

  cameraPivot.position.set(5, 3, 9).multiplyScalar(1 / camera.aspect)
  cameraPivot.add(camera)
  scene.add(cameraPivot)

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    cameraPivot.position.set(5, 3, 9).multiplyScalar(1 / camera.aspect)
    renderer.setSize(innerWidth, innerHeight)
  })

  return {
    scene,
    camera,
    cameraPivot,
    renderer,
    controls,
  }
}
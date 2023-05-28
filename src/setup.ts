import { getInitCameraPos, MAX_DISTANCE } from "@const"
import { IBokehPass } from "./types"
import { ACESFilmicToneMapping, PCFSoftShadowMap, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from "three"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { OrbitControls } from "./libs/OrbitControls"


let
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  renderPass: RenderPass,
  bokehPass: IBokehPass,
  composer: EffectComposer,
  cameraPivot: PerspectiveCamera,
  controls: OrbitControls,
  noThreeError = false

try {
  scene = new Scene()

  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)

  renderer = new WebGLRenderer({ antialias: true })

  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.type = PCFSoftShadowMap

  renderer.domElement.style.cursor = "grab"
  renderer.domElement.addEventListener("pointerdown", () => {
    renderer.domElement.style.cursor = "grabbing"
  })
  renderer.domElement.addEventListener("pointerup", () => {
    renderer.domElement.style.cursor = "grab"
  })

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })

  renderPass = new RenderPass(scene, camera)
  bokehPass = new BokehPass(scene, camera, {
    focus: 4.0,
    aperture: 0.002,
    maxblur: 0.01,
  }) as IBokehPass

  composer = new EffectComposer(renderer)

  cameraPivot = new PerspectiveCamera()

  controls = new OrbitControls(cameraPivot, renderer.domElement)

  controls.enablePan = false
  controls.maxDistance = MAX_DISTANCE
  controls.minPolarAngle = Math.PI * 0.05
  controls.maxPolarAngle = Math.PI * 0.49

  cameraPivot.position.copy(getInitCameraPos())
  controls.update()
  cameraPivot.add(camera)
  scene.add(cameraPivot)

  controls.addEventListener("change", () => {
    camera.lookAt(controls.target)
  })
}
catch {
  noThreeError = true
}

export {
  scene,
  camera,
  renderer,
  renderPass,
  bokehPass,
  composer,
  cameraPivot,
  controls,
  noThreeError,
}
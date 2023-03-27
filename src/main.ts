import { DirectionalLight, HemisphereLight, PerspectiveCamera, Vector2 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { MODEL_LENGTH, STATUS } from "@const"
import { loadModel, onEasedPointerMove } from "@utils"
import { setup, progressLabel } from "./setup"
import { traverseModel } from "./traverse-model_1"



export const init = (canvas: HTMLCanvasElement) => {

  ////////
  //////// HOUSE MODEL

  loadModel(
    "narkom_compressed1",
    (e) => { progressLabel.textContent = STATUS.LOADING + ` ${e.loaded / MODEL_LENGTH * 100 | 0}%` },
    ( ) => { progressLabel.textContent = STATUS.ERROR },
    ( ) => { progressLabel.textContent = STATUS.DECODING },
  ).then((gltf) => {
    progressLabel.style.display = "none"
    scene.add(traverseModel(gltf))
  })

  const { scene, camera, renderer } = setup(canvas)



  ////////
  //////// CAMERA PIVOT

  const cameraPivot = new PerspectiveCamera()

  const controls = new OrbitControls(cameraPivot, canvas)

  cameraPivot.position.set(1, 3, 6)
  cameraPivot.add(camera)
  scene.add(cameraPivot)

  onEasedPointerMove((pointer) => {
    camera.position.x = -pointer.x
    camera.position.y = -pointer.y
    camera.lookAt(scene.position)
  }, 5)



  ////////
  //////// LIGHT & SHADOW

  const ambientLight = new HemisphereLight(0x997755, 0x557799, 0.5)
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, 0.75)
  directLight.position.set(2, 3, 4)
  directLight.castShadow = true
  directLight.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(4)
  directLight.shadow.camera.far = directLight.position.length() + cameraPivot.position.length() + 4.5
  directLight.shadow.bias = -0.001
  cameraPivot.add(directLight)

  // const directCamera = new CameraHelper(directLight.shadow.camera)
  // scene.add(directCamera)



  ////////
  //////// POSTPROCESSING

  const renderPass = new RenderPass(scene, camera)
  const bokehPass = new BokehPass(scene, camera, {
    focus: 4.0,
    aperture: 0.002,
    maxblur: 0.005,
  })

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  // composer.addPass(bokehPass)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    controls.update()
    composer.render()
  })
}
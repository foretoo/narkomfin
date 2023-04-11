import { DirectionalLight, HemisphereLight, PerspectiveCamera, Vector2 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
// import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { MODEL_LENGTH, STATUS } from "@const"
import { loadModel, onEasedPointerMove } from "@utils"
import { setup } from "./setup"
import { traverseModel } from "./traverse-model_2"
import { IInitProps } from "./types"



const init = ({
  container,
  modelPath,
}: IInitProps) => {

  const progressLabel = container.querySelector(".narkomfin-progress-label")
  const { scene, camera, renderer } = setup()



  ////////
  //////// HOUSE MODEL

  loadModel(
    modelPath,
    (e) => { progressLabel && (progressLabel.textContent = STATUS.LOADING + ` ${e.loaded / MODEL_LENGTH * 100 | 0}%`) },
    ( ) => { progressLabel && (progressLabel.textContent = STATUS.ERROR) },
    ( ) => { progressLabel && (progressLabel.textContent = STATUS.DECODING) },
  ).then((gltf) => {
    progressLabel
      ? container.replaceChild(renderer.domElement, progressLabel)
      : container.appendChild(renderer.domElement)

    scene.add(traverseModel(gltf))
  })



  ////////
  //////// CAMERA PIVOT

  const cameraPivot = new PerspectiveCamera()

  const controls = new OrbitControls(cameraPivot, renderer.domElement)
  controls.enablePan = false
  controls.minDistance = 5
  controls.maxDistance = 10
  controls.minPolarAngle = Math.PI * 0.05
  controls.maxPolarAngle = Math.PI * 0.45

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
  cameraPivot.add(directLight)

  // const directCamera = new CameraHelper(directLight.shadow.camera)
  // scene.add(directCamera)



  ////////
  //////// POSTPROCESSING

  // const renderPass = new RenderPass(scene, camera)
  // const bokehPass = new BokehPass(scene, camera, {
  //   focus: 4.0,
  //   aperture: 0.002,
  //   maxblur: 0.005,
  // })

  // const composer = new EffectComposer(renderer)
  // composer.addPass(renderPass)
  // composer.addPass(bokehPass)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    controls.update()
    renderer.render(scene, camera)
  })
}

export default init
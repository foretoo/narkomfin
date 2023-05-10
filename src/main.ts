import { Color, DirectionalLight, HemisphereLight, Vector2 } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { BG, BG_DARK, MODEL_LENGTH, STATUS } from "@const"
import { loadModel } from "@utils"
import { setup } from "./setup"
import { onEasedPointerMove, setDarkThemeSwitcher, setZoomBorders } from "./features"
import { traverseModel } from "./traverse-model"
import { IHouse, IBokehPass, IInitProps } from "./types"
import { setCafeCameraAnimation } from "./features"



const init = async ({
  container,
  modelPath,
  texturePath,
  onProgress = () => {},
  dark = false,
}: IInitProps) => {

  const { scene, camera, cameraPivot, renderer, controls } = setup()

  scene.background = new Color(dark ? BG_DARK : BG)
  renderer.shadowMap.enabled = !dark



  ////////
  //////// HOUSE MODEL

  let narkomfin: IHouse

  await loadModel(
    modelPath,
    texturePath,
    (e) => onProgress(STATUS.LOADING, e.loaded / MODEL_LENGTH * 80 | 0),
    undefined,
    ( ) => onProgress(STATUS.LOADING, 85),
  )
    .then((data) => {
      narkomfin = traverseModel(data, dark)
      onProgress(STATUS.DONE)
      container.appendChild(renderer.domElement)
      scene.add(narkomfin)
    })



  ////////
  //////// LIGHT & SHADOW

  const ambientLight = new HemisphereLight(0x997755, 0x557799, dark ? 0.033 : 0.5)
  ambientLight.name = "ambientLight"
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, dark ? 0.06 : 0.75)
  directLight.name = "directLight"
  directLight.position.set(2, 3, 4)
  directLight.castShadow = true
  directLight.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(4)
  directLight.shadow.camera.far = directLight.position.length() + cameraPivot.position.length() + 4.5
  cameraPivot.add(directLight)

  // const directCamera = new CameraHelper(directLight.shadow.camera)
  // scene.add(directCamera)



  ////////
  //////// POSTPROCESSING

  const renderPass = new RenderPass(scene, camera)
  const bokehPass = new BokehPass(scene, camera, {
    focus: 4.0,
    aperture: 0.002,
    maxblur: 0.01,
  }) as IBokehPass

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  dark && composer.addPass(bokehPass)



  ////////
  //////// FEATURES

  const toggleBorders = setZoomBorders(controls)

  onEasedPointerMove((pointer) => {
    camera.position.x = -pointer.x
    camera.position.y = -pointer.y
    camera.lookAt(controls.target)
  }, 5)

  const toggleCafe = setCafeCameraAnimation(
    scene,
    controls,
    toggleBorders,
    bokehPass,
  )

  const toggleDark = setDarkThemeSwitcher(
    dark,
    scene,
    composer,
    bokehPass,
  )



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    composer.render()
  })



  return { toggleDark, toggleCafe }
}

export default init
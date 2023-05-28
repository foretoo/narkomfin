import { AmbientLight, Color, DirectionalLight, Vector2 } from "three"

import { MAX_DISTANCE, STATUS } from "@const"
import { loadModel } from "@utils"
import { IHouse, IInitProps } from "./types"

import { bokehPass, camera, cameraPivot, composer, controls, renderPass, renderer, scene } from "./setup"
import { easedPointer, switchBg, cameraTweener, setThemeSwitcher, toggleZoomBorder } from "./features"
import { traverseModel } from "./traverse-model"




const init = async ({
  container,
  path,
  onProgress = () => {},
  dark = false,
  BG = "#E1E1DF",
  BG_DARK = "#1E1E1E",
}: IInitProps) => {

  scene.background = new Color(dark ? BG_DARK : BG)
  renderer.shadowMap.enabled = !dark



  ////////
  //////// HOUSE MODEL

  let narkomfin: IHouse

  await loadModel(
    path,
    (n) => onProgress(STATUS.LOADING, n * 80 | 0),
    (e) => {  },
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

  const ambientLight = new AmbientLight(0x997755, 0.5)
  ambientLight.name = "ambientLight"
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, dark ? 0.3 : 0.75)
  directLight.name = "directLight"
  directLight.position.set(2, 3, 4)
  directLight.castShadow = true
  directLight.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(4)
  directLight.shadow.camera.far = directLight.position.length() + MAX_DISTANCE + 4.5
  cameraPivot.add(directLight)

  // const directCamera = new CameraHelper(directLight.shadow.camera)
  // scene.add(directCamera)



  ////////
  //////// POSTPROCESSING

  composer.addPass(renderPass)
  dark && composer.addPass(bokehPass)



  ////////
  //////// FEATURES

  toggleZoomBorder(true)



  const easedPointerHandler = (pointer: { x: number, y: number }) => {
    const d = cameraPivot.position.distanceTo(controls.target) / MAX_DISTANCE * 2
    camera.position.x = -pointer.x * d
    camera.position.y = -pointer.y * d
    camera.lookAt(controls.target)
  }
  easedPointer.subscribe(easedPointerHandler)



  const bokeh = bokehPass.uniforms.focus
  cameraTweener.subscribe((type, t) => {
    easedPointerHandler(easedPointer)

    if (t === 0) {
      toggleZoomBorder(false)
      controls.minDistance = 0
      controls.maxDistance = Infinity
      controls.minAzimuthAngle = controls.maxAzimuthAngle = Infinity
    }
    else if (t === 1) {
      if (type === "cafe") {
        controls.minDistance = 1.75
        controls.maxDistance = 5
        controls.minAzimuthAngle = -Math.PI * 0.8
        controls.maxAzimuthAngle =  Math.PI * 0.55
      }
      else if (type === "roof") {
        controls.minDistance = 1.75
        controls.maxDistance = 5
      }
      else { // type === "init"
        toggleZoomBorder(true) // handle controls.minDistance
        controls.maxDistance = MAX_DISTANCE
      }
    }

    if (/cafe|roof/.test(type) && bokeh.value === 4) {
      bokeh.value = 4 - t
    }
    else if (type === "init" && bokeh.value === 3) {
      bokeh.value = 3 + t
    }
  })



  const toggleDark = setThemeSwitcher(BG, BG_DARK, dark)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    composer.render()
  })



  return { toggleDark, tweenCamera: cameraTweener.tween, switchBg }
}

export default init
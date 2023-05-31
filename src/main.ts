import { bokehPass, camera, cameraPivot, composer, controls, renderer, scene, noThreeError } from "./setup"

import { MAX_DISTANCE, STATUS } from "@const"
import { IHouse, IInitProps } from "./types"

import { loadModel } from "./load-model"
import { traverseModel } from "./traverse-model"
import { easedPointer, switchBg, cameraTweener, setThemeSwitcher, toggleZoomBorder, errorHandler, toggleDarkErrored, TCamAnimType, TCamAnimTransition, currTheme, setCameraPosOnInit } from "./features"

import { AmbientLight, Color, DirectionalLight, Vector2 } from "three"
import { mix } from "./utils/mix"



const init = async ({
  container,
  path,
  onProgress = () => {},
  cameraType = "init",
  dark = false,
  BG = "#E1E1DF",
  BG_DARK = "#1E1E1E",
}: IInitProps) => {

  if (window.location.search === "?error") {
    errorHandler({ container, path, onProgress, dark, BG, BG_DARK })
    return { toggleDark: toggleDarkErrored, noThreeError: true }
  }

  // error from ./setup
  if (noThreeError) {
    errorHandler({ container, path, onProgress, dark, BG, BG_DARK })
    return { toggleDark: toggleDarkErrored, noThreeError }
  }

  scene.background = new Color(dark ? BG_DARK : BG)
  renderer.shadowMap.enabled = !dark
  setCameraPosOnInit(cameraType)



  ////////
  //////// HOUSE MODEL

  let narkomfin: IHouse
  let onLoadError = false

  await loadModel(
    path,
    (n) => onProgress(STATUS.LOADING, n * 80 | 0),
    ( ) => { },
    ( ) => onProgress(STATUS.LOADING, 85),
  )
    .then((data) => {
      narkomfin = traverseModel(data, dark)
      onProgress(STATUS.DONE)
      container.appendChild(renderer.domElement)
      scene.add(narkomfin)
    })
    .catch((path: string) => {
      onLoadError = true
      console.error("Cant find image by src: " + path)
    })

  if (onLoadError) {
    errorHandler({ container, path, onProgress, dark, BG, BG_DARK })
    return { toggleDark: toggleDarkErrored, noThreeError }
  }

  if (dark) bokehPass.enabled = true



  ////////
  //////// LIGHT & SHADOW

  const ambientLight = new AmbientLight(0xbb9977, dark ? 1.8 : 0.333)
  ambientLight.name = "ambientLight"
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, dark ? 0 : 0.75)
  directLight.name = "directLight"
  directLight.position.set(2, 3, 4)
  directLight.castShadow = true
  directLight.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(4)
  directLight.shadow.camera.far = directLight.position.length() + MAX_DISTANCE + 4.5
  cameraPivot.add(directLight)

  // const directCamera = new CameraHelper(directLight.shadow.camera)
  // scene.add(directCamera)



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



  const bokehFocus = bokehPass.uniforms.focus
  const bokehAperture = bokehPass.uniforms.aperture
  const bokehBlur = bokehPass.uniforms.maxblur

  const bokehFocusMap = {
    init: [ 5, 0, 0 ], // [ bokehFocus, bokehBlur, bokehAperture ]
    cafe: [ 3, 0.01, 0.005 ],
    roof: [ 2, 0.02, 0.003 ],
  }
  let tween: TCamAnimTransition

  cameraTweener.subscribe((type, t) => {
    easedPointerHandler(easedPointer)

    // onStart
    if (t === 0) {

      ({ tween } = cameraPivot.userData)

      toggleZoomBorder(false)
      controls.minDistance = 0
      controls.maxDistance = Infinity
      controls.minAzimuthAngle = controls.maxAzimuthAngle = Infinity
    }
    // onEnd
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

    // onUpdate

    bokehFocus.value = mix(
      bokehFocusMap[tween.substring(0, 4) as TCamAnimType][0],
      bokehFocusMap[tween.substring(5) as TCamAnimType][0],
      t,
    )
    bokehBlur.value = mix(
      bokehFocusMap[tween.substring(0, 4) as TCamAnimType][1],
      bokehFocusMap[tween.substring(5) as TCamAnimType][1],
      t,
    )
    bokehAperture.value = mix(
      bokehFocusMap[tween.substring(0, 4) as TCamAnimType][2],
      bokehFocusMap[tween.substring(5) as TCamAnimType][2],
      t,
    )
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
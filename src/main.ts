import { AmbientLight, BufferGeometry, Color, DirectionalLight, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial, SphereGeometry, Vector2, Vector3 } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { MAX_DISTANCE, STATUS } from "@const"
import { loadModel } from "@utils"
import { setup } from "./setup"
import { easedPointer, setBgSwitcher, setDarkThemeSwitcher, setZoomBorders } from "./features"
import { traverseModel } from "./traverse-model"
import { IHouse, IBokehPass, IInitProps } from "./types"
import { setCameraAnimation } from "./features"



const init = async ({
  container,
  modelPath,
  texturePath,
  onProgress = () => {},
  dark = false,
  BG = "#E1E1DF",
  BG_DARK = "#1E1E1E",
}: IInitProps) => {

  const { scene, camera, cameraPivot, renderer, controls } = setup()

  scene.background = new Color(dark ? BG_DARK : BG)
  // renderer.shadowMap.enabled = !dark



  ////////
  //////// HOUSE MODEL

  let narkomfin: IHouse

  await loadModel(
    modelPath,
    texturePath,
    (e) => onProgress(STATUS.LOADING, e.loaded / e.total * 80 | 0),
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

  const ambientLight = new AmbientLight(0x997755, 0.5)
  ambientLight.name = "ambientLight"
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, dark ? 0.06 : 0.75)
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

  const renderPass = new RenderPass(scene, camera)
  const bokehPass = new BokehPass(scene, camera, {
    focus: 4.0,
    aperture: 0.002,
    maxblur: 0.01,
  }) as IBokehPass

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  // dark && composer.addPass(bokehPass)



  ////////
  //////// FEATURES

  const toggleBorders = setZoomBorders(controls)

  const pointerToCameraHandler = (pointer: Vector2) => {
    const d = cameraPivot.position.distanceTo(controls.target) / MAX_DISTANCE * 2
    camera.position.x = -pointer.x * d
    camera.position.y = -pointer.y * d
    camera.lookAt(controls.target)
  }
  easedPointer.subscribe(pointerToCameraHandler)

  const animateCameraTo = setCameraAnimation(
    scene,
    controls,
    toggleBorders,
    pointerToCameraHandler,
    bokehPass,
  )

  const toggleDark = setDarkThemeSwitcher(
    BG,
    BG_DARK,
    dark,
    scene,
    composer,
    bokehPass,
  )

  const switchBg = setBgSwitcher(scene)



  ////////
  //////// TEMP

  const red = new Color(0xff0000)

  const cafeRadius = 2
  const cafeCircle = new LineLoop(
    new BufferGeometry().setFromPoints(Array(32).fill(null).map((_, i, a) => {
      const angle = i / a.length * Math.PI * 2
      return new Vector3(Math.cos(angle) * cafeRadius, 0, Math.sin(angle) * cafeRadius)
    })),
    new LineBasicMaterial({ color: red }),
  )
  cafeCircle.position.set(-3, 0.8, 1)
  scene.add(cafeCircle)
  const cafeTarget = new Mesh(
    new SphereGeometry(0.2), new MeshBasicMaterial({ color: red }),
  )
  cafeTarget.position.set(-3, 0, 1)
  scene.add(cafeTarget)



  const roofRadius = 2.5

  const roofCircle = new LineLoop(
    new BufferGeometry().setFromPoints(Array(32).fill(null).map((_, i, a) => {
      const angle = i / a.length * Math.PI * 2
      return new Vector3(Math.cos(angle) * roofRadius, 0, Math.sin(angle) * roofRadius)
    })),
    new LineBasicMaterial({ color: red }),
  )
  roofCircle.position.set(-1, 1.5, -0.7)
  scene.add(roofCircle)

  const roofTarget = new Mesh(
    new SphereGeometry(0.2), new MeshBasicMaterial({ color: red }),
  )
  roofTarget.position.set(-1, 0.8, -0.7)
  scene.add(roofTarget)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    composer.render()
  })



  return { toggleDark, animateCameraTo, switchBg }
}

export default init
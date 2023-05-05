import { BufferGeometry, Color, DirectionalLight, Group, HemisphereLight, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, QuadraticBezierCurve3, SphereGeometry, Vector2, Vector3 } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { BG, BG_DARK, MODEL_LENGTH, STATUS } from "@const"
import { clamp, loadModel } from "@utils"
import { setup } from "./setup"
import { onEasedPointerMove, setDarkThemeSwitcher, setZoomBorders } from "./features"
import { traverseModel } from "./traverse-model"
import { IHouse, IBokehPass, IInitProps } from "./types"
import { setCafeCameraAnimation } from "./features"



const PI = Math.PI
const PI2 = PI / 2
const TAU = PI * 2



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
    (e) => onProgress(STATUS.LOADING, e.loaded / MODEL_LENGTH * 100 | 0),
    undefined,
    ( ) => onProgress(STATUS.DECODING),
  )
    .then((gltf) => traverseModel(gltf, dark, texturePath))
    .then((textured_gltf) => {
      narkomfin = textured_gltf
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
  // directLight.castShadow = true
  // directLight.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(4)
  // directLight.shadow.camera.far = directLight.position.length() + cameraPivot.position.length() + 4.5
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

  // controls.addEventListener("change", () => {
  // console.log(controls.getPolarAngle())
  // console.log(controls.getAzimuthalAngle())
  // console.log(cameraPivot.position)
  // })

  // scene.add(curveMesh)
  // scene.add(curveHelper)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop((time) => {
    // setCurve(time * 0.0003)
    // controls.update()
    composer.render()
  })



  return { toggleDark, toggleCafe }
}

export default init




const r = 4

const phi = Math.PI // (Math.random() - 0.5) * Math.PI * 2
const phi_ = -phi + PI2
const theta = PI2

const startPos = new Vector3(
  r * Math.cos(phi_) * Math.sin(theta),
  r * Math.cos(theta) * 0.5,
  r * Math.sin(phi_) * Math.sin(theta),
)

const handler = new Vector3()

const endPos = new Vector3(-0.5, 1, 2.5)

const curve = new QuadraticBezierCurve3(startPos, handler, endPos)

const curveMesh = new Line(
  new BufferGeometry(),
  new LineBasicMaterial(),
)
const points = curve.getPoints(32)
curveMesh.geometry.setFromPoints(points)

const curveHelper = new Group()
for (let i = 0; i < 3; i++) {
  const s = new Mesh(
    new SphereGeometry(0.1),
    new MeshBasicMaterial({ color: i === 0 ? 0xffffff : i === 1 ? 0xff0000 : 0x000000 }),
  )
  s.position.copy(curve[`v${i as 0 | 1 | 2}`])
  curveHelper.add(s)
}
curveHelper.add(new Mesh(
  new SphereGeometry(0.1),
  new MeshBasicMaterial({ color: 0xffff00 }),
))



const setCurve = (time: number) => {
  const __p = (phi + time * 2) % TAU
  const _p = __p > PI ? -TAU + __p : __p
  const p = -_p + PI2

  startPos.set(
    r * Math.cos(p) * Math.sin(theta),
    r * Math.cos(theta) * 0.5,
    r * Math.sin(p) * Math.sin(theta),
  )

  const d = curve.v0.distanceTo(curve.v2) / 11 // MAX DISTANCE
  const t = clamp(theta - PI * 0.3, 0, PI * 0.2) / (PI * 0.2) // if theta 0.3-0.5
  const f = _p < -1 ? 1 : _p > 1.4 ? 1 : 0 // if phi behind building
  let a = (_p < -1 && _p > -2.5) ? (1.5 - _p - 2.5) / 1.5 : 0 // if phi behind cafe
  a = a ? 1 - (a - 0.5) * (a - 0.5) / 0.5 ** 2 : 0

  curve.v1.x = (curve.v0.x * 2 + curve.v2.x) / 3
  curve.v1.y = (curve.v0.y * 2 + curve.v2.y) / 3
  curve.v1.z = (curve.v0.z * 2 + curve.v2.z) / 3
  a && curve.v1.add(
    new Vector3()
      .subVectors(curve.v2, curve.v0)
      .normalize()
      .multiplyScalar(1 + a * (2 - d) * 3)
      .applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2),
  )
  curve.v1.y = (curve.v0.y * 2 + curve.v2.y) / 3 + d + t * f * 2

  const points = curve.getPoints(32)
  curveMesh.geometry.setFromPoints(points)

  for (let i = 0; i < 3; i++) {
    curveHelper.children[i].position.copy(curve[`v${i as 0 | 1 | 2}`])
  }
}
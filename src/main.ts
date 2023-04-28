import { BufferGeometry, Color, CubicBezierCurve3, DirectionalLight, HemisphereLight, IUniform, Mesh, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { BG, BG_DARK, MODEL_LENGTH, STATUS } from "@const"
import { clamp, loadModel, onEasedPointerMove, setZoomBorders } from "@utils"
import { setup } from "./setup"
import { traverseModel } from "./traverse-model_3"
import { House, IInitProps } from "./types"



const init = ({
  container,
  modelPath,
  texturePath,
  onProgress = () => {},
  dark = false,
}: IInitProps) => {

  const { scene, camera, cameraPivot, renderer, controls } = setup()

  scene.background = new Color(dark ? BG_DARK : BG)
  renderer.shadowMap.enabled = !dark

  const currentTarget = scene.position.clone()

  const toggleBorders = setZoomBorders(controls, currentTarget)

  onEasedPointerMove((pointer) => {
    camera.position.x = -pointer.x
    camera.position.y = -pointer.y
    camera.lookAt(currentTarget)
  }, 5)



  let animating = false
  let cafe = false
  const cafeTarget = new Vector3(-3, 0, 1)
  const duration = 1500

  const toggleCafe = (mode: boolean) => {
    if (cafe === mode || animating) return
    animating = true
    cafe = mode

    cafe && toggleBorders(false)
    controls.enableZoom = !cafe

    const newCameraPos = cafe ? new Vector3(-0.5, 1, 2.5) : new Vector3(5, 3, 9).multiplyScalar(1 / camera.aspect)
    const newTargetPos = cafe ? cafeTarget : scene.position.clone()
    const cameraHand = newCameraPos.clone()
      .add(new Vector3().subVectors(newCameraPos, newTargetPos))
      .normalize()
      .multiplyScalar(0.5)

    const curve = new CubicBezierCurve3(
      cameraPivot.position,
      cameraPivot.position.clone().normalize().multiplyScalar(-0.5).add(cameraPivot.position),
      cameraHand,
      newCameraPos,
    )

    const start = performance.now()

    requestAnimationFrame(function animate() {
      const now = performance.now()
      let t = clamp((now - start) / duration, 0, 1)
      t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      curve.getPointAt(t, cameraPivot.position)
      currentTarget.copy(cafeTarget).multiplyScalar(cafe ? t : 1 - t)
      controls.target.copy(currentTarget)
      camera.lookAt(currentTarget)

      bokehPass.uniforms.focus.value = cafe ? 4 - t : 3 + t

      if (t === 1) {
        animating = false
        !cafe && toggleBorders(true)
        controls.minAzimuthAngle = cafe ? -Math.PI * 0.8 : Infinity
        controls.maxAzimuthAngle = cafe ?  Math.PI * 0.6 : Infinity
      }
      else requestAnimationFrame(animate)
    })
  }



  ////////
  //////// HOUSE MODEL

  let narkomfin: House

  loadModel(
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
  scene.add(ambientLight)

  const directLight = new DirectionalLight(0xffffff, dark ? 0.06 : 0.75)
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
    maxblur: 0.005,
  }) as BokehPass & { uniforms: { focus: IUniform<number> }}

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  dark && composer.addPass(bokehPass)



  ////////
  //////// RENDERING

  renderer.setAnimationLoop(() => {
    controls.update()
    composer.render()
  })



  const toggleDark = (force?: boolean) => {
    dark = force ?? !dark

    const glass = narkomfin.getObjectByName("glass") as Mesh<BufferGeometry, MeshStandardMaterial>

    if (dark) {
      glass.material.emissiveIntensity = 1
      narkomfin.traverse((obj) => {
        obj.receiveShadow = false
        obj.castShadow = false
      })
      ambientLight.intensity = 0.05
      directLight.intensity = 0.07
      directLight.castShadow = false
      scene.background = new Color(BG_DARK)
      composer.addPass(bokehPass)
    }
    else {
      glass.material.emissiveIntensity = 0
      narkomfin.traverse((obj) => {
        obj.receiveShadow = true
        obj.castShadow = true
      })
      ambientLight.intensity = 0.5
      directLight.intensity = 0.75
      directLight.castShadow = true
      scene.background = new Color(BG)
      composer.removePass(bokehPass)
    }
  }

  return { toggleDark, toggleCafe }
}

export default init
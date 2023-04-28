import { BufferGeometry, Color, DirectionalLight, HemisphereLight, Mesh, MeshStandardMaterial, Object3D, Raycaster, Vector2 } from "three"
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
// import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"

import { BG, BG_DARK, MODEL_LENGTH, STATUS } from "@const"
import { loadModel, onEasedPointerMove } from "@utils"
import { setup } from "./setup"
import { traverseModel } from "./traverse-model_2"
import { House, IInitProps } from "./types"
import { border } from "./border"



const init = ({
  container,
  modelPath,
  onProgress = () => {},
  dark = false,
}: IInitProps) => {

  const { scene, camera, cameraPivot, renderer, controls } = setup()

  scene.background = new Color(dark ? BG_DARK : BG)
  renderer.shadowMap.enabled = !dark



  ////////
  //////// HOUSE MODEL

  let narkomfin: House

  loadModel(
    modelPath,
    (e) => onProgress(STATUS.LOADING, e.loaded / MODEL_LENGTH * 100 | 0),
    undefined,
    ( ) => onProgress(STATUS.DECODING),
  ).then((gltf) => {
    onProgress(STATUS.DONE)
    container.appendChild(renderer.domElement)
    narkomfin = traverseModel(gltf, dark)
    scene.add(narkomfin)
  })

  const raycaster = new Raycaster()
  const gizmo = new Object3D()

  controls.addEventListener("change", () => {
    cameraPivot.getWorldPosition(gizmo.position)
    gizmo.position.y = 0
    gizmo.position.normalize().multiplyScalar(20)

    raycaster.set(gizmo.position, gizmo.position.clone().normalize().multiplyScalar(-1))
    const intersect = raycaster.intersectObject(border)

    gizmo.position.set(intersect[0].point.x, 0, intersect[0].point.z)
    controls.minDistance = gizmo.position.length()

    camera.lookAt(scene.position)
  })



  ////////
  //////// CAMERA ON POINTER MOVE

  onEasedPointerMove((pointer) => {
    camera.position.x = -pointer.x
    camera.position.y = -pointer.y
    camera.lookAt(scene.position)
  }, 5)



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



  const toggleDark = (force?: boolean) => {
    dark = force ?? !dark

    const glass = narkomfin.getObjectByName("glass") as Mesh<BufferGeometry, MeshStandardMaterial>

    if (dark) {
      glass.material.emissiveIntensity = 1
      narkomfin.traverse((obj) => {
        obj.receiveShadow = false
        obj.castShadow = false
      })
      ambientLight.intensity = 0.033
      directLight.intensity = 0.06
      directLight.castShadow = false
      scene.background = new Color(BG_DARK)
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
    }
  }

  return toggleDark
}

export default init
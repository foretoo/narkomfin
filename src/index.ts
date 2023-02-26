import { Camera, CameraHelper, DirectionalLight, DoubleSide, Group, HemisphereLight, Mesh, MeshStandardMaterial, Vector2 } from "three"
import { MODEL_LENGTH, STATUS } from "const"
import { camera, controls, progressLabel, renderer, scene } from "init"
import { onEasedPointerMove } from "utils"
import { loadModel } from "./load-model"
import { House, HouseInnerMesh } from "./types"



const cameraPivot = new Camera()
controls.object = cameraPivot
cameraPivot.position.set(1, 3, 6)
cameraPivot.add(camera)
scene.add(cameraPivot)

onEasedPointerMove((pointer) => {
  camera.position.x = -pointer.x
  camera.position.y = -pointer.y
  camera.lookAt(scene.position)
}, 5)



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



loadModel(
  (e) => { progressLabel.textContent = STATUS.LOADING + ` ${e.loaded/MODEL_LENGTH*100|0}%` },
  () => { progressLabel.textContent = STATUS.ERROR },
  () => { progressLabel.textContent = STATUS.DECODING },
).then((gltf) => {
  progressLabel.style.display = "none"

  const model = gltf.scene
  const scale = Array(3).fill(0.000075) as [number, number, number]

  const group = new Group() as House
  group.frustumCulled = false
  const metalMaterial = new MeshStandardMaterial({ color: 0x444444, metalness: 0.8 })
  const floorMaterial = new MeshStandardMaterial({ color: 0x444444, side: DoubleSide })

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return

    const clone = object.clone() as HouseInnerMesh
    clone.geometry.scale(...scale)
    clone.castShadow = true
    clone.receiveShadow = true

    switch (clone.name) {
      case "floor001":
      case "floor":
        clone.material = floorMaterial
        break
      case "columns":
      case "metal":
        clone.material = metalMaterial
        break
      case "walls":
        clone.material = new MeshStandardMaterial({ color: 0x888888 })
        break
      case "doors":
        clone.material = new MeshStandardMaterial({ color: 0xcccccc })
        break
      case "borders":
        clone.material = new MeshStandardMaterial({ color: 0x222222 })
        break
      case "glass":
        clone.material = new MeshStandardMaterial({ color: 0xaaccee, metalness: 0.6 })
        break
    }

    group.add(clone)
  })

  const floor = model.getObjectByName("floor001") as HouseInnerMesh
  const pivot = floor.geometry.boundingSphere.center.multiplyScalar(-1)
  group.children.forEach((mesh) => void mesh.position.copy(pivot))

  scene.add(group)
})



renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})

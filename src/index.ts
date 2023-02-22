import { BufferGeometry, CameraHelper, Color, DirectionalLight, DoubleSide, Group, HemisphereLight, Mesh, MeshStandardMaterial, PCFSoftShadowMap, Vector2 } from "three"
import { camera, controls, renderer, scene } from "init"
import { getModel } from "./get-model"



camera.position.set(0, 2, 5)
scene.add(camera)
scene.background = new Color(0x444444)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const ambient = new HemisphereLight(0x997755, 0x557799, 0.25)
scene.add(ambient)

const direct = new DirectionalLight(0xffffff, 0.75)
{
  direct.position.set(2, 6, 4)
  direct.castShadow = true
  direct.shadow.mapSize = new Vector2(1024, 1024).multiplyScalar(2)
  const distance = direct.position.length() + camera.position.length() - 1
  direct.shadow.camera.near = distance - 4.5
  direct.shadow.camera.far = distance + 4.5
  direct.shadow.bias = -0.001
}
camera.add(direct)

// const directCamera = new CameraHelper(direct.shadow.camera)
// scene.add(directCamera)



getModel().then((gltf) => {
  const model = gltf.scene
  const scale = Array(3).fill(0.000075) as [number, number, number]

  const group = new Group()
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return

    const clone = object.clone() as Mesh<BufferGeometry, MeshStandardMaterial>
    clone.geometry.scale(...scale)
    clone.castShadow = true
    clone.receiveShadow = true

    switch (clone.name) {
      case "floor":
      case "floor001": {
        clone.material = new MeshStandardMaterial({ color: 0x444444, side: DoubleSide })
        clone.name === "floor001" && group.position.copy(clone.geometry.boundingSphere!.center!).multiplyScalar(-1)
        break
      }
      case "columns":
      case "metal": {
        clone.material = new MeshStandardMaterial({ color: 0x444444, metalness: 0.8 })
        break
      }
      case "walls": {
        clone.material = new MeshStandardMaterial({ color: 0x888888 })
        break
      }
      case "doors": {
        clone.material = new MeshStandardMaterial({ color: 0xcccccc })
        break
      }
      case "borders": {
        clone.material = new MeshStandardMaterial({ color: 0x222222 })
        break
      }
      case "glass": {
        clone.material = new MeshStandardMaterial({ color: 0xaaccee, metalness: 0.6 })
        break
      }
    }

    group.add(clone)
  })
  scene.add(group)
})




renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
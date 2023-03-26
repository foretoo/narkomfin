import { DoubleSide, Group, Mesh, MeshStandardMaterial } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { House, HouseInnerMesh } from "./types"

export const traverseModel = (
  gltf: GLTF,
) => {
  const model = gltf.scene
  const scale = Array(3).fill(0.000075) as [number, number, number]

  const group = new Group() as House

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return

    const clone = object.clone() as HouseInnerMesh
    clone.geometry.scale(...scale)
    clone.castShadow = true
    clone.receiveShadow = true
    clone.frustumCulled = false

    switch (clone.name) {
    case "floor001":
    case "floor":
      clone.material = new MeshStandardMaterial({ color: 0x444444, side: DoubleSide })
      break
    case "columns":
    case "metal":
      clone.material = new MeshStandardMaterial({ color: 0x444444, metalness: 0.8 })
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

  return group
}
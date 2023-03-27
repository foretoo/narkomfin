import { Group, Mesh, MeshStandardMaterial } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { House, HouseInnerMesh } from "./types"

const material = new MeshStandardMaterial()

export const traverseModel = (
  gltf: GLTF,
) => {
  const model = gltf.scene
  const scale = Array(3).fill(0.075) as [number, number, number]
  const group = new Group() as House

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return

    const clone = object.clone() as HouseInnerMesh
    clone.geometry.scale(...scale)
    clone.castShadow = true
    clone.receiveShadow = true
    clone.frustumCulled = false

    clone.material = material

    group.add(clone)
  })

  return group
}
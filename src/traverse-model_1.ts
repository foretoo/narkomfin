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
    clone.castShadow = /^base$/.test(clone.name) ? false : true
    clone.receiveShadow = true
    clone.frustumCulled = false

    clone.material = material

    switch (clone.name) {
      case "walls":
      case "floors":
        clone.material = new MeshStandardMaterial({ color: 0xdddddd })
        break
      case "doors":
      case "base":
      case "glass":
        clone.material = new MeshStandardMaterial({ color: 0x888888 })
        break
      case "plants":
      case "lounger":
      case "yard":
      case "base002":
      case "thing":
        clone.material = new MeshStandardMaterial({ color: 0x555555 })
        break
      case "columns":
      case "borders":
      case "metal":
        clone.material = new MeshStandardMaterial({ color: 0x333333 })
        break
    }

    group.add(clone)
  })

  return group
}

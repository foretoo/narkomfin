import { Group, Mesh, MeshStandardMaterial } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { House, HouseInnerMesh } from "./types"



export const traverseModel = (
  gltf: GLTF,
  dark: boolean,
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

    switch (clone.name) {
      case "glass":
        clone.material = new MeshStandardMaterial({
          color: 0x888888,
          emissive: 0xffeedd,
          emissiveIntensity: dark ? 1 : 0,
          metalness: 0.666,
        })
        break
      case "walls":
        clone.material = new MeshStandardMaterial({ color: 0xdddddd })
        break
      case "doors":
      case "base":
        clone.material = new MeshStandardMaterial({ color: 0x888888 })
        break
      case "tree":
      case "terrain":
      case "lounger":
      case "sidewalk":
      case "vent":
      case "pole":
        clone.material = new MeshStandardMaterial({ color: 0x555555 })
        break
      case "borders":
      case "metal":
        clone.material = new MeshStandardMaterial({ color: 0x333333 })
        break
    }

    group.add(clone)
    group.position.y = -1.5
  })

  return group
}
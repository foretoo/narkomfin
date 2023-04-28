import { Color, Group, Mesh, MeshStandardMaterial, TextureLoader } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { House, HouseInnerMesh } from "./types"



const loader = new TextureLoader()

const material111 = new MeshStandardMaterial({ color: 0x111111 })

const N = 10
let i = 0



export const traverseModel = async (
  gltf: GLTF,
  dark: boolean,
): Promise<House> => {
  const model = gltf.scene
  const scale = Array(3).fill(0.075) as [number, number, number]
  const group = new Group() as House
  group.position.y = -1.5

  return await new Promise((res) => {
    model.traverse((object) => {
      if (!(object instanceof Mesh)) return

      const clone = object.clone() as HouseInnerMesh
      clone.geometry.scale(...scale)
      clone.castShadow = /binding|terrain/.test(clone.name) ? false : true
      clone.receiveShadow = true
      clone.frustumCulled = false

      if (clone.name === "binding") {
        i++
        clone.material = new MeshStandardMaterial({ color: 0x282522 })
      }

      else if (clone.name === "glass") {
        i++
        clone.material = new MeshStandardMaterial({
          color: 0x888888,
          emissive: 0xffeedd,
          emissiveIntensity: dark ? 1 : 0,
          metalness: 0.666,
        })
      }

      else if (/borders|columns|metal_and_loungers/.test(clone.name)) {
        i++
        clone.material = material111
      }

      else {
        clone.material = new MeshStandardMaterial()
        loader.load(`../public/${clone.name}.png`, (texture) => {
          i++
          texture.flipY = false
          clone.material.map = texture
          clone.material.needsUpdate = true

          if (i === N) res(group)
        })
      }

      group.add(clone)
    })
  })
}

import { BufferGeometry, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, TextureLoader } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

import { IHouse, IHouseInnerMesh } from "./types"



const loader = new TextureLoader()

const material111 = new MeshStandardMaterial({ color: 0x111111 })

const N = 9 // number of geometries of the model
let i = 0



export const traverseModel = async (
  gltf: GLTF,
  dark: boolean,
  texturePath: string,
): Promise<IHouse> => {

  const model = gltf.scene
  const scale = Array(3).fill(0.075) as [number, number, number]
  const house = new Group() as IHouse
  house.position.y = -1.5
  house.name = "narkomfin"

  await new Promise((res) => {
    model.traverse((object) => {
      if (!(object instanceof Mesh)) return

      const clone = object.clone() as IHouseInnerMesh
      clone.geometry.scale(...scale)
      clone.castShadow = /terrain/.test(clone.name) ? false : true
      clone.receiveShadow = true
      clone.frustumCulled = false

      if (/metal/.test(clone.name)) {
        i++
        clone.material = material111
        house.add(clone)
      }

      else if (/^glass/.test(clone.name)) {
        i++
        clone.material = new MeshStandardMaterial({
          color: 0x888888,
          emissive: 0xffeedd,
          emissiveIntensity: dark ? 1 : 0,
          metalness: 1,
          roughness: 0,
          envMapIntensity: 2,
        })
        house.add(clone)
      }

      else if (/com_glass/.test(clone.name)) {
        i++
        clone.material = new MeshStandardMaterial({
          color: 0x888888,
          emissive: 0xffeedd,
          emissiveIntensity: dark ? 1 : 0,
          metalness: 1,
          roughness: 0,
          envMapIntensity: 2,
          transparent: true,
          opacity: 0.5,
        })
        house.add(clone)
      }

      else {
        clone.material = new MeshStandardMaterial()
        loader.load(`${texturePath}${clone.name}.png`, (texture) => {
          i++
          texture.flipY = false
          clone.material.map = texture
          clone.material.needsUpdate = true

          house.add(clone)
          i === N && res(null)
        })
      }
    })
  })

  await new Promise((res) => {
    new RGBELoader().load(`${texturePath}env.hdr`, (texture) => {
      texture.mapping = EquirectangularReflectionMapping
      const glass = house.getObjectByName("glass") as Mesh<BufferGeometry, MeshStandardMaterial>
      const com_glass = house.getObjectByName("com_glass") as Mesh<BufferGeometry, MeshStandardMaterial>
      glass.material.envMap = com_glass.material.envMap = texture
      res(null)
    })
  })

  return house
}

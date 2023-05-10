import { DataTexture, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, Texture } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

import { IFetchedData, IHouse, IHouseInnerMesh } from "./types"
import { pngs } from "@const"



const material111 = new MeshStandardMaterial({ color: 0x111111 })



export const traverseModel = (
  data: IFetchedData,
  dark: boolean,
): IHouse => {

  const model = (data.shift() as GLTF).scene

  const envMap = data.pop() as DataTexture
  envMap.mapping = EquirectangularReflectionMapping

  const textures = Object.fromEntries(pngs.map((name, i) => {
    (data[i] as Texture).flipY = false
    return  [ name, data[i] ]
  })) as { [name: string]: Texture }



  const scale = Array(3).fill(0.075) as [number, number, number]
  const house = new Group() as IHouse
  house.position.y = -1.5
  house.name = "narkomfin"

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return

    const clone = object.clone() as IHouseInnerMesh
    clone.geometry.scale(...scale)
    clone.castShadow = /terrain/.test(clone.name) ? false : true
    clone.receiveShadow = true
    clone.frustumCulled = false

    if (/metal/.test(clone.name)) {
      clone.material = material111
    }

    else if (/^glass/.test(clone.name)) {
      clone.material = new MeshStandardMaterial({
        color: 0x888888,
        emissive: 0xffeedd,
        emissiveIntensity: dark ? 1 : 0,
        metalness: 1,
        roughness: 0,
        envMap,
        envMapIntensity: 2,
      })
    }

    else if (/com_glass/.test(clone.name)) {
      clone.material = new MeshStandardMaterial({
        color: 0x888888,
        emissive: 0xffeedd,
        emissiveIntensity: dark ? 1 : 0,
        metalness: 1,
        roughness: 0,
        envMap,
        envMapIntensity: 2,
        transparent: true,
        opacity: 0.5,
      })
    }

    else {
      clone.material = new MeshStandardMaterial()
      clone.material.map = textures[clone.name]
      clone.material.needsUpdate = true
    }

    house.add(clone)
  })

  return house
}

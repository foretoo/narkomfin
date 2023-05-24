import { Color, DataTexture, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, Texture } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

import { IFetchedData, IHouse, IHouseInnerMesh } from "./types"
import { pngs } from "@const"



const material111 = new MeshStandardMaterial({ color: 0x111111 })

type texturesObject = { [name: string]: { lightTexture: Texture, darkTexture: Texture }}



export const traverseModel = (
  data: IFetchedData,
  dark: boolean,
): IHouse => {

  const model = (data.pop() as GLTF).scene

  const envMap = data.pop() as DataTexture
  envMap.mapping = EquirectangularReflectionMapping

  const bulbsTexture = data.pop() as Texture
  bulbsTexture.flipY = false

  const glassTexture = data.pop() as Texture
  glassTexture.flipY = false

  const textures = Object.fromEntries(pngs.map((name, i) => {
    const lightTexture = data[i] as Texture
    const darkTexture = data[i + pngs.length] as Texture
    lightTexture.flipY = false
    darkTexture.flipY = false
    return  [ name, { lightTexture, darkTexture }]
  })) as texturesObject



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



    if (/non-material/.test(clone.name)) {
      clone.material = material111
    }

    else if (/glass/.test(clone.name)) {
      clone.material = new MeshStandardMaterial({
        color: 0x888888,
        metalness: 1,
        roughness: 0,
        envMap: envMap,
        envMapIntensity: dark ? 0 : 2,
      })
      if (/com_glass/.test(clone.name)) {
        clone.material.transparent = true
        clone.material.opacity = dark ? 0 : 0.5
      }
      else {
        clone.material.emissive = new Color(0xffcc88)
        clone.material.emissiveMap = glassTexture
        clone.material.emissiveIntensity = dark ? 1 : 0
        emissive(clone.material)
      }
    }

    else if (/bulbs/.test(clone.name)) {
      house.userData.bulbs = clone
      clone.material = new MeshStandardMaterial({
        emissiveMap: bulbsTexture,
        emissive: 0xffffff,
      })
    }

    else {
      clone.material = new MeshStandardMaterial()
      clone.material.map = textures[clone.name][dark ? "darkTexture" : "lightTexture"]
      clone.userData.lightTexture = textures[clone.name].lightTexture
      clone.userData.darkTexture = textures[clone.name].darkTexture
      clone.material.needsUpdate = true
    }



    house.add(clone)

    if (!dark && /bulbs/.test(clone.name)) {
      house.remove(clone)
    }
  })

  return house
}



function emissive(
  material: MeshStandardMaterial,
) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `
      vec4 emissiveColor = texture2D(emissiveMap, vUv);
      totalEmissiveRadiance *= emissiveColor.rgb;
      float steppedEmissive = step(0.2, length(totalEmissiveRadiance) * 0.57735);
      totalEmissiveRadiance *= (steppedEmissive + 0.5) * 0.666667;
      `,
    )
  }
}
import { Color, DirectionalLight } from "three"
import { pngs } from "@const"
import type { IHouse, IHouseInnerMesh } from "../types"
import { bokehPass, composer, scene } from "../setup"



export const setThemeSwitcher = (
  BG: string,
  BG_DARK: string,
  dark: boolean,
) => {

  const narkomfin = scene.getObjectByName("narkomfin") as IHouse
  const directLight = scene.getObjectByName("directLight") as DirectionalLight
  const glass = narkomfin.getObjectByName("glass") as IHouseInnerMesh
  const com_glass = narkomfin.getObjectByName("com_glass") as IHouseInnerMesh
  const bulbs = narkomfin.userData.bulbs

  return (force?: boolean) => {
    dark = force ?? !dark

    if (dark) {
      glass.material.emissiveIntensity = 1
      glass.material.envMapIntensity = 0

      com_glass.material.envMapIntensity = 0
      com_glass.material.opacity = 0

      narkomfin.traverse((obj) => {
        obj.receiveShadow = false
        obj.castShadow = false
        if (pngs.some((name) => name === obj.name)) {
          obj.material.map = obj.userData.darkTexture
        }
      })
      narkomfin.add(bulbs)

      directLight.intensity = 0.3
      directLight.castShadow = false

      scene.background = new Color(BG_DARK)
      composer.addPass(bokehPass)
    }
    else {
      glass.material.emissiveIntensity = 0
      glass.material.envMapIntensity = 2

      com_glass.material.envMapIntensity = 1
      com_glass.material.opacity = 0.5

      narkomfin.traverse((obj) => {
        obj.receiveShadow = true
        obj.castShadow = true
        if (pngs.some((name) => name === obj.name)) {
          obj.material.map = obj.userData.lightTexture
        }
      })
      narkomfin.remove(bulbs)

      directLight.intensity = 0.75
      directLight.castShadow = true

      scene.background = new Color(BG)
      composer.removePass(bokehPass)
    }
  }
}
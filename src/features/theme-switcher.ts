import { AmbientLight, Color, DirectionalLight } from "three"
import { pngs } from "@const"
import type { IHouse, IHouseInnerMesh } from "../types"
import { bokehPass, scene } from "../setup"



export const currTheme = { dark: false }

export const setThemeSwitcher = (
  BG: string,
  BG_DARK: string,
  dark: boolean,
) => {

  const narkomfin = scene.getObjectByName("narkomfin") as IHouse
  const ambientLight = scene.getObjectByName("ambientLight") as AmbientLight
  const directLight = scene.getObjectByName("directLight") as DirectionalLight
  const glass = narkomfin.getObjectByName("glass") as IHouseInnerMesh
  const com_glass = narkomfin.getObjectByName("com_glass") as IHouseInnerMesh
  const bulbs = narkomfin.userData.bulbs

  return (force?: boolean) => {
    dark = force ?? !dark
    currTheme.dark = dark

    if (dark) {
      glass.material.emissiveIntensity = 1.5
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

      ambientLight.intensity = 1.8
      directLight.intensity = 0
      directLight.castShadow = false

      bokehPass.enabled = true
      scene.background = new Color(BG_DARK)
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

      ambientLight.intensity = 0.333
      directLight.intensity = 0.75
      directLight.castShadow = true

      bokehPass.enabled = false
      scene.background = new Color(BG)
    }
  }
}
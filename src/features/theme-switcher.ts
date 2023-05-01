import { BufferGeometry, Color, DirectionalLight, HemisphereLight, Mesh, MeshStandardMaterial, Scene } from "three"
import { IHouse, IBokehPass } from "src/types"
import { BG, BG_DARK } from "@const"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"



export const setDarkThemeSwitcher = (
  dark: boolean,
  scene: Scene,
  composer: EffectComposer,
  bokehPass: IBokehPass,
) => {
  const narkomfin = scene.getObjectByName("narkomfin") as IHouse
  const ambientLight = scene.getObjectByName("ambientLight") as HemisphereLight
  const directLight = scene.getObjectByName("directLight") as DirectionalLight

  return (force?: boolean) => {
    dark = force ?? !dark

    const glass = narkomfin.getObjectByName("glass") as Mesh<BufferGeometry, MeshStandardMaterial>

    if (dark) {
      glass.material.emissiveIntensity = 1
      narkomfin.traverse((obj) => {
        obj.receiveShadow = false
        obj.castShadow = false
      })
      ambientLight.intensity = 0.2
      directLight.intensity = 0.2
      directLight.castShadow = false
      scene.background = new Color(BG_DARK)
      composer.addPass(bokehPass)
    }
    else {
      glass.material.emissiveIntensity = 0
      narkomfin.traverse((obj) => {
        obj.receiveShadow = true
        obj.castShadow = true
      })
      ambientLight.intensity = 0.5
      directLight.intensity = 0.75
      directLight.castShadow = true
      scene.background = new Color(BG)
      composer.removePass(bokehPass)
    }
  }
}
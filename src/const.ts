import { Spherical, Vector3 } from "three"



export const pngs = [
  "balconies", "interior", "floors", "walls", "trees", "terrain",
] as const

export const STATUS = {
  LOADING: "LOADING",
  DONE: "DONE",
  ERROR: "ERROR",
}

export const bokehFocusMap = {
  init: [ 5, 0, 0 ], // [ bokehFocus, bokehBlur, bokehAperture ]
  cafe: [ 3, 0.01, 0.003 ],
  roof: [ 2, 0.02, 0.003 ],
} as const

export const ambientLightIntensity = [ 1, 1.8 ] // light, dark
export const directLightIntensity = [ 1, 0 ]



export const MAX_DISTANCE = 15

const cameraPos = new Vector3()
const cameraSpheriacal = new Spherical()

cameraSpheriacal.phi = Math.PI * (0.4 + 0.03 * innerHeight / innerWidth)

const getCameraSpherical = () => {
  const aspect = innerHeight / innerWidth
  cameraSpheriacal.radius = 7
  cameraSpheriacal.theta = aspect * 0.62

  return cameraSpheriacal
}

export const getInitCameraPos = () => cameraPos.setFromSpherical(getCameraSpherical())
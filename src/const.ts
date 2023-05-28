import { Spherical, Vector3 } from "three"



export const pngs = [
  "balconies", "interior", "floors", "walls", "trees", "terrain",
] as const

export const STATUS = {
  LOADING: "LOADING",
  DONE: "DONE",
  ERROR: "ERROR",
}



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
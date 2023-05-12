import { Spherical, Vector3 } from "three"
import { clamp } from "./utils"



export const pngs = [
  "balconies", "interior", "floors", "walls", "trees", "terrain",
] as const

export const STATUS = {
  LOADING: "LOADING",
  DONE: "DONE",
}

export const MODEL_LENGTH = 1281669



export const MAX_DISTANCE = 11

const cameraPos = new Vector3()
const cameraSpheriacal = new Spherical()
cameraSpheriacal.phi = Math.PI * 0.4

const getCameraSpherical = () => {
  const aspect = innerHeight / innerWidth
  cameraSpheriacal.radius = Math.min(Math.sqrt(clamp(aspect, 0.5, 2)) * 10, MAX_DISTANCE)
  cameraSpheriacal.theta = aspect * 0.62

  return cameraSpheriacal
}

export const getInitCameraPos = () => cameraPos.setFromSpherical(getCameraSpherical())
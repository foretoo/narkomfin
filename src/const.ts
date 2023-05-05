import { Vector3 } from "three"



export const STATUS = {
  LOADING: "LOADING",
  DECODING: "DECODING",
  ERROR: "ERROR",
  DONE: "DONE",
}

export const MODEL_LENGTH = 1134066

export const BG = "#E1E1DF" // getComputedStyle(document.body).backgroundColor
export const BG_DARK = "#1E1E1E"

export const getInitCameraPos = () => new Vector3(5, 3, 9).multiplyScalar(innerHeight / innerWidth)
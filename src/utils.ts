import { Object3D } from "three"



export const rotateOnPointerMove = (
  model: Object3D,
  scale: number,
) => {
  onpointermove = (e) => {
    model.rotation.y = (e.clientX / innerWidth  - 0.5) * scale
    model.rotation.x = (e.clientY / innerHeight - 0.5) * scale
  }
}
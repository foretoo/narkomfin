import { CubicBezierCurve3, PerspectiveCamera, Scene, Vector3 } from "three"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { setZoomBorders } from "./zoom-border"
import { clamp } from "@utils"
import { IBokehPass } from "src/types"



let animating = false
let cafe = false
const cafeTarget = new Vector3(-3, 0, 1)
const duration = 1500

export const setCafeCameraAnimation = (
  scene: Scene,
  controls: OrbitControls,
  toggleBorders: ReturnType<typeof setZoomBorders>,
  bokehPass: IBokehPass,
) => {

  const cameraPivot = controls.object
  const camera = cameraPivot.children[0] as PerspectiveCamera
  const target = controls.target

  return (mode: boolean) => {
    if (cafe === mode || animating) return
    animating = true
    cafe = mode

    cafe && toggleBorders(false)
    controls.enableZoom = !cafe

    const newCameraPos = cafe ? new Vector3(-0.5, 1, 2.5) : new Vector3(5, 3, 9).multiplyScalar(1 / camera.aspect)
    const newTargetPos = cafe ? cafeTarget : scene.position.clone()
    const cameraHand = newCameraPos.clone()
      .add(new Vector3().subVectors(newCameraPos, newTargetPos))
      .normalize()
      .multiplyScalar(0.5)

    const curve = new CubicBezierCurve3(
      cameraPivot.position,
      cameraPivot.position.clone().normalize().multiplyScalar(-0.5).add(cameraPivot.position),
      cameraHand,
      newCameraPos,
    )

    const start = performance.now()

    requestAnimationFrame(function animate() {
      const now = performance.now()
      let t = clamp((now - start) / duration, 0, 1)
      t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      curve.getPointAt(t, cameraPivot.position)
      target.copy(cafeTarget).multiplyScalar(cafe ? t : 1 - t)
      controls.target.copy(target)
      camera.lookAt(target)

      bokehPass.uniforms.focus.value = cafe ? 4 - t : 3 + t

      if (t === 1) {
        animating = false
        !cafe && toggleBorders(true)
        controls.minAzimuthAngle = cafe ? -Math.PI * 0.8 : Infinity
        controls.maxAzimuthAngle = cafe ?  Math.PI * 0.6 : Infinity
      }
      else requestAnimationFrame(animate)
    })
  }
}
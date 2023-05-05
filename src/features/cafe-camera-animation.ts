import { CubicBezierCurve3, PerspectiveCamera, QuadraticBezierCurve3, Scene, Vector3 } from "three"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { setZoomBorders } from "./zoom-border"
import { clamp } from "@utils"
import { IBokehPass } from "src/types"
import { getInitCameraPos } from "@const"



let animating = false
let cafe = false
const cafeTarget = new Vector3(-3, 0, 1)
const cafeCameraPos = new Vector3(-0.5, 1, 2.5)
const duration = 1500

const PI = Math.PI



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
    controls.enabled = false

    const newCameraPos = cafe
      ? cafeCameraPos
      : getInitCameraPos()

    const newTargetPos = cafe
      ? cafeTarget
      : scene.position

    const newDistance = newCameraPos.distanceTo(newTargetPos)
    const curDistance = cameraPivot.position.distanceTo(target)
    const difDistance = newDistance - curDistance

    const curve = new QuadraticBezierCurve3(
      cameraPivot.position,
      new Vector3(),
      newCameraPos,
    )

    const theta = controls.getPolarAngle()
    const phi = controls.getAzimuthalAngle()



    const d = curve.v0.distanceTo(curve.v2) / 11 // MAX DISTANCE
    const t = clamp(theta - PI * 0.3, 0, PI * 0.2) / (PI * 0.2) // if theta 0.3-0.5
    const f = phi < -1 ? 1 : phi > 1.4 ? 1 : 0 // if phi behind building
    let a = (phi < -1 && phi > -2.5) ? (1.5 - phi - 2.5) / 1.5 : 0 // if phi behind cafe
    a = a ? 1 - (a - 0.5) * (a - 0.5) / 0.5 ** 2 : 0 // make a -> from 0-1 to 0-1-0

    curve.v1.x = (curve.v0.x * 2 + curve.v2.x) / 3
    curve.v1.y = (curve.v0.y * 2 + curve.v2.y) / 3
    curve.v1.z = (curve.v0.z * 2 + curve.v2.z) / 3
    a && curve.v1.add(
      new Vector3()
        .subVectors(curve.v2, curve.v0)
        .normalize()
        .multiplyScalar(1 + a * (2 - d) * 3)
        .applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2),
    )
    curve.v1.y = (curve.v0.y * 2 + curve.v2.y) / 3 + d + t * f * 2

    const start = performance.now()



    requestAnimationFrame(function animate() {
      const now = performance.now()
      const t = clamp((now - start) / duration, 0, 1)
      const ct = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2

      curve.getPointAt(ct, cameraPivot.position)
      target.copy(cafeTarget).multiplyScalar(cafe ? ct : 1 - ct)
      controls.minDistance = controls.maxDistance = curDistance + difDistance * ct
      controls.update()
      camera.lookAt(controls.target)

      bokehPass.uniforms.focus.value = cafe ? 4 - t : 3 + t

      if (t === 1) {
        animating = false
        if (!cafe) {
          toggleBorders(true)
          controls.maxDistance = 11 // from setup (move to const)
        }
        controls.enabled = true
        controls.minAzimuthAngle = cafe ? -Math.PI * 0.8 : Infinity
        controls.maxAzimuthAngle = cafe ?  Math.PI * 0.55 : Infinity
      }
      else requestAnimationFrame(animate)
    })
  }
}

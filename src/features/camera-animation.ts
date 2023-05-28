import { BufferGeometry, Line, LineBasicMaterial, LineCurve3, Mesh, MeshBasicMaterial, PerspectiveCamera, QuadraticBezierCurve3, Scene, SphereGeometry, Vector2, Vector3 } from "three"
import type { OrbitControls } from "../libs/OrbitControls"
import { GUI } from "lil-gui"

import type { setZoomBorders } from "./zoom-border"
import { clamp } from "@utils"
import { IBokehPass } from "src/types"
import { MAX_DISTANCE, getInitCameraPos } from "@const"
import { easedPointer } from "./on-eased-pointer-move"



type TMode = "cafe" | "roof" | "init"

let animating = false
let _mode: TMode  = "init"
const PI = Math.PI



const cafeTarget = new Vector3(-3, 0, 1)
const cafeCircle = new Vector3(-3, 0.8, 1)
const cafeRadius = 2

const roofTarget = new Vector3(-1, 0.8, -0.7)
const roofCircle = new Vector3(-1, 1.5, -0.7)
const roofRadius = 2.5



const gui = new GUI({ container: document.body })

interface IEase {
  current: "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInCubic" | "easeOutCubic" | "easeInOutCubic"
  functions: { [K in IEase["current"]]: (x: number) => number }
}

const ease: IEase = {
  current: "easeInOutQuad",
  functions: {
    easeInQuad(x: number): number {
      return x * x
    },
    easeOutQuad(x: number): number {
      return 1 - (1 - x) * (1 - x)
    },
    easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
    },
    easeInCubic(x: number): number {
      return x * x * x
    },
    easeOutCubic(x: number): number {
      return 1 - Math.pow(1 - x, 3)
    },
    easeInOutCubic(x: number): number {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
    },
  },
}

gui.add(ease, "current", {
  easeInQuad: "easeInQuad",
  easeOutQuad: "easeOutQuad",
  easeInOutQuad: "easeInOutQuad",
  easeInCubic: "easeInCubic",
  easeOutCubic: "easeOutCubic",
  easeInOutCubic: "easeInOutCubic",
} as {
  [K in IEase["current"]]: K
}).name("easing function:")



export const setCameraAnimation = (
  scene: Scene,
  controls: OrbitControls,
  toggleBorders: ReturnType<typeof setZoomBorders>,
  pointerToCameraHandler: (pointer: Vector2) => void,
  bokehPass: IBokehPass,
) => {

  const cameraPivot = controls.object
  const target = controls.target

  return (mode: TMode) => {
    if (_mode === mode || animating) return
    animating = true
    _mode = mode

    if (/cafe|roof/.test(mode)) {
      toggleBorders(false)
      controls.minDistance = 0
      controls.maxDistance = Infinity
    }
    controls.enabled = false



    const startTargetPos = target.clone()
    const startSphericalRadius = cameraPivot.position.distanceTo(target)
    const { newCameraPos, newTargetPos } = getNewPosition(cameraPivot.position, mode)!
    const endSphericalRadius = newCameraPos.distanceTo(newTargetPos)
    const subSphericalRadius = endSphericalRadius - startSphericalRadius



    const cameraCurve = new QuadraticBezierCurve3(
      cameraPivot.position,
      new Vector3(),
      newCameraPos,
    )

    cameraCurve.v1.x = (cameraCurve.v0.x + cameraCurve.v2.x) / 2
    cameraCurve.v1.y = cameraCurve.v2.y
    cameraCurve.v1.z = (cameraCurve.v0.z + cameraCurve.v2.z) / 2

    cameraCurve.updateArcLengths()



    const duration = 1500



    const targetCurve = new LineCurve3(
      startTargetPos,
      newTargetPos,
    )



    const start = performance.now()

    function animate() {
      const now = performance.now()
      const t = clamp((now - start) / duration, 0, 1)
      const tt = ease.functions[ease.current](t) // eased t

      cameraCurve.getPointAt(tt, cameraPivot.position)
      targetCurve.getPointAt(tt, target)
      controls.spherical.radius = startSphericalRadius + subSphericalRadius * t
      controls.update()
      pointerToCameraHandler(easedPointer as unknown as Vector2)

      // bokehPass.uniforms.focus.value = cafe ? 4 - t : 3 + t

      if (t === 1) {
        animating = false

        if (mode === "init") {
          toggleBorders(true)
          controls.maxDistance = MAX_DISTANCE
          controls.minAzimuthAngle = controls.maxAzimuthAngle = Infinity
        }
        else if (mode === "cafe") {
          controls.minDistance = 1.75
          controls.maxDistance = 5
          controls.minAzimuthAngle = -Math.PI * 0.8
          controls.maxAzimuthAngle =  Math.PI * 0.55
        }

        controls.enabled = true
      }
      else setTimeout(animate, 0)
    }
    setTimeout(animate, 0)
  }
}



function getNewPosition(
  curCamPos: Vector3,
  mode: TMode,
) {
  const tempV = curCamPos.clone()

  if (mode === "cafe") {
    tempV.y = cafeCircle.y
    const subV = new Vector3().subVectors(cafeCircle, tempV)
    const length = subV.length() - cafeRadius
    subV.setLength(length)
    return {
      newCameraPos: subV.add(tempV),
      newTargetPos: cafeTarget,
    }
  }
  else if (mode === "roof") {}
  else {
    return {
      newCameraPos: getInitCameraPos(),
      newTargetPos: new Vector3(),
    }
  }
}

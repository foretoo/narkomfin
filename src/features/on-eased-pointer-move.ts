import { Vector2 } from "three"
import { sumAbs } from "../utils/sum-abs"



const listeners: ((easedPointer: Vector2) => void)[] = []

const seek = new Vector2()
const ease = new Vector2()

let easing = false
let lastTime = 0

let velocity = 5
let threshold = 3e-3



const easeMovement = () => {
  const currTime = performance.now()
  const dt = (currTime - lastTime) * 0.001 * velocity
  const dx = seek.x - ease.x
  const dy = seek.y - ease.y
  ease.x += dx * dt
  ease.y += dy * dt
  lastTime = currTime

  for (const listener of listeners) {
    listener(ease)
  }

  if (sumAbs(dx, dy) > threshold) requestAnimationFrame(easeMovement)
  else easing = false
}

addEventListener("pointermove", (e: PointerEvent) => {
  seek.x =  e.clientX / innerWidth  - 0.5
  seek.y = -e.clientY / innerHeight + 0.5

  if (easing) return
  easing = true
  lastTime = performance.now()
  requestAnimationFrame(easeMovement)
})



export const easedPointer = {
  get x() { return ease.x },
  get y() { return ease.y },

  subscribe(callback: (easedPointer: Vector2) => void) {
    listeners.push(callback)
  },
}
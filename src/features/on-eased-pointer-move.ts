import { Vector2 } from "three"
import { sumAbs } from "../utils/sum-abs"



export const onEasedPointerMove = (
  callback: (easedPointer: Vector2) => void,
  velocity = 1,
  threshold = 3e-3,
) => {

  const seekPointer = new Vector2()
  const easedPointer = new Vector2()
  let easing = false

  let lastTime = 0
  const easeMovement = () => {
    const currTime = performance.now()
    const dt = (currTime - lastTime) * 0.001 * velocity
    const dx = seekPointer.x - easedPointer.x
    const dy = seekPointer.y - easedPointer.y
    easedPointer.x += dx * dt
    easedPointer.y += dy * dt
    lastTime = currTime

    callback(easedPointer)

    if (sumAbs(dx, dy) > threshold) requestAnimationFrame(easeMovement)
    else easing = false
  }

  addEventListener("pointermove", (e: PointerEvent) => {
    seekPointer.x =  e.clientX / innerWidth  - 0.5
    seekPointer.y = -e.clientY / innerHeight + 0.5

    if (easing) return
    easing = true
    lastTime = performance.now()
    requestAnimationFrame(easeMovement)
  })
}
import { Vector2 } from "three"



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



const sumAbs = (...numbers: number[]) => {
  return numbers.reduce(
    (sum, number) => sum + Math.abs(number),
    Math.abs(numbers.pop() || 0)
  )
}



export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  waitTime: number,
  context?: unknown,
) => {
  let timeoutId: number
  let lastTime = 0

  return (...args: T) => {
    clearTimeout(timeoutId)
    const currTime = performance.now()
    const deltaTime = currTime - lastTime

    if (deltaTime >= waitTime) {
      lastTime = currTime
      fn.apply(context, args)
    } else {
      timeoutId = setTimeout(() => {
        lastTime = performance.now()
        fn.apply(context, args)
      }, waitTime - deltaTime)
    }
  }
}
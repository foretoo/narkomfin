import { BufferAttribute, BufferGeometry, CubicBezierCurve, CurvePath, LineCurve, Mesh, MeshBasicMaterial, Vector2 } from "three"



const curve = new CurvePath<Vector2>()

curve.add(new CubicBezierCurve(
  new Vector2(-3.0,  3.2),
  new Vector2(-1.0,  3.2),
  new Vector2(-2.0,  1.3),
  new Vector2( 1.0,  1.3),
))
curve.add(new CubicBezierCurve(
  new Vector2( 1.0,  1.3),
  new Vector2( 5.0,  1.3),
  new Vector2( 5.0,  0.0),
  new Vector2( 5.0, -0.8),
))
curve.add(new CubicBezierCurve(
  new Vector2( 5.0, -0.8),
  new Vector2( 5.0, -1.6),
  new Vector2( 5.0, -2.9),
  new Vector2( 1.0, -2.9),
))
curve.add(new LineCurve(
  new Vector2( 1.0, -2.9),
  new Vector2(-2.0, -2.9),
))
curve.add(new CubicBezierCurve(
  new Vector2(-2.0, -2.9),
  new Vector2(-4.0, -2.9),
  new Vector2(-5.0, -1.5),
  new Vector2(-5.0,  0.0),
))
curve.add(new CubicBezierCurve(
  new Vector2(-5.0,  0.0),
  new Vector2(-5.0,  1.5),
  new Vector2(-5.0,  3.2),
  new Vector2(-3.0,  3.2),
))



const points = curve.getPoints(12)

const attrPoints = points.reduce<number[]>((out, p, i, arr) => {
  const prev = i ? arr[i - 1] : arr[arr.length - 1]
  const tri1 = [ p.x, 0, p.y, p.x, 1, p.y, prev.x, 0, prev.y ]
  const tri2 = [ prev.x, 1, prev.y, prev.x, 0, prev.y, p.x, 1, p.y ]
  return out.concat(tri1.concat(tri2))
}, [])

const geometry = new BufferGeometry()
geometry.setAttribute("position", new BufferAttribute(new Float32Array(attrPoints), 3))

const material = new MeshBasicMaterial()
material.wireframe = true



export const border = new Mesh(geometry, material)
border.name = "border"

import { BufferAttribute, BufferGeometry, CubicBezierCurve, CurvePath, LineCurve, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



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

const attrPoints = new Float32Array(
  points.reduce<number[]>((out, p, i, arr) => {
    const prev = i ? arr[i - 1] : arr[arr.length - 1]
    const tri1 = [ p.x, 0, p.y, p.x, 1, p.y, prev.x, 0, prev.y ]
    const tri2 = [ prev.x, 1, prev.y, prev.x, 0, prev.y, p.x, 1, p.y ]
    return out.concat(tri1.concat(tri2))
  }, []),
)

const geometry = new BufferGeometry()
geometry.setAttribute("position", new BufferAttribute(attrPoints, 3))

const material = new MeshBasicMaterial()
material.wireframe = true



const zoomBorderMesh = new Mesh(geometry, material)



export const setZoomBorders = (
  controls: OrbitControls,
  scene: Scene,
) => {
  const raycaster = new Raycaster()
  const gizmo = new Object3D()

  controls.addEventListener("change", (e) => {
    const cameraPivot = (e.target as OrbitControls).object
    const camera = cameraPivot.children.find((obj) => obj instanceof PerspectiveCamera)!

    cameraPivot.getWorldPosition(gizmo.position)
    gizmo.position.y = 0
    gizmo.position.normalize().multiplyScalar(20)

    raycaster.set(gizmo.position, gizmo.position.clone().normalize().multiplyScalar(-1))
    const intersect = raycaster.intersectObject(zoomBorderMesh)

    gizmo.position.set(intersect[0].point.x, 0, intersect[0].point.z)
    controls.minDistance = gizmo.position.length()

    camera.lookAt(scene.position)
  })
}

import { camera, controls, renderer, scene } from "init"
import { DirectionalLight, DodecahedronGeometry, HemisphereLight, Mesh, MeshStandardMaterial } from "three"



const geometry = new DodecahedronGeometry()
const material = new MeshStandardMaterial()
const dode = new Mesh(geometry, material)
scene.add(dode)

const ambient = new HemisphereLight(0x997755, 0x557799, 0.5)
scene.add(ambient)

const direct = new DirectionalLight(0xffffff, 0.8)
direct.position.set(7,8,9)
scene.add(direct)



renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
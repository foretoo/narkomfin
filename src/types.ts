import { BufferGeometry, Group, Mesh, MeshStandardMaterial, Sphere } from "three"



export interface HouseInnerMesh extends Mesh {
  geometry: BufferGeometry & {
    boundingSphere: Sphere
  }
  material: MeshStandardMaterial
}

export interface House extends Group {
  children: HouseInnerMesh[]
  add(...object: HouseInnerMesh[]): this
}

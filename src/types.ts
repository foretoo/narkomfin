import type { BufferGeometry, Group, Mesh, MeshStandardMaterial, Sphere } from "three"



export interface IInitProps {
  container: HTMLDivElement
  modelPath: string
  onProgress?: (type: string, progress?: number) => void
  dark?: boolean
}



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

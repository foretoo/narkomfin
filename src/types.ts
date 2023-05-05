import type { BufferGeometry, Group, IUniform, Mesh, MeshStandardMaterial, Sphere } from "three"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"



export interface IInitProps {
  container: HTMLDivElement
  modelPath: string
  texturePath: string
  onProgress?: (type: string, progress?: number) => void
  dark?: boolean
}



export interface IHouseInnerMesh extends Mesh {
  geometry: BufferGeometry & {
    boundingSphere: Sphere
  }
  material: MeshStandardMaterial
}

export interface IHouse extends Group {
  children: IHouseInnerMesh[]
  add(...object: IHouseInnerMesh[]): this
}



export interface IBokehPass extends BokehPass {
  uniforms: {
    focus: IUniform<number>
    aperture: IUniform<number>
    maxblur: IUniform<number>
  }
}
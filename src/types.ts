import type { BufferGeometry, DataTexture, Group, IUniform, Mesh, MeshStandardMaterial, Sphere, Texture } from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import type { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"



export interface IInitProps {
  container: HTMLDivElement
  modelPath: string
  texturePath: string
  onProgress?: (type: string, progress?: number) => void
  dark?: boolean
}



export type IFetchedData = (GLTF | Texture | DataTexture)[]



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
  }
}
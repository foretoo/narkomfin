import type { BufferGeometry, DataTexture, Group, IUniform, Mesh, MeshStandardMaterial, Sphere, Texture } from "three"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import type { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"



export interface IInitProps {
  container: HTMLDivElement
  path: string
  onProgress?: (type: string, progress?: number) => void
  dark?: boolean
  BG: string
  BG_DARK: string
}



export type IFetchedData = (GLTF | Texture | DataTexture)[]



export interface IHouseInnerMesh extends Mesh {
  geometry: BufferGeometry & {
    boundingSphere: Sphere
  }
  material: MeshStandardMaterial
  userData: {
    lightTexture: Texture
    darkTexture: Texture
  }
}

export interface IHouse extends Group {
  children: IHouseInnerMesh[]
  add(...object: IHouseInnerMesh[]): this
  userData: {
    bulbs: IHouseInnerMesh
  }
  traverse: (callback: (obj: IHouseInnerMesh) => void) => void
}



export interface IBokehPass extends BokehPass {
  uniforms: {
    focus: IUniform<number>
  }
}

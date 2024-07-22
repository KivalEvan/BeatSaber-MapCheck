import type {
   IChromaComponent,
   IChromaEnvironment,
} from '../../../types/beatmap/v3/custom/chroma.ts';
import type { IChromaEnvironment as IV2ChromaEnvironment } from '../../../types/beatmap/v2/custom/chroma.ts';
import logger from '../../../logger.ts';
import { vectorMul } from '../../../utils/vector.ts';

function tag(name: string): string[] {
   return ['chroma', 'environment', name];
}

export function envV2ToV3(env: IV2ChromaEnvironment[]): IChromaEnvironment[] {
   return env.map((e) => {
      let components: IChromaComponent = {};
      if (e._lightID) components = { ILightWithId: { lightID: e._lightID } };
      if (e._id && e._lookupMethod) {
         return {
            id: e._id,
            lookupMethod: e._lookupMethod,
            track: e._track,
            duplicate: e._duplicate,
            active: e._active,
            scale: e._scale,
            position: vectorMul(e._position, 0.6),
            rotation: e._rotation,
            localPosition: vectorMul(e._localPosition, 0.6),
            localRotation: e._localRotation,
            components,
         };
      }
      if (e._geometry) {
         if (e._lightID && components.ILightWithId) {
            components.ILightWithId.type = 0;
         }
         return {
            geometry:
               e._geometry._type === 'CUSTOM'
                  ? {
                       type: e._geometry._type,
                       mesh: {
                          vertices: e._geometry._mesh._vertices,
                          uv: e._geometry._mesh._uv,
                          triangles: e._geometry._mesh._triangles,
                       },
                       material:
                          typeof e._geometry._material === 'string'
                             ? e._geometry._material
                             : {
                                  shader: e._geometry._material._shader,
                                  shaderKeywords: e._geometry._material._shaderKeywords,
                                  collision: e._geometry._material._collision,
                                  track: e._geometry._material._track,
                                  color: e._geometry._material._color,
                               },
                       collision: e._geometry._collision,
                    }
                  : {
                       type: e._geometry._type,
                       material:
                          typeof e._geometry._material === 'string'
                             ? e._geometry._material
                             : {
                                  shader: e._geometry._material._shader,
                                  shaderKeywords: e._geometry._material._shaderKeywords,
                                  collision: e._geometry._material._collision,
                                  track: e._geometry._material._track,
                                  color: e._geometry._material._color,
                               },
                       collision: e._geometry._collision,
                    },
            track: e._track,
            duplicate: e._duplicate,
            active: e._active,
            scale: e._scale,
            position: vectorMul(e._position, 0.6),
            rotation: e._rotation,
            localPosition: vectorMul(e._localPosition, 0.6),
            localRotation: e._localRotation,
            components,
         };
      }
      throw new Error('Error converting environment v2 to v3');
   });
}

export function envV3ToV2(env: IChromaEnvironment[]): IV2ChromaEnvironment[] {
   return env.map((e) => {
      if (e.id && e.lookupMethod) {
         return {
            _id: e.id,
            _lookupMethod: e.lookupMethod,
            _track: e.track,
            _duplicate: e.duplicate,
            _active: e.active,
            _scale: e.scale,
            _position: vectorMul(e.position, 1 / 0.6),
            _rotation: e.rotation,
            _localPosition: vectorMul(e.localPosition, 1 / 0.6),
            _localRotation: e.localRotation,
            _lightID: e.components?.ILightWithId?.lightID,
         };
      }
      if (e.geometry) {
         if (e.components?.ILightWithId?.type || e.components?.ILightWithId?.lightID) {
            logger.tWarn(
               tag('envV3ToV2'),
               'v2 geometry cannot be made assignable light to specific type',
            );
         }
         return {
            _geometry:
               e.geometry.type === 'CUSTOM'
                  ? {
                       _type: e.geometry.type,
                       _mesh: {
                          _vertices: e.geometry.mesh.vertices,
                          _uv: e.geometry.mesh.uv,
                          _triangles: e.geometry.mesh.triangles,
                       },
                       _material:
                          typeof e.geometry.material === 'string'
                             ? e.geometry.material
                             : {
                                  _shader: e.geometry.material.shader,
                                  _shaderKeywords: e.geometry.material.shaderKeywords,
                                  _collision: e.geometry.material.collision,
                                  _track: e.geometry.material.track,
                                  _color: e.geometry.material.color,
                               },
                       _collision: e.geometry.collision,
                    }
                  : {
                       _type: e.geometry.type,
                       _material:
                          typeof e.geometry.material === 'string'
                             ? e.geometry.material
                             : {
                                  _shader: e.geometry.material.shader,
                                  _shaderKeywords: e.geometry.material.shaderKeywords,
                                  _collision: e.geometry.material.collision,
                                  _track: e.geometry.material.track,
                                  _color: e.geometry.material.color,
                               },
                       _collision: e.geometry.collision,
                    },
            _track: e.track,
            _duplicate: e.duplicate,
            _active: e.active,
            _scale: e.scale,
            _position: vectorMul(e.position, 1 / 0.6),
            _rotation: e.rotation,
            _localPosition: vectorMul(e.localPosition, 1 / 0.6),
            _localRotation: e.localRotation,
            _lightID: e.components?.ILightWithId?.lightID,
         };
      }
      throw new Error('Error converting environment v3 to v2');
   });
}

import logger from '../../../logger.ts';
import { clamp } from '../../../utils/math.ts';
import type { ICustomDataNote } from '../../../types/beatmap/v3/custom/note.ts';
import type { ICustomDataObstacle } from '../../../types/beatmap/v3/custom/obstacle.ts';
import type { IChromaComponent, IChromaMaterial } from '../../../types/beatmap/v3/custom/chroma.ts';
import objectToV3 from '../customData/objectToV3.ts';
import eventToV3 from '../customData/eventToV3.ts';
import { isVector3, vectorMul } from '../../../utils/vector.ts';
import type { IWrapBeatmap } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { IWrapObstacle } from '../../../types/beatmap/wrapper/obstacle.ts';
import type { IWrapColorNote } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapBombNote } from '../../../types/beatmap/wrapper/bombNote.ts';

function tag(name: string): string[] {
   return ['convert', 'toV3Beatmap', name];
}

/**
 * Convert beatmap to beatmap v3, you are encouraged to convert to make full use of new beatmap features.
 * ```ts
 * const converted = convert.toV3Beatmap(data);
 * ```
 *
 * **WARNING:** Custom data may be lost on conversion, as well as other incompatible attributes.
 */
export function toV3Beatmap(data: IWrapBeatmap, fromVersion: number): IWrapBeatmap {
   logger.tWarn(tag('main'), 'Converting to beatmap v3 may lose certain data!');

   switch (fromVersion) {
      case 1:
         data.version = 3;
         fromV1(data);
         break;
      case 2:
         data.version = 3;
         fromV2(data);
         break;
      case 3:
      case 4:
         data.version = 3;
         break;
      default:
         logger.tWarn(
            tag('main'),
            'Unknown version: version not supported; misinput? Returning original data.',
         );
   }

   return data;
}

function fromV1(bm: IWrapBeatmap) {
   bm.colorNotes.forEach((n) => {
      if (n.direction >= 1000) {
         n.angleOffset = Math.abs(((n.direction % 1000) % 360) - 360);
         n.direction =
            n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
               ? n.direction === 8
                  ? 8
                  : 1
               : clamp(n.direction, 0, 8);
      }
   });

   bm.difficulty.customData.time = bm.difficulty.customData._time;
   bm.difficulty.customData.BPMChanges = bm.difficulty.customData._BPMChanges?.map((bpmc) => {
      return {
         b: bpmc._time,
         m: bpmc._bpm ?? bpmc._BPM,
         p: bpmc._beatsPerBar,
         o: bpmc._metronomeOffset,
      };
   });
   bm.difficulty.customData.bookmarks = bm.difficulty.customData._bookmarks?.map((b) => {
      return {
         b: b._time,
         n: b._name,
      };
   });
}

function fromV2(bm: IWrapBeatmap) {
   bm.difficulty.customData.fakeColorNotes = [];
   bm.difficulty.customData.fakeBombNotes = [];
   bm.difficulty.customData.fakeObstacles = [];

   const newNotes: IWrapColorNote[] = [];
   bm.colorNotes.forEach((n, i) => {
      const customData: ICustomDataNote = objectToV3(n.customData);
      if (typeof n.customData._cutDirection === 'number') {
         logger.tDebug(
            tag('fromV2'),
            `colorNotes[${i}] at time ${n.time} NE _cutDirection will be converted.`,
         );
      }
      let a = 0;
      if (typeof n.customData._cutDirection === 'number') {
         a =
            n.customData._cutDirection > 0
               ? n.customData._cutDirection % 360
               : 360 + (n.customData._cutDirection % 360);
      } else if (n.direction >= 1000) {
         a = Math.abs(((n.direction % 1000) % 360) - 360);
      }
      const d =
         n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
            ? n.direction === 8
               ? 8
               : 1
            : clamp(n.direction, 0, 8);
      if (n.customData._fake) {
         bm.difficulty.customData.fakeColorNotes!.push({
            b: n.time,
            c: n.color,
            x: n.posX,
            y: n.posY,
            d,
            a,
            customData,
         });
      } else {
         n.direction = d;
         n.angleOffset = a;
         n.customData = customData;
         newNotes.push(n);
      }
   });
   bm.colorNotes = newNotes;

   const newBombs: IWrapBombNote[] = [];
   bm.bombNotes.forEach((n, i) => {
      const customData: ICustomDataNote = objectToV3(n.customData);
      if (typeof n.customData._cutDirection === 'number') {
         logger.tDebug(
            tag('fromV2'),
            `bombNotes[${i}] at time ${n.time} NE _cutDirection will be converted.`,
         );
      }
      if (n.customData._fake) {
         bm.difficulty.customData.fakeBombNotes!.push({
            b: n.time,
            x: n.posX,
            y: n.posY,
            customData,
         });
      } else {
         n.customData = customData;
         bm.bombNotes.push(n);
      }
   });
   bm.bombNotes = newBombs;

   const newObst: IWrapObstacle[] = [];
   bm.obstacles.forEach((o) => {
      const customData: ICustomDataObstacle = objectToV3(o.customData);
      if (o.customData._fake) {
         bm.difficulty.customData.fakeObstacles!.push({
            b: o.time,
            x: o.posX,
            y: o.posY,
            d: o.duration,
            w: o.width,
            h: o.height,
            customData,
         });
      } else {
         o.customData = customData;
         newObst.push(o);
      }
   });
   bm.obstacles = newObst;

   bm.basicEvents.forEach((e, i) => {
      const customData = eventToV3(e.customData);
      if (e.isLightEvent()) {
         if (e.customData._propID) {
            logger.tWarn(
               tag('fromV2'),
               `events[${i}] at time ${e.time} Chroma _propID will be removed.`,
            );
         }
         if (e.customData._lightGradient) {
            logger.tWarn(
               tag('fromV2'),
               `events[${i}] at time ${e.time} Chroma _lightGradient will be removed.`,
            );
         }
      }
      if (e.isRingEvent()) {
         if (e.customData._reset) {
            logger.tWarn(
               tag('fromV2'),
               `events[${i}] at time ${e.time} Chroma _reset will be removed.`,
            );
         }
         if (e.customData._counterSpin) {
            logger.tWarn(
               tag('fromV2'),
               `events[${i}] at time ${e.time} Chroma _counterSpin will be removed.`,
            );
         }
         if (e.customData._stepMult || e.customData._propMult || e.customData._speedMult) {
            logger.tWarn(
               tag('fromV2'),
               `events[${i}] at time ${e.time} Chroma _mult will be removed.`,
            );
         }
      }
      e.customData = customData;
   });

   for (const k in bm.difficulty.customData) {
      if (k === '_customEvents') {
         bm.difficulty.customData.customEvents = [];
         bm.difficulty.customData._customEvents!.forEach((ce) => {
            if (ce._type === 'AnimateTrack') {
               bm.difficulty.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AnimateTrack',
                  d: {
                     track: ce._data._track,
                     duration: ce._data._duration,
                     easing: ce._data._easing,
                     position: ce._data._position,
                     rotation: ce._data._rotation,
                     localRotation: ce._data._localRotation,
                     scale: ce._data._scale,
                     dissolve: ce._data._dissolve,
                     dissolveArrow: ce._data._dissolveArrow,
                     color: ce._data._color,
                     interactable: ce._data._interactable,
                     time: ce._data._time,
                  },
               });
            }
            if (ce._type === 'AssignPathAnimation') {
               bm.difficulty.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AssignPathAnimation',
                  d: {
                     track: ce._data._track,
                     easing: ce._data._easing,
                     position: ce._data._position,
                     rotation: ce._data._rotation,
                     localRotation: ce._data._localRotation,
                     scale: ce._data._scale,
                     dissolve: ce._data._dissolve,
                     dissolveArrow: ce._data._dissolveArrow,
                     color: ce._data._color,
                     interactable: ce._data._interactable,
                     definitePosition: ce._data._definitePosition,
                  },
               });
            }
            if (ce._type === 'AssignTrackParent') {
               bm.difficulty.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AssignTrackParent',
                  d: {
                     childrenTracks: ce._data._childrenTracks,
                     parentTrack: ce._data._parentTrack,
                     worldPositionStays: ce._data._worldPositionStays,
                  },
               });
            }
            if (ce._type === 'AssignPlayerToTrack') {
               bm.difficulty.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AssignPlayerToTrack',
                  d: {
                     track: ce._data._track,
                     target: ce._data._target,
                  },
               });
            }
            if (ce._type === 'AssignFogTrack') {
               bm.difficulty.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AnimateComponent',
                  d: {
                     track: ce._data._track,
                     duration: ce._data._duration || 0,
                     BloomFogEnvironment: {
                        attenuation:
                           typeof ce._data._attenuation === 'number'
                              ? [[ce._data._attenuation, 0]]
                              : ce._data._attenuation,
                        height:
                           typeof ce._data._height === 'number'
                              ? [[ce._data._height, 0]]
                              : ce._data._height,
                        offset:
                           typeof ce._data._offset === 'number'
                              ? [[ce._data._offset, 0]]
                              : ce._data._offset,
                        startY:
                           typeof ce._data._startY === 'number'
                              ? [[ce._data._startY, 0]]
                              : ce._data._startY,
                     },
                  },
               });
            }
         });
         delete bm.difficulty.customData._customEvents;
         continue;
      }
      if (k === '_environment') {
         bm.difficulty.customData.environment = bm.difficulty.customData._environment!.map((e) => {
            let components: IChromaComponent = {};
            if (e._lightID) {
               components = {
                  ILightWithId: { lightID: e._lightID },
               };
            }
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
         delete bm.difficulty.customData._environment;
         continue;
      }
      if (k === '_materials') {
         bm.difficulty.customData.materials = {};
         for (const m in bm.difficulty.customData._materials) {
            bm.difficulty.customData.materials[m] = {
               shader: bm.difficulty.customData._materials[m]._shader,
               shaderKeywords: bm.difficulty.customData._materials[m]._shaderKeywords,
               collision: bm.difficulty.customData._materials[m]._collision,
               track: bm.difficulty.customData._materials[m]._track,
               color: bm.difficulty.customData._materials[m]._color,
            } as IChromaMaterial;
         }
         delete bm.difficulty.customData._materials;
         continue;
      }
      if (k === '_pointDefinitions') {
         bm.difficulty.customData.pointDefinitions = {};
         bm.difficulty.customData._pointDefinitions!.forEach((p) => {
            bm.difficulty.customData.pointDefinitions![p._name] = p._points;
         });
         delete bm.difficulty.customData._pointDefinitions;
         continue;
      }
      if (k === '_time') {
         bm.difficulty.customData.time = bm.difficulty.customData[k];
         delete bm.difficulty.customData._time;
         continue;
      }
      if (k === '_BPMChanges') {
         bm.difficulty.customData.BPMChanges = bm.difficulty.customData[k]?.map((bpmc) => {
            return {
               b: bpmc._time,
               m: bpmc._BPM,
               p: bpmc._beatsPerBar,
               o: bpmc._metronomeOffset,
            };
         });
         delete bm.difficulty.customData._BPMChanges;
         continue;
      }
      if (k === '_bpmChanges') {
         bm.difficulty.customData.BPMChanges = bm.difficulty.customData[k]?.map((bpmc) => {
            return {
               b: bpmc._time,
               m: bpmc._bpm,
               p: bpmc._beatsPerBar,
               o: bpmc._metronomeOffset,
            };
         });
         delete bm.difficulty.customData._bpmChanges;
         continue;
      }
      if (k === '_bookmarks') {
         bm.difficulty.customData.bookmarks = bm.difficulty.customData._bookmarks?.map((b) => {
            return {
               b: b._time,
               n: b._name,
               c: b._color,
            };
         });
         delete bm.difficulty.customData._bookmarks;
         continue;
      }
   }

   if (bm.difficulty.customData.environment) {
      const envTracks: string[] = [];
      for (const env of bm.difficulty.customData.environment) {
         if (env.track) {
            envTracks.push(env.track);
         }
      }
      const customEvents = [];
      if (bm.difficulty.customData.customEvents) {
         for (const ce of bm.difficulty.customData.customEvents) {
            if (ce.t === 'AnimateTrack') {
               if (typeof ce.d.track === 'string' && envTracks.includes(ce.d.track)) {
                  customEvents.push(ce);
               } else if (Array.isArray(ce.d.track)) {
                  for (const t of ce.d.track) {
                     if (envTracks.includes(t)) {
                        customEvents.push(ce);
                        break;
                     }
                  }
               }
            }
         }
      }
      for (const ce of customEvents) {
         if (typeof ce.d.track === 'string') {
            if (typeof ce.d.position === 'string') {
               logger.tWarn(tag('fromV2'), 'Cannot convert point definitions, unknown use.');
            } else if (Array.isArray(ce.d.position)) {
               isVector3(ce.d.position)
                  ? vectorMul(ce.d.position, 0.6)
                  : ce.d.position.forEach((point) => {
                       if (typeof point === 'string') return;
                       point[0] *= 0.6;
                       point[1] *= 0.6;
                       point[2] *= 0.6;
                    });
            }
         } else {
            logger.tWarn(
               tag('fromV2'),
               'Environment animate track array conversion not yet implemented.',
            );
         }
      }
   }
   bm.lightshow.useNormalEventsAsCompatibleEvents = true;
}

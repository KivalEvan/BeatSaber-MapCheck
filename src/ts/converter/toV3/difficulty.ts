import logger from '../../logger.ts';
import { Difficulty as V1Difficulty } from '../../beatmap/v1/difficulty.ts';
import { Difficulty as V2Difficulty } from '../../beatmap/v2/difficulty.ts';
import { Difficulty as V3Difficulty } from '../../beatmap/v3/difficulty.ts';
import { Difficulty as V4Difficulty } from '../../beatmap/v4/difficulty.ts';
import { Lightshow as V3Lightshow } from '../../beatmap/v3/lightshow.ts';
import { Lightshow as V4Lightshow } from '../../beatmap/v4/lightshow.ts';
import { clamp } from '../../utils/math.ts';
import { EventLaneRotationValue } from '../../beatmap/shared/constants.ts';
import type { ICustomDataNote } from '../../types/beatmap/v3/custom/note.ts';
import type { ICustomDataObstacle } from '../../types/beatmap/v3/custom/obstacle.ts';
import type { IChromaComponent, IChromaMaterial } from '../../types/beatmap/v3/custom/chroma.ts';
import objectToV3 from '../customData/objectToV3.ts';
import eventToV3 from '../customData/eventToV3.ts';
import { Obstacle } from '../../beatmap/v3/obstacle.ts';
import { Arc } from '../../beatmap/v3/arc.ts';
import { Waypoint } from '../../beatmap/v3/waypoint.ts';
import { BasicEvent } from '../../beatmap/v3/basicEvent.ts';
import { BasicEventTypesWithKeywords } from '../../beatmap/v3/basicEventTypesWithKeywords.ts';
import { BombNote } from '../../beatmap/v3/bombNote.ts';
import { BPMEvent } from '../../beatmap/v3/bpmEvent.ts';
import { ColorBoostEvent } from '../../beatmap/v3/colorBoostEvent.ts';
import { ColorNote } from '../../beatmap/v3/colorNote.ts';
import { RotationEvent } from '../../beatmap/v3/rotationEvent.ts';
import { isVector3, vectorMul } from '../../utils/vector.ts';
import type { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty.ts';
import type { IWrapLightshow } from '../../types/beatmap/wrapper/lightshow.ts';
import { deepCopy } from '../../utils/misc.ts';

function tag(name: string): string[] {
   return ['convert', 'toV3Difficulty', name];
}

/**
 * Convert beatmap to beatmap v3, you are encouraged to convert to make full use of new beatmap features.
 * ```ts
 * const converted = convert.toV3(data);
 * ```
 *
 * **WARNING:** Custom data may be lost on conversion, as well as other incompatible attributes.
 */
export function toV3Difficulty(data: IWrapDifficulty | IWrapLightshow): V3Difficulty {
   logger.tWarn(tag('main'), 'Converting to beatmap v3 may lose certain data!');

   let template = new V3Difficulty();
   switch (true) {
      case data instanceof V1Difficulty:
         fromV1Difficulty(template, data as V1Difficulty);
         break;
      case data instanceof V2Difficulty:
         fromV2Difficulty(template, data as V2Difficulty);
         break;
      case data instanceof V3Difficulty:
         template = new V3Difficulty(data);
         break;
      case data instanceof V4Difficulty:
         fromV4Difficulty(template, data as V4Difficulty);
         break;
      case data instanceof V3Lightshow:
         fromV3Lightshow(template, data as V3Lightshow);
         break;
      case data instanceof V4Lightshow:
         fromV4Lightshow(template, data as V4Lightshow);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}

function fromV1Difficulty(template: V3Difficulty, data: V1Difficulty) {
   data.colorNotes.forEach((n) => {
      if (n.isBomb()) {
         template.bombNotes.push(new BombNote(n));
      }
      if (n.isNote()) {
         let a = 0;
         if (n.direction >= 1000) {
            a = Math.abs(((n.direction % 1000) % 360) - 360);
         }
         template.colorNotes.push(
            new ColorNote({
               time: n.time,
               type: n.type as 0 | 1,
               posX: n.posX,
               posY: n.posY,
               direction:
                  n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                     ? n.direction === 8
                        ? 8
                        : 1
                     : clamp(n.direction, 0, 8),
               angleOffset: a,
            }),
         );
      }
   });
   template.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
   template.basicEvents = data.basicEvents.map((obj) => new BasicEvent(obj));

   template.customData.time = data.time;
   template.customData.BPMChanges = data.BPMChanges.map((bpmc) => {
      return {
         b: bpmc._time,
         m: bpmc._bpm,
         p: bpmc._beatsPerBar,
         o: bpmc._metronomeOffset,
      };
   });
   template.customData.bookmarks = data.bookmarks.map((b) => {
      return {
         b: b._time,
         n: b._name,
      };
   });
}

function fromV2Difficulty(template: V3Difficulty, data: V2Difficulty) {
   template.customData = deepCopy(data.customData);
   template.customData.fakeBombNotes = [];
   template.customData.fakeColorNotes = [];
   template.customData.fakeObstacles = [];

   data.colorNotes.forEach((n, i) => {
      const customData: ICustomDataNote = objectToV3(n.customData);
      if (typeof n.customData._cutDirection === 'number') {
         logger.tDebug(
            tag('fromV2Difficulty'),
            `notes[${i}] at time ${n.time} NE _cutDirection will be converted.`,
         );
      }
      if (n.isBomb()) {
         if (n.customData._fake) {
            template.customData.fakeBombNotes!.push(
               new BombNote({
                  time: n.time,
                  posX: n.posX,
                  posY: n.posY,
                  customData,
               }).toJSON(),
            );
         } else {
            template.bombNotes.push(
               new BombNote({
                  time: n.time,
                  posX: n.posX,
                  posY: n.posY,
                  customData,
               }),
            );
         }
      }
      if (n.isNote()) {
         let a = 0;
         if (typeof n.customData._cutDirection === 'number') {
            a =
               n.customData._cutDirection > 0
                  ? n.customData._cutDirection % 360
                  : 360 + (n.customData._cutDirection % 360);
         } else if (n.direction >= 1000) {
            a = Math.abs(((n.direction % 1000) % 360) - 360);
         }
         if (n.customData._fake) {
            template.customData.fakeColorNotes!.push(
               new ColorNote({
                  time: n.time,
                  type: n.type as 0 | 1,
                  posX: n.posX,
                  posY: n.posY,
                  direction:
                     n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                        ? n.direction === 8
                           ? 8
                           : 1
                        : clamp(n.direction, 0, 8),
                  angleOffset: a,
                  customData,
               }).toJSON(),
            );
         } else {
            template.colorNotes.push(
               new ColorNote({
                  time: n.time,
                  type: n.type as 0 | 1,
                  posX: n.posX,
                  posY: n.posY,
                  direction:
                     n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                        ? n.direction === 8
                           ? 8
                           : 1
                        : clamp(n.direction, 0, 8),
                  angleOffset: a,
                  customData,
               }),
            );
         }
      }
   });

   data.obstacles.forEach((o) => {
      const customData: ICustomDataObstacle = objectToV3(o.customData);
      if (o.customData._fake) {
         template.customData.fakeObstacles!.push(
            new Obstacle({
               time: o.time,
               posX: o.posX,
               posY: o.type ? 2 : 0,
               duration: o.duration,
               width: o.width,
               height: o.type ? 3 : 5,
               customData,
            }).toJSON(),
         );
      } else {
         template.obstacles.push(
            new Obstacle({
               time: o.time,
               posX: o.posX,
               posY: o.type ? 2 : 0,
               duration: o.duration,
               width: o.width,
               height: o.type ? 3 : 5,
               customData,
            }),
         );
      }
   });

   data.basicEvents.forEach((e, i) => {
      if (e.isColorBoost()) {
         template.colorBoostEvents.push(
            new ColorBoostEvent({
               time: e.time,
               toggle: e.value ? true : false,
            }),
         );
      } else if (e.isLaneRotationEvent()) {
         template.rotationEvents.push(
            new RotationEvent({
               time: e.time,
               executionTime: e.type === 14 ? 0 : 1,
               rotation:
                  typeof e.customData._rotation === 'number'
                     ? e.customData._rotation
                     : e.value >= 1000
                       ? (e.value - 1360) % 360
                       : EventLaneRotationValue[e.value] ?? 0,
            }),
         );
      } else if (e.isBpmEvent()) {
         template.bpmEvents.push(
            new BPMEvent({
               time: e.time,
               bpm: e.floatValue,
            }),
         );
      } else {
         const customData = eventToV3(e.customData);
         if (e.isLightEvent()) {
            if (e.customData._propID) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _propID will be removed.`,
               );
            }
            if (e.customData._lightGradient) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _lightGradient will be removed.`,
               );
            }
         }
         if (e.isRingEvent()) {
            if (e.customData._reset) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _reset will be removed.`,
               );
            }
            if (e.customData._counterSpin) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _counterSpin will be removed.`,
               );
            }
            if (e.customData._stepMult || e.customData._propMult || e.customData._speedMult) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _mult will be removed.`,
               );
            }
         }
         template.basicEvents.push(
            new BasicEvent({
               time: e.time,
               type: e.type,
               value: e.value,
               floatValue: e.floatValue,
               customData,
            }),
         );
      }
   });

   data.waypoints.forEach((w) => {
      template.waypoints.push(new Waypoint(w));
   });

   data.arcs.forEach((s) => template.arcs.push(new Arc(s)));

   template.eventTypesWithKeywords = new BasicEventTypesWithKeywords({
      list:
         data.eventTypesWithKeywords?.list?.map((k) => {
            return { keyword: k.keyword, events: k.events };
         }) ?? [],
   });

   for (const k in data.customData) {
      if (k === '_customEvents') {
         template.customData.customEvents = [];
         data.customData._customEvents!.forEach((ce) => {
            if (ce._type === 'AnimateTrack') {
               template.customData.customEvents?.push({
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
               template.customData.customEvents?.push({
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
               template.customData.customEvents?.push({
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
               template.customData.customEvents?.push({
                  b: ce._time,
                  t: 'AssignPlayerToTrack',
                  d: {
                     track: ce._data._track,
                     target: ce._data._target,
                  },
               });
            }
            if (ce._type === 'AssignFogTrack') {
               template.customData.customEvents?.push({
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
         delete data.customData._customEvents;
         continue;
      }
      if (k === '_environment') {
         template.customData.environment = data.customData._environment!.map((e) => {
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
         delete data.customData._environment;
         continue;
      }
      if (k === '_materials') {
         template.customData.materials = {};
         for (const m in data.customData._materials) {
            template.customData.materials[m] = {
               shader: data.customData._materials[m]._shader,
               shaderKeywords: data.customData._materials[m]._shaderKeywords,
               collision: data.customData._materials[m]._collision,
               track: data.customData._materials[m]._track,
               color: data.customData._materials[m]._color,
            } as IChromaMaterial;
         }
         delete data.customData._materials;
         continue;
      }
      if (k === '_pointDefinitions') {
         template.customData.pointDefinitions = {};
         data.customData._pointDefinitions!.forEach((p) => {
            template.customData.pointDefinitions![p._name] = p._points;
         });
         delete data.customData._pointDefinitions;
         continue;
      }
      if (k === '_time') {
         template.customData.time = data.customData[k];
         delete data.customData._time;
         continue;
      }
      if (k === '_BPMChanges') {
         template.customData.BPMChanges = data.customData[k]?.map((bpmc) => {
            return {
               b: bpmc._time,
               m: bpmc._BPM,
               p: bpmc._beatsPerBar,
               o: bpmc._metronomeOffset,
            };
         });
         delete data.customData._BPMChanges;
         continue;
      }
      if (k === '_bpmChanges') {
         template.customData.BPMChanges = data.customData[k]?.map((bpmc) => {
            return {
               b: bpmc._time,
               m: bpmc._bpm,
               p: bpmc._beatsPerBar,
               o: bpmc._metronomeOffset,
            };
         });
         delete data.customData._bpmChanges;
         continue;
      }
      if (k === '_bookmarks') {
         template.customData.bookmarks = data.customData._bookmarks?.map((b) => {
            return {
               b: b._time,
               n: b._name,
               c: b._color,
            };
         });
         delete data.customData._bookmarks;
         continue;
      }
      template.customData[k] = data.customData[k];
   }

   if (template.customData.environment) {
      const envTracks: string[] = [];
      for (const env of template.customData.environment) {
         if (env.track) {
            envTracks.push(env.track);
         }
      }
      const customEvents = [];
      if (template.customData.customEvents) {
         for (const ce of template.customData.customEvents) {
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
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  'Cannot convert point definitions, unknown use.',
               );
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
               tag('fromV2Difficulty'),
               'Environment animate track array conversion not yet implemented.',
            );
         }
      }
   }
   template.useNormalEventsAsCompatibleEvents = true;
}

function fromV4Difficulty(template: V3Difficulty, data: V4Difficulty) {
   template.addColorNotes(...data.colorNotes);
   template.addBombNotes(...data.bombNotes);
   template.addObstacles(...data.obstacles);
   template.addArcs(...data.arcs);
   template.addChains(...data.chains);
   template.addRotationEvents(...data.rotationEvents);
   template.customData = deepCopy(data.customData);
}

function fromV3Lightshow(template: V3Difficulty, data: V3Lightshow) {
   template.addBasicEvents(...data.basicEvents);
   template.addColorBoostEvents(...data.colorBoostEvents);
   template.addLightColorEventBoxGroups(...data.lightColorEventBoxGroups);
   template.addLightRotationEventBoxGroups(...data.lightRotationEventBoxGroups);
   template.addLightTranslationEventBoxGroups(...data.lightTranslationEventBoxGroups);
   template.addFxEventBoxGroups(...data.fxEventBoxGroups);
   template.eventTypesWithKeywords = data.eventTypesWithKeywords.clone();
   template.customData = deepCopy(data.customData);
}

function fromV4Lightshow(template: V3Difficulty, data: V4Lightshow) {
   template.addWaypoints(...data.waypoints);
   template.addBasicEvents(...data.basicEvents);
   template.addColorBoostEvents(...data.colorBoostEvents);
   template.addLightColorEventBoxGroups(...data.lightColorEventBoxGroups);
   template.addLightRotationEventBoxGroups(...data.lightRotationEventBoxGroups);
   template.addLightTranslationEventBoxGroups(...data.lightTranslationEventBoxGroups);
   template.addFxEventBoxGroups(...data.fxEventBoxGroups);
   template.eventTypesWithKeywords = data.eventTypesWithKeywords.clone();
   template.useNormalEventsAsCompatibleEvents = data.useNormalEventsAsCompatibleEvents;
   template.customData = deepCopy(data.customData);
}

import logger from '../logger';
import { Difficulty as V1Difficulty } from '../beatmap/v1/difficulty';
import { Difficulty as V2Difficulty } from '../beatmap/v2/difficulty';
import { Difficulty as V3Difficulty } from '../beatmap/v3/difficulty';
import { Info as V1Info } from '../beatmap/v1/info';
import { Info as V2Info } from '../beatmap/v2/info';
import { clamp } from '../utils/math';
import { ICustomDataNote } from '../types/beatmap/v2/custom/note';
import { ICustomDataObstacle } from '../types/beatmap/v2/custom/obstacle';
import { IChromaMaterial } from '../types/beatmap/v2/custom/chroma';
import objectToV2 from './customData/objectToV2';
import eventToV2 from './customData/eventToV2';
import { Note } from '../beatmap/v2/note';
import { Event } from '../beatmap/v2/event';
import { Obstacle } from '../beatmap/v2/obstacle';
import { Arc } from '../beatmap/v2/arc';
import { SpecialEventsKeywordFilters } from '../beatmap/v2/specialEventsKeywordFilters';
import { Waypoint } from '../beatmap/v2/waypoint';
import { isVector3, vectorMul } from '../utils/vector';
import { IWrapDifficulty } from '../types/beatmap/wrapper/difficulty';
import { IBPMChangeOld } from '../types/beatmap/v2/custom/bpmChange';
import { deepCopy, shallowCopy } from '../utils/misc';
import { IWrapInfo } from '../types/beatmap/wrapper/info';

function tag(name: string): string[] {
   return ['convert', name];
}

/**
 * In case you need to go back, who knows why.
 * ```ts
 * const converted = convert.toV2(data);
 * ```
 *
 * **WARNING:** Chain and other new stuff will be gone!
 */
export function toV2Difficulty(data: IWrapDifficulty): V2Difficulty {
   if (data instanceof V2Difficulty) {
      return data;
   }

   logger.tWarn(tag('toV2Difficulty'), 'Converting beatmap to v2 may lose certain data!');

   const template = new V2Difficulty();
   template.filename = data.filename;

   if (data instanceof V1Difficulty) {
      template.colorNotes = data.colorNotes.map((obj) => new Note(obj));
      template.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
      template.basicEvents = data.basicEvents.map((obj) => new Event(obj));

      template.customData._time = data.time;
      template.customData._bpmChanges = data.BPMChanges as IBPMChangeOld[];
      template.customData._bookmarks = data.bookmarks;
   }

   if (data instanceof V3Difficulty) {
      data.colorNotes.forEach((n) => {
         const _customData: ICustomDataNote = objectToV2(n.customData);
         template.colorNotes.push(
            new Note({
               _time: n.time,
               _lineIndex: n.posX,
               _lineLayer: n.posY,
               _type: n.color,
               _cutDirection: n.direction,
               _customData,
            }),
         );
      });

      data.customData.fakeColorNotes?.forEach((n) => {
         const _customData: ICustomDataNote = objectToV2(n.customData);
         template.colorNotes.push(
            new Note({
               _time: n.b,
               _lineIndex: n.x,
               _lineLayer: n.y,
               _type: n.c,
               _cutDirection: n.d,
               _customData,
            }),
         );
      });

      data.bombNotes.forEach((b) => {
         const _customData: ICustomDataNote = objectToV2(b.customData);
         template.colorNotes.push(
            new Note({
               _time: b.time,
               _lineIndex: b.posX,
               _lineLayer: b.posY,
               _type: 3,
               _cutDirection: 0,
               _customData,
            }),
         );
      });

      data.customData.fakeBombNotes?.forEach((b) => {
         const _customData: ICustomDataNote = objectToV2(b.customData);
         template.colorNotes.push(
            new Note({
               _time: b.b,
               _lineIndex: b.x,
               _lineLayer: b.y,
               _type: 3,
               _cutDirection: 0,
               _customData,
            }),
         );
      });

      data.obstacles.forEach((o) => {
         const _customData: ICustomDataObstacle = objectToV2(o.customData);
         if (o.posY === 2 && o.height === 3) {
            template.obstacles.push(
               new Obstacle({
                  _time: o.time,
                  _lineIndex: o.posX,
                  _type: 1,
                  _duration: o.duration,
                  _width: o.width,
                  _customData,
               }),
            );
         } else {
            template.obstacles.push(
               new Obstacle({
                  _time: o.time,
                  _lineIndex: o.posX,
                  _type: 0,
                  _duration: o.duration,
                  _width: o.width,
                  _customData,
               }),
            );
         }
      });

      data.customData.fakeObstacles?.forEach((o) => {
         const _customData: ICustomDataObstacle = objectToV2(o.customData);
         if (o.y === 2 && o.h === 3) {
            template.obstacles.push(
               new Obstacle({
                  _time: o.b,
                  _lineIndex: o.x,
                  _type: 1,
                  _duration: o.d,
                  _width: o.w,
                  _customData,
               }),
            );
         } else {
            template.obstacles.push(
               new Obstacle({
                  _time: o.b,
                  _lineIndex: o.x,
                  _type: 0,
                  _duration: o.d,
                  _width: o.w,
                  _customData,
               }),
            );
         }
      });

      data.basicEvents.forEach((e) => {
         const _customData = eventToV2(e.customData);
         if (e.isLaserRotationEvent()) {
            delete _customData?._speed;
         } else {
            delete _customData?._preciseSpeed;
         }
         template.basicEvents.push(
            new Event({
               _time: e.time,
               _type: e.type,
               _value: e.value,
               _floatValue: e.floatValue,
               _customData,
            }),
         );
      });

      data.colorBoostEvents.forEach((b) =>
         template.basicEvents.push(
            new Event({
               _time: b.time,
               _type: 5,
               _value: b.toggle ? 1 : 0,
               _floatValue: 1,
            }),
         ),
      );

      data.rotationEvents.forEach((lr) =>
         template.basicEvents.push(
            new Event({
               _time: lr.time,
               _type: lr.executionTime ? 14 : 15,
               _value:
                  Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15) < 6
                     ? Math.max(Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15), 3)
                     : Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15) - 2,
               _floatValue: 1,
            }),
         ),
      );

      data.bpmEvents.forEach((bpm) =>
         template.basicEvents.push(
            new Event({
               _time: bpm.time,
               _type: 100,
               _value: 1,
               _floatValue: bpm.bpm,
            }),
         ),
      );

      data.arcs.forEach((s) =>
         template.arcs.push(
            new Arc({
               _colorType: s.color,
               _headTime: s.time,
               _headLineIndex: s.posX,
               _headLineLayer: s.posY,
               _headControlPointLengthMultiplier: s.lengthMultiplier,
               _headCutDirection: s.direction as 0,
               _tailTime: s.tailTime,
               _tailLineIndex: s.tailPosX,
               _tailLineLayer: s.tailPosY,
               _tailControlPointLengthMultiplier: s.tailLengthMultiplier,
               _tailCutDirection: s.tailDirection as 0,
               _sliderMidAnchorMode: s.midAnchor,
            }),
         ),
      );

      data.waypoints.forEach((w) =>
         template.waypoints.push(
            new Waypoint({
               _time: w.time,
               _lineIndex: w.posX,
               _lineLayer: w.posY,
               _offsetDirection: w.direction,
            }),
         ),
      );

      template.eventTypesWithKeywords = new SpecialEventsKeywordFilters({
         _keywords:
            data.eventTypesWithKeywords.list.map((d) => {
               return { _keyword: d.keyword, _specialEvents: d.events };
            }) ?? [],
      });

      if (data.customData) {
         for (const k in data.customData) {
            if (k === 'customEvents') {
               template.customData._customEvents = [];
               for (const ce of data.customData.customEvents!) {
                  if (ce.t === 'AnimateTrack') {
                     for (let i = 0, repeat = ce.d.repeat ?? 0; i <= repeat; i++) {
                        template.customData._customEvents.push({
                           _time: ce.b + (ce.d.duration ?? 0) * i,
                           _type: 'AnimateTrack',
                           _data: {
                              _track: ce.d.track,
                              _duration: ce.d.duration,
                              _easing: ce.d.easing,
                              _position: ce.d.position,
                              _rotation: ce.d.rotation,
                              _localRotation: ce.d.localRotation,
                              _scale: ce.d.scale,
                              _dissolve: ce.d.dissolve,
                              _dissolveArrow: ce.d.dissolveArrow,
                              _color: ce.d.color,
                              _interactable: ce.d.interactable,
                              _time: ce.d.time,
                           },
                        });
                     }
                  }
                  if (ce.t === 'AssignPathAnimation') {
                     template.customData._customEvents.push({
                        _time: ce.b,
                        _type: 'AssignPathAnimation',
                        _data: {
                           _track: ce.d.track,
                           _easing: ce.d.easing,
                           _position: ce.d.position,
                           _rotation: ce.d.rotation,
                           _localRotation: ce.d.localRotation,
                           _scale: ce.d.scale,
                           _dissolve: ce.d.dissolve,
                           _dissolveArrow: ce.d.dissolveArrow,
                           _color: ce.d.color,
                           _interactable: ce.d.interactable,
                           _definitePosition: ce.d.definitePosition,
                        },
                     });
                  }
                  if (ce.t === 'AssignTrackParent') {
                     template.customData._customEvents.push({
                        _time: ce.b,
                        _type: 'AssignTrackParent',
                        _data: {
                           _childrenTracks: ce.d.childrenTracks,
                           _parentTrack: ce.d.parentTrack,
                           _worldPositionStays: ce.d.worldPositionStays,
                        },
                     });
                  }
                  if (ce.t === 'AssignPlayerToTrack') {
                     template.customData._customEvents.push({
                        _time: ce.b,
                        _type: 'AssignPlayerToTrack',
                        _data: {
                           _track: ce.d.track,
                           _target: ce.d.target,
                        },
                     });
                  }
                  if (ce.t === 'AnimateComponent' && ce.d.BloomFogEnvironment) {
                     template.customData._customEvents.push({
                        _time: ce.b,
                        _type: 'AssignFogTrack',
                        _data: {
                           _track: ce.d.track,
                           _duration: ce.d.duration,
                           _attenuation: ce.d.BloomFogEnvironment.attenuation,
                           _height: ce.d.BloomFogEnvironment.height,
                           _offset: ce.d.BloomFogEnvironment.offset,
                           _startY: ce.d.BloomFogEnvironment.startY,
                        },
                     });
                  }
               }
               continue;
            }
            if (k === 'environment') {
               template.customData._environment = data.customData.environment!.map((e) => {
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
                           tag('toV2Difficulty'),
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
               continue;
            }
            if (k === 'materials') {
               template.customData._materials = {};
               for (const m in data.customData.materials) {
                  template.customData._materials[m] = {
                     _shader: data.customData.materials[m].shader,
                     _shaderKeywords: data.customData.materials[m].shaderKeywords,
                     _collision: data.customData.materials[m].collision,
                     _track: data.customData.materials[m].track,
                     _color: data.customData.materials[m].color,
                  } as IChromaMaterial;
               }
               continue;
            }
            if (k === 'pointDefinitions') {
               template.customData._pointDefinitions = [];
               for (const p in data.customData.pointDefinitions!) {
                  template.customData._pointDefinitions.push({
                     _name: p,
                     _points: data.customData.pointDefinitions[p],
                  });
               }
               continue;
            }
            if (k === 'time') {
               template.customData._time = data.customData[k];
               continue;
            }
            if (k === 'BPMChanges') {
               template.customData._BPMChanges = data.customData[k]?.map((bpmc) => {
                  return {
                     _time: bpmc.b,
                     _BPM: bpmc.m,
                     _beatsPerBar: bpmc.p,
                     _metronomeOffset: bpmc.o,
                  };
               });
               continue;
            }
            if (k === 'bookmarks') {
               template.customData._bookmarks = data.customData[k]?.map((b) => {
                  return { _time: b.b, _name: b.n, _color: b.c };
               });
               continue;
            }
            template.customData[k] = data.customData[k];
         }
      }

      if (template.customData._environment) {
         const envTracks: string[] = [];
         for (const env of template.customData._environment) {
            if (env._track) {
               envTracks.push(env._track);
            }
         }
         const customEvents = [];
         if (template.customData._customEvents) {
            for (const ce of template.customData._customEvents) {
               if (ce._type === 'AnimateTrack') {
                  if (typeof ce._data._track === 'string' && envTracks.includes(ce._data._track)) {
                     customEvents.push(ce);
                  } else if (Array.isArray(ce._data._track)) {
                     for (const t of ce._data._track) {
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
            if (typeof ce._data._track === 'string') {
               if (typeof ce._data._position === 'string') {
                  logger.tWarn(
                     tag('toV2Difficulty'),
                     'Cannot convert point definitions, unknown use.',
                  );
               } else if (Array.isArray(ce._data._position)) {
                  isVector3(ce._data._position)
                     ? vectorMul(ce._data._position, 0.6)
                     : // deno-lint-ignore no-explicit-any
                       ce._data._position.forEach((point: any) => {
                          point[0] *= 0.6;
                          point[1] *= 0.6;
                          point[2] *= 0.6;
                       });
               }
            } else {
               logger.tWarn(
                  tag('toV2Difficulty'),
                  'Environment animate track array conversion not yet implemented.',
               );
            }
         }
      }
   }

   return template;
}

export function toV2Info(data: IWrapInfo): V2Info {
   if (data instanceof V2Info) {
      return data;
   }

   const template = new V2Info();

   template.songName = data.songName;
   template.songSubName = data.songSubName;
   template.songAuthorName = data.songAuthorName;
   template.levelAuthorName = data.levelAuthorName;
   template.beatsPerMinute = data.beatsPerMinute;
   template.shuffle = data.shuffle;
   template.shufflePeriod = data.shufflePeriod;
   template.previewStartTime = data.previewStartTime;
   template.previewDuration = data.previewDuration;
   template.songFilename = data.songFilename;
   template.coverImageFilename = data.coverImageFilename;
   template.environmentName = data.environmentName;
   template.allDirectionsEnvironmentName = data.allDirectionsEnvironmentName;
   template.songTimeOffset = data.songTimeOffset;
   if (data instanceof V1Info) {
      template.customData.contributors = data.contributors;
      template.customData.customEnvironment = data.customEnvironment;
      template.customData.customEnvironmentHash = data.customEnvironmentHash;
   } else {
      template.customData = deepCopy(data.customData);
   }

   if (data instanceof V1Info) {
      data.listMap().forEach(([mode, beatmap]) => {
         template.addMap(
            {
               _difficulty: beatmap.difficulty,
               _difficultyRank: beatmap.rank as 1,
               _beatmapFilename: beatmap.filename,
               _noteJumpMovementSpeed: beatmap.njs,
               _noteJumpStartBeatOffset: beatmap.njsOffset,
               _customData: {
                  _editorOffset: beatmap.offset,
                  _editorOldOffset: beatmap.oldOffset,
                  _difficultyLabel: beatmap.difficultyLabel,
                  _colorLeft: shallowCopy(beatmap.colorLeft),
                  _colorRight: shallowCopy(beatmap.colorRight),
                  _envColorLeft: shallowCopy(beatmap.envColorLeft),
                  _envColorRight: shallowCopy(beatmap.envColorRight),
                  _obstacleColor: shallowCopy(beatmap.obstacleColor),
               },
            },
            mode,
         );
      });
   }

   return template;
}

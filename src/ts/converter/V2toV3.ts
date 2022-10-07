import logger from '../logger';
import { Difficulty as DifficultyV2 } from '../beatmap/v2/difficulty';
import { Difficulty as DifficultyV3 } from '../beatmap/v3/difficulty';
import { clamp } from '../utils/math';
import { EventLaneRotationValue } from '../beatmap/shared/constants';
import { ICustomDataNote, ICustomDataObstacle } from '../types/beatmap/v3/customData';
import { Vector3 } from '../types/beatmap/shared/heck';
import { IChromaComponent, IChromaMaterial } from '../types/beatmap/v3/chroma';
import objectToV3 from './customData/objectToV3';
import eventToV3 from './customData/eventToV3';
import { Obstacle } from '../beatmap/v3/obstacle';
import { Slider } from '../beatmap/v3/slider';
import { Waypoint } from '../beatmap/v3/waypoint';
import { BasicEvent } from '../beatmap/v3/basicEvent';
import { BasicEventTypesWithKeywords } from '../beatmap/v3/basicEventTypesWithKeywords';
import { BombNote } from '../beatmap/v3/bombNote';
import { BPMEvent } from '../beatmap/v3/bpmEvent';
import { ColorBoostEvent } from '../beatmap/v3/colorBoostEvent';
import { ColorNote } from '../beatmap/v3/colorNote';
import { RotationEvent } from '../beatmap/v3/rotationEvent';

const tag = (name: string) => {
    return `[convert::${name}]`;
};

/** Convert beatmap v2 to beatmap v3, you are encouraged to convert to make full use of new beatmap features.
 * ```ts
 * const newData = convert.V2toV3(oldData);
 * ```
 * ---
 * **WARNING:** Custom data may be lost on conversion, as well as other incompatible attributes.
 */
export function V2toV3(data: DifficultyV2, skipPrompt?: boolean): DifficultyV3 {
    if (!skipPrompt) {
        logger.warn(tag('V2toV3'), 'Converting beatmap v2 to v3 may lose certain data!');
        const confirmation = prompt('Proceed with conversion? (y/N):', 'n');
        if (confirmation![0].toLowerCase() !== 'y') {
            throw Error('Conversion to beatmap v3 denied.');
        }
        logger.info(tag('V2toV3'), 'Converting beatmap v2 to v3');
    } else {
        logger.warn(tag('V2toV3'), 'Converting beatmap v2 to v3 may lose certain data!');
    }
    const template = DifficultyV3.create();
    template.fileName = data.fileName;

    template.customData.fakeBombNotes = [];
    template.customData.fakeColorNotes = [];
    template.customData.fakeObstacles = [];

    data.notes.forEach((n, i) => {
        const customData: ICustomDataNote = objectToV3(n.customData);
        if (typeof n.customData._cutDirection === 'number') {
            logger.debug(tag('V2toV3'), `notes[${i}] at time ${n.time} NE _cutDirection will be converted.`);
        }
        if (n.isBomb()) {
            if (n.customData._fake) {
                template.customData.fakeBombNotes!.push(
                    BombNote.create({
                        b: n.time,
                        x: n.posX,
                        y: n.posY,
                        customData,
                    })[0].toJSON(),
                );
            } else {
                template.bombNotes.push(
                    BombNote.create({
                        b: n.time,
                        x: n.posX,
                        y: n.posY,
                        customData,
                    })[0],
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
                    ColorNote.create({
                        b: n.time,
                        c: n.type as 0 | 1,
                        x: n.posX,
                        y: n.posY,
                        d:
                            n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                                ? n.direction === 8
                                    ? 8
                                    : 1
                                : clamp(n.direction, 0, 8),
                        a: a,
                        customData,
                    })[0].toJSON(),
                );
            } else {
                template.colorNotes.push(
                    ColorNote.create({
                        b: n.time,
                        c: n.type as 0 | 1,
                        x: n.posX,
                        y: n.posY,
                        d:
                            n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                                ? n.direction === 8
                                    ? 8
                                    : 1
                                : clamp(n.direction, 0, 8),
                        a: a,
                        customData,
                    })[0],
                );
            }
        }
    });

    data.obstacles.forEach((o) => {
        const customData: ICustomDataObstacle = objectToV3(o.customData);
        if (o.customData._fake) {
            template.customData.fakeObstacles!.push(
                Obstacle.create({
                    b: o.time,
                    x: o.posX,
                    y: o.type === 2 ? o.posY : o.type ? 2 : 0,
                    d: o.duration,
                    w: o.width,
                    h: o.type === 2 ? o.height : o.type ? 3 : 5,
                    customData,
                })[0].toJSON(),
            );
        } else {
            template.obstacles.push(
                Obstacle.create({
                    b: o.time,
                    x: o.posX,
                    y: o.type === 2 ? o.posY : o.type ? 2 : 0,
                    d: o.duration,
                    w: o.width,
                    h: o.type === 2 ? o.height : o.type ? 3 : 5,
                    customData,
                })[0],
            );
        }
    });

    data.events.forEach((e, i) => {
        if (e.isColorBoost()) {
            template.colorBoostBeatmapEvents.push(
                ColorBoostEvent.create({
                    b: e.time,
                    o: e.value ? true : false,
                })[0],
            );
        } else if (e.isLaneRotationEvent()) {
            template.rotationEvents.push(
                RotationEvent.create({
                    b: e.time,
                    e: e.type === 14 ? 0 : 1,
                    r:
                        typeof e.customData._rotation === 'number'
                            ? e.customData._rotation
                            : e.value >= 1000
                            ? (e.value - 1360) % 360
                            : EventLaneRotationValue[e.value] ?? 0,
                })[0],
            );
        } else if (e.isBPMChangeEvent()) {
            template.bpmEvents.push(
                BPMEvent.create({
                    b: e.time,
                    m: e.floatValue,
                })[0],
            );
        } else {
            const customData = eventToV3(e.customData);
            if (e.isLightEvent()) {
                if (e.customData._propID) {
                    logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _propID will be removed.`);
                }
                if (e.customData._lightGradient) {
                    logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _lightGradient will be removed.`);
                }
            }
            if (e.isRingEvent()) {
                if (e.customData._reset) {
                    logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _reset will be removed.`);
                }
                if (e.customData._counterSpin) {
                    logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _counterSpin will be removed.`);
                }
                if (e.customData._stepMult || e.customData._propMult || e.customData._speedMult) {
                    logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _mult will be removed.`);
                }
            }
            template.basicBeatmapEvents.push(
                BasicEvent.create({
                    b: e.time,
                    et: e.type,
                    i: e.value,
                    f: e.floatValue,
                    customData,
                })[0],
            );
        }
    });

    data.waypoints.forEach((w) => {
        template.waypoints.push(
            Waypoint.create({
                b: w.time,
                x: w.posX,
                y: w.posY,
                d: w.direction,
            })[0],
        );
    });

    data.sliders.forEach((s) =>
        template.sliders.push(
            Slider.create({
                c: s.colorType,
                b: s.headTime,
                x: s.headPosX,
                y: s.headPosY,
                d: s.headDirection,
                mu: s.headLengthMultiplier,
                tb: s.tailTime,
                tx: s.tailPosX,
                ty: s.tailPosY,
                tc: s.tailDirection,
                tmu: s.tailLengthMultiplier,
                m: s.midAnchor,
            })[0],
        ),
    );

    template.basicEventTypesWithKeywords = BasicEventTypesWithKeywords.create({
        d:
            data.specialEventsKeywordFilters?.keywords?.map((k) => {
                return { k: k.keyword, e: k.events };
            }) ?? [],
    });

    if (data.customData) {
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
                                playerTrackObject: ce._data._playerTrackObject,
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
                continue;
            }
            if (k === '_environment') {
                template.customData.environment = data.customData._environment!.map((e) => {
                    let components: IChromaComponent = {};
                    if (e._lightID) {
                        components = { ILightWithId: { lightID: e._lightID } };
                    }
                    if (e._id && e._lookupMethod) {
                        return {
                            id: e._id,
                            lookupMethod: e._lookupMethod,
                            track: e._track,
                            duplicate: e._duplicate,
                            active: e._active,
                            scale: e._scale,
                            position: e._position?.map((n) => n * 0.6) as Vector3,
                            rotation: e._rotation,
                            localPosition: e._localPosition?.map((n) => n * 0.6) as Vector3,
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
                            position: e._position?.map((n) => n * 0.6) as Vector3,
                            rotation: e._rotation,
                            localPosition: e._localPosition?.map((n) => n * 0.6) as Vector3,
                            localRotation: e._localRotation,
                            components,
                        };
                    }
                    throw new Error('Error converting environment v2 to v3');
                });
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
                continue;
            }
            if (k === '_pointDefinitions') {
                template.customData.pointDefinitions = {};
                data.customData._pointDefinitions!.forEach((p) => {
                    template.customData.pointDefinitions![p._name] = p._points;
                });
                continue;
            }
            if (k === '_time') {
                template.customData.time = data.customData[k];
                continue;
            }
            if (k === '_BPMChanges') {
                template.customData.BPMChanges = data.customData[k];
                continue;
            }
            if (k === '_bpmChanges') {
                template.customData.BPMChanges = data.customData[k]?.map((bpmc) => {
                    return {
                        _time: bpmc._time,
                        _BPM: bpmc._bpm,
                        _beatsPerBar: bpmc._beatsPerBar,
                        _metronomeOffset: bpmc._metronomeOffset,
                    };
                });
                continue;
            }
            if (k === '_bookmarks') {
                template.customData.bookmarks = data.customData[k];
                continue;
            }
            template.customData[k] = data.customData[k];
        }
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
                    logger.warn(tag('V2toV3'), 'Cannot convert point definitions, unknown use.');
                } else if (Array.isArray(ce.d.position)) {
                    ce.d.position.forEach((n) => {
                        n[0] *= 0.6;
                        n[1] *= 0.6;
                        n[2] *= 0.6;
                    });
                }
            } else {
                logger.warn(tag('V2toV3'), 'Environment animate track array conversion not yet implemented.');
            }
        }
    }
    template.useNormalEventsAsCompatibleEvents = true;
    return template;
}

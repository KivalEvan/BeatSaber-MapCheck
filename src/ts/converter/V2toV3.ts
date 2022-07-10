import * as v3 from '../beatmap/v3';
import logger from '../logger';
import { DifficultyData as DifficultyDataV2 } from '../beatmap/v2/difficulty';
import { DifficultyData as DifficultyDataV3 } from '../beatmap/v3/difficulty';
import { clamp } from '../utils/math';
import { EventLaneRotationValue } from '../beatmap/shared/constants';
import { ICustomDataNote, ICustomDataObstacle } from '../types/beatmap/v3/customData';
import { IBasicEvent } from '../types/beatmap/v3/basicEvent';
import { Vector3 } from '../types/beatmap/shared/heck';
import { IChromaEnvironment, IChromaMaterial } from '../types/beatmap/v3/chroma';

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
export function V2toV3(data: DifficultyDataV2, skipPrompt?: boolean): DifficultyDataV3 {
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
    const template = v3.DifficultyData.create();
    template.fileName = data.fileName;

    data.notes.forEach((n, i) => {
        const customData: ICustomDataNote = {
            color: n.customData._color,
            coordinates: n.customData._position,
            disableNoteGravity: n.customData._disableNoteGravity,
            disableNoteLook: n.customData._disableNoteLook,
            flip: n.customData._flip,
            localRotation: n.customData._localRotation,
            noteJumpMovementSpeed: n.customData._noteJumpMovementSpeed,
            noteJumpStartBeatOffset: n.customData._noteJumpStartBeatOffset,
            spawnEffect:
                typeof n.customData._disableSpawnEffect === 'boolean' ? !n.customData._disableSpawnEffect : undefined,
            track: n.customData._track,
            uninteractable: typeof n.customData._interactable === 'boolean' ? !n.customData._interactable : undefined,
            worldRotation: n.customData._rotation,
        };
        if (n.customData._animation) {
            customData.animation = {
                color: n.customData._animation._color,
                definitePosition: n.customData._animation._definitePosition,
                dissolve: n.customData._animation._dissolve,
                dissolveArrow: n.customData._animation._dissolveArrow,
                interactable: n.customData._animation._interactable,
                localRotation: n.customData._animation._localRotation,
                offsetPosition: n.customData._animation._position,
                offsetRotation: n.customData._animation._rotation,
                scale: n.customData._animation._scale,
                time: n.customData._animation._time,
            };
        }
        if (typeof n.customData._fake === 'boolean') {
            logger.warn(tag('V2toV3'), `notes[${i}] at time ${n.time} NE _fake will be removed.`);
        }
        if (typeof n.customData._cutDirection === 'number') {
            logger.debug(tag('V2toV3'), `notes[${i}] at time ${n.time} NE _cutDirection will be converted.`);
        }
        if (n.isBomb()) {
            template.bombNotes.push(
                v3.BombNote.create({
                    b: n.time,
                    x: n.posX,
                    y: n.posY,
                    customData,
                }),
            );
        }
        if (n.isNote()) {
            let a = 0;
            if (typeof n.customData._cutDirection === 'number') {
                a =
                    n.customData._cutDirection > 0
                        ? n.customData._cutDirection % 360
                        : 360 + (n.customData._cutDirection % 360);
            }
            if (n.cutDirection >= 1000) {
                a = Math.abs(((n.cutDirection % 1000) % 360) - 360);
            }
            template.colorNotes.push(
                v3.ColorNote.create({
                    b: n.time,
                    c: n.type as 0 | 1,
                    x: n.posX,
                    y: n.posY,
                    d:
                        n.cutDirection >= 1000 || typeof n.customData._cutDirection === 'number'
                            ? n.cutDirection === 8
                                ? 8
                                : 1
                            : clamp(n.cutDirection, 0, 8),
                    a: a,
                    customData,
                }),
            );
        }
    });

    data.obstacles.forEach((o, i) => {
        const customData: ICustomDataObstacle = {
            color: o.customData._color,
            coordinates: o.customData._position,
            localRotation: o.customData._localRotation,
            noteJumpMovementSpeed: o.customData._noteJumpMovementSpeed,
            noteJumpStartBeatOffset: o.customData._noteJumpStartBeatOffset,
            size: o.customData._scale,
            track: o.customData._track,
            uninteractable: typeof o.customData._interactable === 'boolean' ? !o.customData._interactable : undefined,
            worldRotation: o.customData._rotation,
        };
        if (o.customData._animation) {
            customData.animation = {
                color: o.customData._animation._color,
                definitePosition: o.customData._animation._definitePosition,
                dissolve: o.customData._animation._dissolve,
                dissolveArrow: o.customData._animation._dissolveArrow,
                interactable: o.customData._animation._interactable,
                localRotation: o.customData._animation._localRotation,
                offsetPosition: o.customData._animation._position,
                offsetRotation: o.customData._animation._rotation,
                scale: o.customData._animation._scale,
                time: o.customData._animation._time,
            };
        }
        if (typeof o.customData._fake === 'boolean') {
            logger.warn(tag('V2toV3'), `obstacles[${i}] at time ${o.time} NE _fake will be removed.`);
        }
        template.obstacles.push(
            v3.Obstacle.create({
                b: o.time,
                x: o.posX,
                y: o.type === 2 ? o.posY : o.type ? 2 : 0,
                d: o.duration,
                w: o.width,
                h: o.type === 2 ? o.height : o.type ? 3 : 5,
                customData,
            }),
        );
    });

    data.events.forEach((e, i) => {
        if (e.isColorBoost()) {
            template.colorBoostBeatmapEvents.push(
                v3.ColorBoostEvent.create({
                    b: e.time,
                    o: e.value ? true : false,
                }),
            );
        } else if (e.isLaneRotationEvent()) {
            template.rotationEvents.push(
                v3.RotationEvent.create({
                    b: e.time,
                    e: e.type === 14 ? 0 : 1,
                    r:
                        typeof e.customData._rotation === 'number'
                            ? e.customData._rotation
                            : e.value >= 1000
                            ? (e.value - 1360) % 360
                            : EventLaneRotationValue[e.value] ?? 0,
                }),
            );
        } else if (e.isBPMChangeEvent()) {
            template.bpmEvents.push(
                v3.BPMEvent.create({
                    b: e.time,
                    m: e.floatValue,
                }),
            );
        } else {
            let customData!: IBasicEvent['customData'];
            if (e.customData) {
                if (e.isLightEvent()) {
                    customData = {
                        color: e.customData._color,
                        lightID: e.customData._lightID,
                        easing: e.customData._easing,
                        lerpType: e.customData._lerpType,
                    };
                    if (e.customData._propID) {
                        logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _propID will be removed.`);
                    }
                    if (e.customData._lightGradient) {
                        logger.warn(
                            tag('V2toV3'),
                            `events[${i}] at time ${e.time} Chroma _lightGradient will be removed.`,
                        );
                    }
                }
                if (e.isRingEvent()) {
                    customData = {
                        nameFilter: e.customData._nameFilter,
                        rotation: e.customData._rotation,
                        step: e.customData._step,
                        prop: e.customData._prop,
                        speed: e.customData._speed,
                        direction: e.customData._direction,
                    };
                    if (e.customData._reset) {
                        logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _reset will be removed.`);
                    }
                    if (e.customData._counterSpin) {
                        logger.warn(
                            tag('V2toV3'),
                            `events[${i}] at time ${e.time} Chroma _counterSpin will be removed.`,
                        );
                    }
                    if (e.customData._stepMult || e.customData._propMult || e.customData._speedMult) {
                        logger.warn(tag('V2toV3'), `events[${i}] at time ${e.time} Chroma _mult will be removed.`);
                    }
                }
                if (e.isLaserRotationEvent()) {
                    const speed = e.customData._preciseSpeed ?? e.customData._speed;
                    customData = {
                        lockRotation: e.customData._lockPosition,
                        direction: e.customData._direction,
                        speed,
                    };
                }
            }
            template.basicBeatmapEvents.push(
                v3.BasicEvent.create({
                    b: e.time,
                    et: e.type,
                    i: e.value,
                    f: e.floatValue,
                    customData,
                }),
            );
        }
    });

    data.waypoints.forEach((w) => {
        template.waypoints.push(
            v3.Waypoint.create({
                b: w.time,
                x: w.posX,
                y: w.posY,
                d: w.direction,
            }),
        );
    });

    data.sliders.forEach((s) =>
        template.sliders.push(
            v3.Slider.create({
                c: s.colorType,
                b: s.headTime,
                x: s.headPosX,
                y: s.headPosY,
                d: s.headCutDirection,
                mu: s.headLengthMultiplier,
                tb: s.tailTime,
                tx: s.tailPosX,
                ty: s.tailPosY,
                tc: s.tailCutDirection,
                tmu: s.tailLengthMultiplier,
                m: s.midAnchor,
            }),
        ),
    );

    template.basicEventTypesWithKeywords = v3.BasicEventTypesWithKeywords.create({
        d:
            data.specialEventsKeywordFilters?.keywords?.map((k) => {
                return { k: k.keyword, e: k.events };
            }) ?? [],
    });

    if (data.customData) {
        for (const k in data.customData) {
            if (k === '_customEvents') {
                template.customData.customEvents = data.customData._customEvents!.map((ce) => {
                    if (ce._type === 'AnimateTrack') {
                        return {
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
                        };
                    }
                    if (ce._type === 'AssignPathAnimation') {
                        return {
                            b: ce._time,
                            t: 'AssignPathAnimation',
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
                                definitePosition: ce._data._definitePosition,
                            },
                        };
                    }
                    if (ce._type === 'AssignTrackParent') {
                        return {
                            b: ce._time,
                            t: 'AssignTrackParent',
                            d: {
                                childrenTracks: ce._data._childrenTracks,
                                parentTrack: ce._data._parentTrack,
                                worldPositionStays: ce._data._worldPositionStays,
                            },
                        };
                    }
                    if (ce._type === 'AssignPlayerToTrack') {
                        return {
                            b: ce._time,
                            t: 'AssignPlayerToTrack',
                            d: {
                                track: ce._data._track,
                            },
                        };
                    }
                    return {
                        b: ce._time,
                        t: 'AssignFogTrack',
                        d: {
                            track: ce._data._track,
                            attenuation: ce._data._attenuation,
                            offset: ce._data._offset,
                            startY: ce._data._startY,
                            height: ce._data._height,
                        },
                    };
                });
                continue;
            }
            if (k === '_environment') {
                template.customData.environment = data.customData._environment!.map((e) => {
                    let components = {};
                    if (e._lightID) components = { ILightWithId: { lightID: e._lightID } };
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
                        } as IChromaEnvironment;
                    }
                    if (e._geometry) {
                        return {
                            geometry: e._geometry.map((g) => {
                                return {
                                    type: g._type,
                                    material: g._material,
                                    spawnCount: g._spawnCount,
                                    track: g._track,
                                    collision: g._collision,
                                    color: g._color,
                                };
                            }),
                            track: e._track,
                            duplicate: e._duplicate,
                            active: e._active,
                            scale: e._scale,
                            position: e._position?.map((n) => n * 0.6) as Vector3,
                            rotation: e._rotation,
                            localPosition: e._localPosition?.map((n) => n * 0.6) as Vector3,
                            localRotation: e._localRotation,
                            components,
                        } as IChromaEnvironment;
                    }
                    throw new Error('Error converting environment v2 to v3');
                });
                continue;
            }
            if (k === '_materials') {
                template.customData.materials = {};
                for (const m in data.customData._materials) {
                    template.customData.materials[m] = {
                        shaderPreset: data.customData._materials[m]._shaderPreset,
                        shaderKeywords: data.customData._materials[m]._shaderKeywords,
                        track: data.customData._materials[m]._track,
                        color: data.customData._materials[m]._color,
                    } as IChromaMaterial;
                }
                continue;
            }
            if (k === '_pointDefinitions') {
                template.customData.pointDefinitions = data.customData._pointDefinitions!.map((e) => {
                    return {
                        name: e._name,
                        points: e._points,
                    };
                });
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
                    } else {
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

import * as v2 from './v2/index';
import * as v3 from './v3/index';
import logger from '../logger';
import { DifficultyData as DifficultyDataV2 } from './v2/difficulty';
import { DifficultyData as DifficultyDataV3 } from './v3/difficulty';
import { clamp } from '../utils/math';
import { EventLaneRotation } from './shared/constants';

// deno-lint-ignore ban-types
const tag = (func: Function) => {
    return `[convert::${func.name}]`;
};

/** Convert beatmap v2 to beatmap v3, you are encouraged to convert to make full use of new beatmap features.
 * ```ts
 * const newData = convert.V2toV3(oldData);
 * ```
 * ---
 * **WARNING:** Custom data will be lost on conversion, as well as other incompatible property.
 */
export const V2toV3 = (
    data: DifficultyDataV2,
    skipPrompt?: boolean
): DifficultyDataV3 => {
    if (!skipPrompt) {
        console.warn('Converting beatmap v2 to v3 may lose certain data!');
        const confirmation = prompt('Proceed with conversion? (Y/N):', 'n');
        if (confirmation![0].toLowerCase() !== 'y') {
            throw Error('Conversion to beatmap v3 denied.');
        }
        logger.info(tag(V2toV3), 'Converting beatmap v2 to v3');
    } else {
        logger.warn(tag(V2toV3), 'Converting beatmap v2 to v3 may lose certain data!');
    }
    const template = v3.DifficultyData.create();

    data.notes.forEach((n) => {
        if (n.isBomb()) {
            template.bombNotes.push(
                v3.BombNote.create({
                    b: n.time,
                    x: n.lineIndex,
                    y: n.lineLayer,
                    customData: n.customData,
                })
            );
        }
        if (n.isNote()) {
            let a = 0;
            if (typeof n.customData?._cutDirection === 'number') {
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
                    x: n.lineIndex,
                    y: n.lineLayer,
                    d:
                        n.cutDirection >= 1000 ||
                        typeof n.customData?._cutDirection === 'number'
                            ? n.cutDirection === 8
                                ? 8
                                : 1
                            : clamp(n.cutDirection, 0, 8),
                    a: a,
                    customData: n.customData,
                })
            );
        }
    });

    data.obstacles.forEach((o) =>
        template.obstacles.push(
            v3.Obstacle.create({
                b: o.time,
                x: o.lineIndex,
                y: o.type === 2 ? o.lineLayer : o.type ? 2 : 0,
                d: o.duration,
                w: o.width,
                h: o.type === 2 ? o.height : o.type ? 3 : 5,
                customData: o.customData,
            })
        )
    );

    data.events.forEach((e) => {
        if (e.isColorBoost()) {
            template.colorBoostBeatmapEvents.push(
                v3.ColorBoostEvent.create({
                    b: e.time,
                    o: e.value ? true : false,
                })
            );
        } else if (e.isLaneRotationEvent()) {
            template.rotationEvents.push(
                v3.RotationEvent.create({
                    b: e.time,
                    e: e.type === 14 ? 0 : 1,
                    r:
                        typeof e.customData?._rotation === 'number'
                            ? e.customData._rotation
                            : e.value >= 1000
                            ? (e.value - 1360) % 360
                            : EventLaneRotation[e.value] ?? 0,
                })
            );
        } else if (e.isBPMChangeEvent()) {
            template.bpmEvents.push(
                v3.BPMEvent.create({
                    b: e.time,
                    m: e.floatValue,
                })
            );
        } else {
            template.basicBeatmapEvents.push(
                v3.BasicEvent.create({
                    b: e.time,
                    et: e.type,
                    i: e.value,
                    f: e.floatValue,
                    customData: e.customData,
                })
            );
        }
    });

    data.waypoints.forEach((w) => {
        template.waypoints.push(
            v3.Waypoint.create({
                b: w.time,
                x: w.lineIndex,
                y: w.lineLayer,
                d: w.direction,
            })
        );
    });

    data.sliders.forEach((s) =>
        template.sliders.push(
            v3.Slider.create({
                c: s.colorType,
                b: s.headTime,
                x: s.headLineIndex,
                y: s.headLineLayer,
                d: s.headCutDirection,
                mu: s.headLengthMultiplier,
                tb: s.tailTime,
                tx: s.tailLineIndex,
                ty: s.tailLineLayer,
                tc: s.tailCutDirection,
                tmu: s.tailLengthMultiplier,
                m: s.midAnchor,
            })
        )
    );

    template.basicEventTypesWithKeywords = v3.BasicEventTypesWithKeywords.create({
        d:
            data.specialEventsKeywordFilters?.keywords?.map((k) => {
                return { k: k.keyword, e: k.events };
            }) ?? [],
    });

    if (data.customData) {
        template.customData = data.customData;
    }

    return template;
};

/** In case you need to go back, who knows why.
 * ```ts
 * const oldData = convert.V3toV2(newData);
 * ```
 * ---
 * **WARNING:** Burst slider and other new stuff will be gone!
 * This feature won't be supported in the near future.
 */
export const V3toV2 = (
    data: DifficultyDataV3,
    skipPrompt?: boolean
): DifficultyDataV2 => {
    if (!skipPrompt) {
        console.warn('Converting beatmap v3 to v2 may lose certain data!');
        const confirmation = prompt('Proceed with conversion? (Y/N):', 'n');
        if (confirmation![0].toLowerCase() !== 'y') {
            throw Error('Conversion to beatmap v2 denied.');
        }
        logger.info(tag(V3toV2), 'Converting beatmap v3 to v2');
    } else {
        logger.warn(tag(V3toV2), 'Converting beatmap v3 to v2 may lose certain data!');
    }
    const template = DifficultyDataV2.create();

    data.colorNotes.forEach((n) =>
        template.notes.push(
            v2.Note.create({
                _time: n.time,
                _lineIndex: n.posX,
                _lineLayer: n.posY,
                _type: n.color,
                _cutDirection: n.direction,
                _customData: n.customData,
            })
        )
    );

    data.bombNotes.forEach((b) =>
        template.notes.push(
            v2.Note.create({
                _time: b.time,
                _lineIndex: b.posX,
                _lineLayer: b.posY,
                _type: 3,
                _cutDirection: 0,
                _customData: b.customData,
            })
        )
    );

    data.obstacles.forEach((o) => {
        if (o.posY === 0 && o.height === 5) {
            template.obstacles.push(
                v2.Obstacle.create({
                    _time: o.time,
                    _lineIndex: o.posX,
                    _lineLayer: 0,
                    _type: 0,
                    _duration: o.duration,
                    _width: o.width,
                    _height: o.height,
                    _customData: o.customData,
                })
            );
        } else if (o.posY === 2 && o.height === 3) {
            template.obstacles.push(
                v2.Obstacle.create({
                    _time: o.time,
                    _lineIndex: o.posX,
                    _lineLayer: 0,
                    _type: 1,
                    _duration: o.duration,
                    _width: o.width,
                    _height: o.height,
                    _customData: o.customData,
                })
            );
        } else {
            template.obstacles.push(
                v2.Obstacle.create({
                    _time: o.time,
                    _lineIndex: o.posX,
                    _lineLayer: o.posY,
                    _type: 2,
                    _duration: o.duration,
                    _width: o.width,
                    _height: o.height,
                    _customData: o.customData,
                })
            );
        }
    });

    data.basicBeatmapEvents.forEach((be) => {
        template.events.push(
            v2.Event.create({
                _time: be.time,
                _type: be.type as 8, // hackish way to just accept any other event
                _value: be.value,
                _floatValue: be.floatValue,
                _customData: be.customData,
            })
        );
    });

    data.colorBoostBeatmapEvents.forEach((b) =>
        template.events.push(
            v2.Event.create({
                _time: b.time,
                _type: 5,
                _value: b.toggle ? 1 : 0,
                _floatValue: 1,
            })
        )
    );

    data.rotationEvents.forEach((lr) =>
        template.events.push(
            v2.Event.create({
                _time: lr.time,
                _type: lr.executionTime ? 14 : 15,
                _value:
                    Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15) < 6
                        ? Math.max(
                              Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15),
                              3
                          )
                        : Math.floor((clamp(lr.rotation, -60, 60) + 60) / 15) - 2,
                _floatValue: 1,
            })
        )
    );

    data.bpmEvents.forEach((bpm) =>
        template.events.push(
            v2.Event.create({
                _time: bpm.time,
                _type: 100,
                _value: 1,
                _floatValue: bpm.bpm,
            })
        )
    );

    data.sliders.forEach((s) =>
        template.sliders.push(
            v2.Slider.create({
                _colorType: s.color,
                _headTime: s.time,
                _headLineIndex: s.posX,
                _headLineLayer: s.posY,
                _headControlPointlengthMultiplier: s.lengthMultiplier,
                _headCutDirection: s.color,
                _tailTime: s.tailTime,
                _tailLineIndex: s.tailPosX,
                _tailLineLayer: s.tailPosY,
                _tailControlPointLengthMultiplier: s.tailLengthMultiplier,
                _tailCutDirection: s.color,
                _sliderMidAnchorMode: s.midAnchor,
            })
        )
    );

    data.waypoints.forEach((w) =>
        template.waypoints.push(
            v2.Waypoint.create({
                _time: w.time,
                _lineIndex: w.posX,
                _lineLayer: w.posY,
                _offsetDirection: w.direction,
            })
        )
    );

    template.specialEventsKeywordFilters = v2.SpecialEventsKeywordFilters.create({
        _keywords:
            data.basicEventTypesWithKeywords.list.map((d) => {
                return { _keyword: d.keyword, _specialEvents: d.events };
            }) ?? [],
    });

    if (data.customData) {
        template.customData = data.customData;
    }

    return template;
};

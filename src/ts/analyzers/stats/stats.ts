import { NoteCount, ObstacleCount } from '../../types/mapcheck/analyzers/stats';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { ColorNote } from '../../beatmap/v3/colorNote';
import { Obstacle } from '../../beatmap/v3/obstacle';
import { BasicEvent } from '../../beatmap/v3/basicEvent';

export const note = {
    count: (notes: ColorNote[]): NoteCount => {
        const noteCount: NoteCount = {
            red: {
                total: 0,
                chroma: 0,
                noodleExtensions: 0,
                mappingExtensions: 0,
            },
            blue: {
                total: 0,
                chroma: 0,
                noodleExtensions: 0,
                mappingExtensions: 0,
            },
            bomb: {
                total: 0,
                chroma: 0,
                noodleExtensions: 0,
                mappingExtensions: 0,
            },
        };
        for (let i = notes.length - 1; i >= 0; i--) {
            if (notes[i].type === 0) {
                noteCount.red.total++;
                if (
                    notes[i].customData?.color ||
                    notes[i].customData?.disableSpawnEffect
                ) {
                    noteCount.red.chroma++;
                }
            } else if (notes[i].type === 1) {
                noteCount.blue.total++;
                if (
                    notes[i].customData?.color ||
                    notes[i].customData?.disableSpawnEffect
                ) {
                    noteCount.blue.chroma++;
                }
            } else if (notes[i].type === 3) {
                noteCount.bomb.total++;
                if (
                    notes[i].customData?.color ||
                    notes[i].customData?.disableSpawnEffect
                ) {
                    noteCount.bomb.chroma++;
                }
            }
        }
        return noteCount;
    },
};
/** Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export const count = (
    events: BasicEvent[],
    environment: EnvironmentAllName = 'DefaultEnvironment'
): IEventCount => {
    const commonEvent = EventList[environment][0] ?? [0, 1, 2, 3, 4, 8, 9, 12, 13];
    const eventCount: IEventCount = {};
    for (let i = commonEvent.length - 1; i >= 0; i--) {
        eventCount[commonEvent[i]] = {
            total: 0,
            chroma: 0,
            chromaOld: 0,
            noodleExtensions: 0,
            mappingExtensions: 0,
        };
    }

    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].isValidType()) {
            if (!eventCount[events[i].type]) {
                eventCount[events[i].type] = {
                    total: 0,
                    chroma: 0,
                    chromaOld: 0,
                    noodleExtensions: 0,
                    mappingExtensions: 0,
                };
            }
            eventCount[events[i].type].total++;
            if (this.hasChroma()) {
                eventCount[events[i].type].chroma++;
            }
            if (this.hasOldChroma()) {
                eventCount[events[i].type].chromaOld++;
            }
            if (this.hasNoodleExtensions()) {
                eventCount[events[i].type].noodleExtensions++;
            }
            if (this.hasMappingExtensions()) {
                eventCount[events[i].type].mappingExtensions++;
            }
        }
    }
    return eventCount;
};
/** Count number of type of obstacles with their properties in given array and return a obstacle count object.
 * ```ts
 * const list = count(walls);
 * console.log(list);
 * ```
 */
export const count = (obstacles: Obstacle[]): ObstacleCount => {
    const obstacleCount: ObstacleCount = {
        total: 0,
        interactive: 0,
        crouch: 0,
        chroma: 0,
        noodleExtensions: 0,
        mappingExtensions: 0,
    };
    for (let i = obstacles.length - 1; i > -1; i--) {
        obstacleCount.total++;
        if (obstacles[i].isInteractive()) {
            obstacleCount.interactive++;
        }
        if (obstacles[i].isCrouch()) {
            obstacleCount.crouch++;
        }
        if (obstacles[i].hasChroma()) {
            obstacleCount.chroma++;
        }
        if (obstacles[i].hasNoodleExtensions()) {
            obstacleCount.noodleExtensions++;
        }
        if (obstacles[i].hasMappingExtensions()) {
            obstacleCount.mappingExtensions++;
        }
    }
    return obstacleCount;
};
/** Count number of red, blue, and bomb notes with their properties in given array and return a note count object.
 * ```ts
 * const list = count(notes);
 * console.log(list);
 * ```
 */

/** Count number of specified line index in a given array and return a counted number of line index.
 * ```ts
 * const indexCount = countIndex(notes, 0);
 * ```
 */
export const countIndex = (notes: ColorNote[], x: number): number => {
    return notes.filter((n) => n.posX === x).length;
};

/** Count number of specified line layer in a given array and return a counted number of line layer.
 * ```ts
 * const layerCount = countLayer(notes, 0);
 * ```
 */
export const countLayer = (notes: ColorNote[], y: number): number => {
    return notes.filter((n) => n.posY === y).length;
};

/** Count number of specified line index and line layer in a given array and return a counted number of line index and line layer.
 * ```ts
 * const indexLayerCount = countIndexLayer(notes, 0, 0);
 * ```
 */
export const countIndexLayer = (notes: ColorNote[], x: number, y: number): number => {
    return notes.filter((n) => n.posX === x && n.posY === y).length;
};

/** Count number of specified `_cutDirection` in a given array and return a counted number of `_cutDirection`.
 * ```ts
 * const cdCount = countDirection(notes, 0);
 * ```
 */
export const countDirection = (notes: ColorNote[], cd: number): number => {
    return notes.filter((n) => n.direction === cd).length;
};

/** Count number of specified angle in a given array and return a counted number of angle.
 * ```ts
 * const angleCount = countAngle(notes, 0);
 * ```
 */
export const countAngle = (notes: ColorNote[], angle: number): number => {
    return notes.filter((n) => n.getAngle() === angle).length;
};

/** Calculate note per second.
 * ```ts
 * const nps = nps(notes, 10);
 * ```
 */
export const nps = (notes: ColorNote[], duration: number): number => {
    return duration ? notes.length / duration : 0;
};

/** Calculate the peak by rolling average.
 * ```ts
 * const peakNPS = peak(notes, 10, BPM ?? 128);
 * ```
 */
export const peak = (
    notes: ColorNote[],
    beat: number,
    bpm: BeatPerMinute | number
): number => {
    let peakNPS = 0;
    let currentSectionStart = 0;
    const bpmV = typeof bpm === 'number' ? bpm : bpm.value;

    for (let i = 0; i < nArr.length; i++) {
        while (nArr[i].time - nArr[currentSectionStart].time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(
            peakNPS,
            (i - currentSectionStart + 1) / ((beat / bpmV) * 60)
        );
    }

    return peakNPS;
};

import { BurstSlider } from '../../beatmap/v3/burstSlider';
import { ColorNote } from '../../beatmap/v3/colorNote';
import { Slider } from '../../beatmap/v3/slider';
import { radToDeg, shortRotDistance } from '../../utils/math';

// TODO: update with new position/rotation system
export const isEnd = (
    currNote: ColorNote,
    prevNote: ColorNote,
    cd: number
): boolean => {
    // fuck u and ur dot note stack
    if (currNote.direction === 8 && prevNote.direction === 8 && cd !== 8) {
        // if end note on right side
        if (currNote.posX > prevNote.posX) {
            if (cd === 5 || cd === 3 || cd === 7) {
                return true;
            }
        }
        // if end note on left side
        if (currNote.posX < prevNote.posX) {
            if (cd === 6 || cd === 2 || cd === 4) {
                return true;
            }
        }
        // if end note is above
        if (currNote.posY > prevNote.posY) {
            if (cd === 4 || cd === 0 || cd === 5) {
                return true;
            }
        }
        // if end note is below
        if (currNote.posY < prevNote.posY) {
            if (cd === 6 || cd === 1 || cd === 7) {
                return true;
            }
        }
    }
    // if end note on right side
    if (currNote.posX > prevNote.posX) {
        // check if end note is arrowed
        if (
            currNote.direction === 5 ||
            currNote.direction === 3 ||
            currNote.direction === 7
        ) {
            return true;
        }
        // check if end note is dot and start arrow is pointing to it
        if (
            (prevNote.direction === 5 ||
                prevNote.direction === 3 ||
                prevNote.direction === 7) &&
            currNote.direction === 8
        ) {
            return true;
        }
    }
    // if end note on left side
    if (currNote.posX < prevNote.posX) {
        if (
            currNote.direction === 6 ||
            currNote.direction === 2 ||
            currNote.direction === 4
        ) {
            return true;
        }
        if (
            (prevNote.direction === 6 ||
                prevNote.direction === 2 ||
                prevNote.direction === 4) &&
            currNote.direction === 8
        ) {
            return true;
        }
    }
    // if end note is above
    if (currNote.posY > prevNote.posY) {
        if (
            currNote.direction === 4 ||
            currNote.direction === 0 ||
            currNote.direction === 5
        ) {
            return true;
        }
        if (
            (prevNote.direction === 4 ||
                prevNote.direction === 0 ||
                prevNote.direction === 5) &&
            currNote.direction === 8
        ) {
            return true;
        }
    }
    // if end note is below
    if (currNote.posY < prevNote.posY) {
        if (
            currNote.direction === 6 ||
            currNote.direction === 1 ||
            currNote.direction === 7
        ) {
            return true;
        }
        if (
            (prevNote.direction === 6 ||
                prevNote.direction === 1 ||
                prevNote.direction === 7) &&
            currNote.direction === 8
        ) {
            return true;
        }
    }
    return false;
};

/** Check if the note intersect on swing path by angle and distance.
 * ```ts
 * if (isIntersect(note1, note2, [[20, 1.5]])) {}
 * ```
 */
// a fkin abomination that's what currNote is
export const isIntersect = (
    currNote: ColorNote,
    compareTo: ColorNote,
    angleDistances: [number, number, number?][],
    ahead = false
): [boolean, boolean] => {
    const [nX1, nY1] = currNote.getPosition();
    const [nX2, nY2] = compareTo.getPosition();
    const nA1 = currNote.getAngle();
    const nA2 = compareTo.getAngle();
    const angle = ahead ? 540 : 360;
    let resultN1 = false;
    if (currNote.direction !== 8) {
        const a = (radToDeg(Math.atan2(nY1 - nY2, nX1 - nX2)) + 450) % 360;
        for (const [angleRange, maxDistance, offsetT] of angleDistances) {
            const offset = offsetT ?? 0;
            const aS = (nA1 + angle - angleRange + offset) % 360;
            const aE = (nA1 + angle + angleRange + offset) % 360;
            resultN1 =
                (maxDistance >=
                    Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
                    ((aS < aE && aS <= a && a <= aE) ||
                        (aS >= aE && (a <= aE || a >= aS)))) ||
                resultN1;
            if (resultN1) {
                break;
            }
        }
    }
    let resultN2 = false;
    if (compareTo.direction !== 8) {
        const a = (radToDeg(Math.atan2(nY2 - nY1, nX2 - nX1)) + 450) % 360;
        for (const [angleRange, maxDistance, offsetT] of angleDistances) {
            const offset = offsetT ?? 0;
            const aS = (nA2 + angle - angleRange + offset) % 360;
            const aE = (nA2 + angle + angleRange + offset) % 360;
            resultN2 =
                (maxDistance >=
                    Math.sqrt(Math.pow(nX1 - nX2, 2) + Math.pow(nY1 - nY2, 2)) &&
                    ((aS < aE && aS <= a && a <= aE) ||
                        (aS >= aE && (a <= aE || a >= aS)))) ||
                resultN2;
            if (resultN2) {
                break;
            }
        }
    }
    return [resultN1, resultN2];
};

// TODO: update with new position/rotation system
export const predictDirection = (currNote: ColorNote, prevNote: ColorNote): number => {
    if (isEnd(currNote, prevNote, 8)) {
        return currNote.direction === 8 ? prevNote.direction : currNote.direction;
    }
    if (currNote.direction !== 8) {
        return currNote.direction;
    }
    if (currNote.time > prevNote.time) {
        // if end note on right side
        if (currNote.posX > prevNote.posX) {
            if (currNote.isHorizontal(prevNote)) {
                return 3;
            }
        }
        // if end note on left side
        if (currNote.posX < prevNote.posX) {
            if (currNote.isHorizontal(prevNote)) {
                return 2;
            }
        }
        // if end note is above
        if (currNote.posY > prevNote.posY) {
            if (currNote.isVertical(prevNote)) {
                return 0;
            }
            if (currNote.posX > prevNote.posX) {
                return 5;
            }
            if (currNote.posX < prevNote.posX) {
                return 4;
            }
        }
        // if end note is below
        if (currNote.posY < prevNote.posY) {
            if (currNote.isVertical(prevNote)) {
                return 1;
            }
            if (currNote.posX > prevNote.posX) {
                return 7;
            }
            if (currNote.posX < prevNote.posX) {
                return 6;
            }
        }
    }
    return 8;
};

/** Check the angle equality of the two notes.
 * @param {(Note|number|null)}  - First beatmap note, note `_direction`, or null value
 * @param {(Note|number|null)} n2 - Second beatmap note, note `_direction`, or null value
 * @param {number} angleTol - Angle tolerance
 * @param {boolean} equal - If it should check inner or outer angle
 * @returns {boolean} If condition is met
 */
export const checkDirection = (
    n1: ColorNote | Slider | BurstSlider | number | null,
    n2: ColorNote | Slider | BurstSlider | number | null,
    angleTol: number,
    equal: boolean
): boolean => {
    let nA1!: number;
    let nA2!: number;
    if (n1 === null || n2 === null) {
        return false;
    }
    if (typeof n1 === 'number') {
        nA1 = n1;
    } else {
        if (n1.direction === 8) {
            return false;
        }
        nA1 = n1.getAngle();
    }
    if (typeof n2 === 'number') {
        nA2 = n2;
    } else {
        if (n2.direction === 8) {
            return false;
        }
        nA2 = n2.getAngle();
    }
    return equal
        ? shortRotDistance(nA1, nA2, 360) <= angleTol
        : shortRotDistance(nA1, nA2, 360) >= angleTol;
};

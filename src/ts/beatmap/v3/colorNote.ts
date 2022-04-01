import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { BaseObject } from './baseObject';
import { LINE_COUNT, NoteCutAngle } from '../shared/constants';
import { radToDeg, shortRotDistance } from '../../utils';
import { ObjectToReturn } from '../../types/utils';
import { ICoordinateNote } from '../../types/beatmap/shared/coordinate';

/** Color note beatmap object. */
export class ColorNote
    extends BaseObject<IColorNote>
    implements ICoordinateNote<ColorNote>
{
    static default: ObjectToReturn<Required<IColorNote>> = {
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        d: 0,
        a: 0,
        cd: () => {
            return {};
        },
    };

    private constructor(colorNote: Required<IColorNote>) {
        super(colorNote);
    }

    static create(): ColorNote;
    static create(colorNotes: Partial<IColorNote>): ColorNote;
    static create(...colorNotes: Partial<IColorNote>[]): ColorNote[];
    static create(...colorNotes: Partial<IColorNote>[]): ColorNote | ColorNote[] {
        const result: ColorNote[] = [];
        colorNotes?.forEach((n) =>
            result.push(
                new ColorNote({
                    b: n.b ?? ColorNote.default.b,
                    x: n.x ?? ColorNote.default.x,
                    y: n.y ?? ColorNote.default.y,
                    c: n.c ?? ColorNote.default.c,
                    d: n.d ?? ColorNote.default.d,
                    a: n.a ?? ColorNote.default.a,
                    cd: n.cd ?? ColorNote.default.cd(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new ColorNote({
            b: ColorNote.default.b,
            x: ColorNote.default.x,
            y: ColorNote.default.y,
            c: ColorNote.default.c,
            d: ColorNote.default.d,
            a: ColorNote.default.a,
            cd: ColorNote.default.cd(),
        });
    }

    toObject(): IColorNote {
        return {
            b: this.time,
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            a: this.angleOffset,
        };
    }

    /** Position x `<int>` of note.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get posX() {
        return this.data.x;
    }
    set posX(value: IColorNote['x']) {
        this.data.x = value;
    }

    /** Position y `<int>` of note.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get posY() {
        return this.data.y;
    }
    set posY(value: IColorNote['y']) {
        this.data.y = value;
    }

    /** Color type `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    get color() {
        return this.data.c;
    }
    set color(value: IColorNote['c']) {
        this.data.c = value;
    }

    /** Cut direction `<int>` of note.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended with sliders, assumes down-directional.
     */
    get direction() {
        return this.data.d;
    }
    set direction(value: IColorNote['d']) {
        this.data.d = value;
    }

    /** Angle offset in degree counter-clockwise `<int>` of note.*/
    get angleOffset() {
        return this.data.a;
    }
    set angleOffset(value: IColorNote['a']) {
        this.data.a = value;
    }

    get customData() {
        return this.data.cd;
    }
    set customData(value: typeof this.data.cd) {
        this.data.cd = value;
    }

    setColor(value: IColorNote['c']) {
        this.color = value;
        return this;
    }
    setPosX(value: IColorNote['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IColorNote['y']) {
        this.posY = value;
        return this;
    }
    setDirection(value: IColorNote['d']) {
        this.direction = value;
        return this;
    }
    setAngleOffset(value: IColorNote['a']) {
        this.angleOffset = value;
        return this;
    }
    setCustomData(value: typeof this.data.cd) {
        this.customData = value;
        return this;
    }
    deleteCustomData() {
        this.customData = {};
        return this;
    }
    removeCustomData(key: string) {
        delete this.customData[key];
        return this;
    }
    // FIXME: deal with customdata later
    addCustomData(object: Record<string, unknown>) {
        this.customData = { ...this.customData, object };
        return this;
    }

    /** Horizontally mirror note position and optional colour swap.
     * ```ts
     * note.mirror();
     * ```
     */
    mirror(flipColor = true) {
        this.posX = LINE_COUNT - 1 - this.posX;
        if (flipColor) {
            this.color = ((1 + this.color) % 2) as typeof this.color;
        }
        this.angleOffset = 0 - this.angleOffset;
        switch (this.direction) {
            case 2:
                this.direction = 3;
                break;
            case 3:
                this.direction = 2;
                break;
            case 6:
                this.direction = 7;
                break;
            case 7:
                this.direction = 6;
                break;
            case 4:
                this.direction = 5;
                break;
            case 5:
                this.direction = 4;
                break;
        }
        return this;
    }

    /** Swap note position with another note.
     * ```ts
     * note.swapPosition(noteSwap);
     * ```
     */
    swapPosition(toSwap: ColorNote) {
        const tempX = toSwap.posX;
        toSwap.posX = this.posX;
        this.posX = tempX;
        const tempY = toSwap.posY;
        toSwap.posY = this.posY;
        this.posY = tempY;
        return this;
    }

    /** Swap note rotation with another note.
     * ```ts
     * note.swapPosition(noteSwap);
     * ```
     */
    swapRotation(toSwap: ColorNote, mirrorAngle = true) {
        const tempD = toSwap.direction;
        toSwap.direction = this.direction;
        this.direction = tempD;
        const tempA = toSwap.angleOffset;
        toSwap.angleOffset = this.angleOffset;
        this.angleOffset = tempA;
        if (mirrorAngle) {
            toSwap.angleOffset = 0 - toSwap.angleOffset;
            this.angleOffset = 0 - this.angleOffset;
        }
        return this;
    }

    /** Get note and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const notePos = note.getPosition();
     * ```
     */
    getPosition(): [number, number] {
        // if (note._customData?._position) {
        //     return [note._customData._position[0], note._customData._position[1]];
        // }
        return [
            (this.posX <= -1000
                ? this.posX / 1000
                : this.posX >= 1000
                ? this.posX / 1000
                : this.posX) - 2,
            this.posY <= -1000
                ? this.posY / 1000
                : this.posY >= 1000
                ? this.posY / 1000
                : this.posY,
        ];
    }

    /** Get note and return standardised note angle.
     * ```ts
     * const noteAngle = note.getAngle(noteCompare);
     * ```
     */
    getAngle() {
        // if (this.customData?._cutDirection) {
        //     return this.customData._cutDirection > 0
        //         ? this.customData._cutDirection % 360
        //         : 360 + (this.customData._cutDirection % 360);
        // }
        if (this.direction >= 1000) {
            return Math.abs(((this.direction % 1000) % 360) - 360);
        }
        return (
            (NoteCutAngle[this.direction as keyof typeof NoteCutAngle] || 0) +
            this.angleOffset
        );
    }

    /** Get two notes and return the distance between two notes.
     * ```ts
     * const noteDistance = note.distance(noteCompare);
     * ```
     */
    getDistance(compareTo: ColorNote) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    }

    /** Check if note is red note.
     * ```ts
     * if (note.isRed()) {}
     * ```
     */
    isRed() {
        return this.color === 0;
    }

    /** Check if note is blue note.
     * ```ts
     * if (note.isBlue()) {}
     * ```
     */
    isBlue() {
        return this.color === 1;
    }

    /** Compare two notes and return if the notes is in vertical alignment.
     * ```ts
     * if (note.isVertical(noteCompare)) {}
     * ```
     */
    isVertical(compareTo?: ColorNote) {
        if (compareTo) {
            const [nX1] = this.getPosition();
            const [nX2] = compareTo.getPosition();
            const d = nX1 - nX2;
            return d > -0.001 && d < 0.001;
        }
        return (
            22.5 <= (Math.abs(this.getAngle()) % 180) + 90 &&
            (Math.abs(this.getAngle()) % 180) + 90 <= 67.5
        );
    }

    /** Compare two notes and return if the notes is in horizontal alignment.
     * ```ts
     * if (note.isHorizontal(noteCompare)) {}
     * ```
     */
    isHorizontal(compareTo?: ColorNote) {
        if (compareTo) {
            const [_, nY1] = this.getPosition();
            const [_2, nY2] = compareTo.getPosition();
            const d = nY1 - nY2;
            return d > -0.001 && d < 0.001;
        }
        return (
            22.5 <= (Math.abs(this.getAngle()) % 180) + 90 &&
            (Math.abs(this.getAngle()) % 180) + 90 <= 67.5
        );
    }

    /** Compare two notes and return if the notes is in diagonal alignment.
     * ```ts
     * if (note.isDiagonal(noteCompare)) {}
     * ```
     */
    isDiagonal(compareTo?: ColorNote) {
        if (compareTo) {
            const [nX1, nY1] = this.getPosition();
            const [nX2, nY2] = compareTo.getPosition();
            const dX = Math.abs(nX1 - nX2);
            const dY = Math.abs(nY1 - nY2);
            return dX === dY;
        }
        return (
            22.5 <= Math.abs(this.getAngle()) % 90 &&
            Math.abs(this.getAngle()) % 90 <= 67.5
        );
    }

    /** Compare two notes and return if the notes is an inline.
     * ```ts
     * if (note.isInline(noteCompare)) {}
     * ```
     */
    isInline(compareTo: ColorNote, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
    }

    /** Compare current note with the note ahead of it and return if the notes is a double.
     * ```ts
     * if (note.isDouble(notes, index)) {}
     * ```
     */
    isDouble(compareTo: ColorNote[], index: number, tolerance = 0.01) {
        for (let i = index, len = compareTo.length; i < len; i++) {
            if (
                compareTo[i].time < this.time + tolerance &&
                compareTo[i].color !== this.color
            ) {
                return true;
            }
            if (compareTo[i].time > this.time + tolerance) {
                return false;
            }
        }
        return false;
    }

    /** Compare two notes and return if the notes is adjacent.
     * ```ts
     * if (note.isAdjacent(noteCompare)) {}
     * ```
     */
    isAdjacent(compareTo: ColorNote) {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    }

    /** Compare two notes and return if the notes is a window.
     * ```ts
     * if (note.isWindow(noteCompare)) {}
     * ```
     */
    isWindow(compareTo: ColorNote, distance = 1.8) {
        return this.getDistance(compareTo) > distance;
    }

    /** Compare two notes and return if the notes is a slanted window.
     * ```ts
     * if (note.isSlantedWindow(noteCompare)) {}
     * ```
     */
    isSlantedWindow(compareTo: ColorNote) {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    }

    /** Check if the note intersect on swing path by angle and distance.
     * ```ts
     * if (note.isIntersect(noteCompare, [[20, 1.5]])) {}
     * ```
     */
    // a fkin abomination that's what this is
    isIntersect(
        compareTo: ColorNote,
        angleDistances: [number, number, number?][],
        ahead = false
    ): [boolean, boolean] {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const nA1 = this.getAngle();
        const nA2 = compareTo.getAngle();
        const angle = ahead ? 540 : 360;
        let resultN1 = false;
        if (this.direction !== 8) {
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
    }

    // TODO: update with new position/rotation system
    isEnd(prevNote: ColorNote, cd: number) {
        // fuck u and ur dot note stack
        if (this.direction === 8 && prevNote.direction === 8 && cd !== 8) {
            // if end note on right side
            if (this.posX > prevNote.posX) {
                if (cd === 5 || cd === 3 || cd === 7) {
                    return true;
                }
            }
            // if end note on left side
            if (this.posX < prevNote.posX) {
                if (cd === 6 || cd === 2 || cd === 4) {
                    return true;
                }
            }
            // if end note is above
            if (this.posY > prevNote.posY) {
                if (cd === 4 || cd === 0 || cd === 5) {
                    return true;
                }
            }
            // if end note is below
            if (this.posY < prevNote.posY) {
                if (cd === 6 || cd === 1 || cd === 7) {
                    return true;
                }
            }
        }
        // if end note on right side
        if (this.posX > prevNote.posX) {
            // check if end note is arrowed
            if (this.direction === 5 || this.direction === 3 || this.direction === 7) {
                return true;
            }
            // check if end note is dot and start arrow is pointing to it
            if (
                (prevNote.direction === 5 ||
                    prevNote.direction === 3 ||
                    prevNote.direction === 7) &&
                this.direction === 8
            ) {
                return true;
            }
        }
        // if end note on left side
        if (this.posX < prevNote.posX) {
            if (this.direction === 6 || this.direction === 2 || this.direction === 4) {
                return true;
            }
            if (
                (prevNote.direction === 6 ||
                    prevNote.direction === 2 ||
                    prevNote.direction === 4) &&
                this.direction === 8
            ) {
                return true;
            }
        }
        // if end note is above
        if (this.posY > prevNote.posY) {
            if (this.direction === 4 || this.direction === 0 || this.direction === 5) {
                return true;
            }
            if (
                (prevNote.direction === 4 ||
                    prevNote.direction === 0 ||
                    prevNote.direction === 5) &&
                this.direction === 8
            ) {
                return true;
            }
        }
        // if end note is below
        if (this.posY < prevNote.posY) {
            if (this.direction === 6 || this.direction === 1 || this.direction === 7) {
                return true;
            }
            if (
                (prevNote.direction === 6 ||
                    prevNote.direction === 1 ||
                    prevNote.direction === 7) &&
                this.direction === 8
            ) {
                return true;
            }
        }
        return false;
    }

    // TODO: update with new position/rotation system
    predictDirection(comparePrev: ColorNote): number {
        if (this.isEnd(comparePrev, 8)) {
            return this.direction === 8 ? comparePrev.direction : this.direction;
        }
        if (this.direction !== 8) {
            return this.direction;
        }
        if (this.time > comparePrev.time) {
            // if end note on right side
            if (this.posX > comparePrev.posX) {
                if (this.isHorizontal(comparePrev)) {
                    return 3;
                }
            }
            // if end note on left side
            if (this.posX < comparePrev.posX) {
                if (this.isHorizontal(comparePrev)) {
                    return 2;
                }
            }
            // if end note is above
            if (this.posY > comparePrev.posY) {
                if (this.isVertical(comparePrev)) {
                    return 0;
                }
                if (this.posX > comparePrev.posX) {
                    return 5;
                }
                if (this.posX < comparePrev.posX) {
                    return 4;
                }
            }
            // if end note is below
            if (this.posY < comparePrev.posY) {
                if (this.isVertical(comparePrev)) {
                    return 1;
                }
                if (this.posX > comparePrev.posX) {
                    return 7;
                }
                if (this.posX < comparePrev.posX) {
                    return 6;
                }
            }
        }
        return 8;
    }

    /** Check if note has Mapping Extensions properties.
     * ```ts
     * if (note.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return (
            this.posX > 3 ||
            this.posX < 0 ||
            this.posY > 2 ||
            this.posY < 0 ||
            (this.direction >= 1000 && this.direction <= 1360) ||
            (this.direction >= 2000 && this.direction <= 2360)
        );
    }

    /** Check if note has a valid cut direction.
     * ```ts
     * if (note.isValidDirection()) {}
     * ```
     */
    isValidDirection() {
        return this.direction >= 0 && this.direction <= 8;
    }

    /** Check if note is a valid, vanilla note.
     * ```ts
     * if (note.isValid()) {}
     * ```
     */
    isValid() {
        return !this.hasMappingExtensions() && this.isValidDirection();
    }

    /** Check the angle equality of the two notes.
     * ```ts
     * if (ColorNote.checkDirection(note1, note2, 45, true)) {}
     * ```
     * */
    static checkDirection(
        n1: ColorNote | number | null,
        n2: ColorNote | number | null,
        angleTol: number,
        equal: boolean
    ) {
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
    }
}

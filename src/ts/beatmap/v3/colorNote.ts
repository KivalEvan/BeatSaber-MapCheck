import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { LINE_COUNT, NoteDirectionAngle } from '../shared/constants';
import { ObjectReturnFn } from '../../types/utils';
import { BaseNote } from './baseNote';
import { IBaseNote } from '../../types/beatmap/v3/baseNote';
import { deepCopy } from '../../utils/misc';

/** Color note beatmap v3 class object. */
export class ColorNote extends BaseNote<IColorNote> {
    static default: ObjectReturnFn<Required<IColorNote>> = {
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        d: 0,
        a: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(colorNote: Required<IColorNote>) {
        super(colorNote);
    }

    static create(): ColorNote[];
    static create(...colorNotes: Partial<IColorNote>[]): ColorNote[];
    static create(...colorNotes: Partial<IColorNote>[]): ColorNote[] {
        const result: ColorNote[] = [];
        colorNotes?.forEach((n) =>
            result.push(
                new this({
                    b: n.b ?? ColorNote.default.b,
                    x: n.x ?? ColorNote.default.x,
                    y: n.y ?? ColorNote.default.y,
                    c: n.c ?? ColorNote.default.c,
                    d: n.d ?? ColorNote.default.d,
                    a: n.a ?? ColorNote.default.a,
                    customData: n.customData ?? ColorNote.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: ColorNote.default.b,
                x: ColorNote.default.x,
                y: ColorNote.default.y,
                c: ColorNote.default.c,
                d: ColorNote.default.d,
                a: ColorNote.default.a,
                customData: ColorNote.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IColorNote> {
        return {
            b: this.time,
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            a: this.angleOffset,
            customData: deepCopy(this.customData),
        };
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

    setColor(value: IColorNote['c']) {
        this.color = value;
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

    mirror(flipColor = true) {
        if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
        }
        if (this.customData.flip) {
            this.customData.flip[0] = -1 - this.customData.flip[0];
        }
        if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
                this.customData.animation.definitePosition.forEach((dp) => {
                    dp[0] = -dp[0];
                });
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
                this.customData.animation.offsetPosition.forEach((op) => {
                    op[0] = -op[0];
                });
            }
        }
        if (flipColor) {
            this.color = ((1 + this.color) % 2) as typeof this.color;
        }
        this.posX = LINE_COUNT - 1 - this.posX;
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

    /** Get note and return standardised note angle.
     * ```ts
     * const noteAngle = note.getAngle();
     * ```
     */
    getAngle(type?: 'vanilla' | 'me' | 'ne') {
        switch (type) {
            case 'vanilla':
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
            case 'me':
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
            /* falls through */
            case 'ne':
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
        }
    }

    getDistance(compareTo: BaseNote<IBaseNote>) {
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

    isVertical(compareTo?: BaseNote<IBaseNote>) {
        if (compareTo) {
            const [nX1] = this.getPosition();
            const [nX2] = compareTo.getPosition();
            const d = nX1 - nX2;
            return d > -0.001 && d < 0.001;
        }
        return 22.5 <= (Math.abs(this.getAngle()) % 180) + 90 && (Math.abs(this.getAngle()) % 180) + 90 <= 67.5;
    }

    isHorizontal(compareTo?: BaseNote<IBaseNote>) {
        if (compareTo) {
            const [_, nY1] = this.getPosition();
            const [_2, nY2] = compareTo.getPosition();
            const d = nY1 - nY2;
            return d > -0.001 && d < 0.001;
        }
        return 22.5 <= (Math.abs(this.getAngle()) % 180) + 90 && (Math.abs(this.getAngle()) % 180) + 90 <= 67.5;
    }

    isDiagonal(compareTo?: BaseNote<IBaseNote>) {
        if (compareTo) {
            const [nX1, nY1] = this.getPosition();
            const [nX2, nY2] = compareTo.getPosition();
            const dX = Math.abs(nX1 - nX2);
            const dY = Math.abs(nY1 - nY2);
            return dX === dY;
        }
        return 22.5 <= Math.abs(this.getAngle()) % 90 && Math.abs(this.getAngle()) % 90 <= 67.5;
    }

    isInline(compareTo: BaseNote<IBaseNote>, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
    }

    /** Compare current note with the note ahead of it and return if the notes is a double.
     * ```ts
     * if (note.isDouble(notes, index)) {}
     * ```
     */
    isDouble(compareTo: ColorNote, tolerance = 0.01) {
        return (
            compareTo.time > this.time - tolerance &&
            compareTo.time < this.time + tolerance &&
            this.color !== compareTo.color
        );
    }

    isAdjacent(compareTo: BaseNote<IBaseNote>) {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    }

    isWindow(compareTo: BaseNote<IBaseNote>, distance = 1.8) {
        return this.getDistance(compareTo) > distance;
    }

    isSlantedWindow(compareTo: BaseNote<IBaseNote>) {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    }

    /** Check if note has Chroma properties.
     * ```ts
     * if (note.hasChroma()) {}
     * ```
     */
    hasChroma = (): boolean => {
        return Array.isArray(this.customData.color) || typeof this.customData.spawnEffect === 'boolean';
    };

    /** Check if note has Noodle Extensions properties.
     * ```ts
     * if (note.hasNoodleExtensions()) {}
     * ```
     */
    // god i hate these
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData.animation) ||
            typeof this.customData.disableNoteGravity === 'boolean' ||
            typeof this.customData.disableNoteLook === 'boolean' ||
            Array.isArray(this.customData.flip) ||
            typeof this.customData.uninteractable === 'boolean' ||
            Array.isArray(this.customData.localRotation) ||
            typeof this.customData.noteJumpMovementSpeed === 'number' ||
            typeof this.customData.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData.coordinates) ||
            Array.isArray(this.customData.worldRotation) ||
            typeof this.customData.worldRotation === 'number' ||
            typeof this.customData.track === 'string'
        );
    };

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

    /** Check if note is valid & vanilla.
     * ```ts
     * if (note.isValid()) {}
     * ```
     */
    isValid() {
        return !this.hasMappingExtensions() && this.isValidDirection();
    }
}

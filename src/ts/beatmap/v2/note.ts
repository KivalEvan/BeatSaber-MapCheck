import { INote } from '../../types/beatmap/v2/note';
import { BeatmapObject } from './object';
import { ObjectToReturn } from '../../types/utils';
import { NoteCutAngle } from '../shared/constants';
import { deepCopy } from '../../utils/misc';

export class Note extends BeatmapObject<INote> {
    static default: ObjectToReturn<Required<INote>> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _cutDirection: 0,
        _customData: () => {
            return {};
        },
    };

    private constructor(data: Required<INote>) {
        super(data);
    }

    static create(): Note;
    static create(notes: Partial<INote>): Note;
    static create(...notes: Partial<INote>[]): Note[];
    static create(...notes: Partial<INote>[]): Note | Note[] {
        const result: Note[] = [];
        notes?.forEach((n) =>
            result.push(
                new Note({
                    _time: n._time ?? Note.default._time,
                    _lineIndex: n._lineIndex ?? Note.default._lineIndex,
                    _lineLayer: n._lineLayer ?? Note.default._lineLayer,
                    _type: n._type ?? Note.default._type,
                    _cutDirection: n._cutDirection ?? Note.default._cutDirection,
                    _customData: n._customData ?? Note.default._customData(),
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new Note({
            _time: Note.default._time,
            _lineIndex: Note.default._lineIndex,
            _lineLayer: Note.default._lineLayer,
            _type: Note.default._type,
            _cutDirection: Note.default._cutDirection,
            _customData: Note.default._customData(),
        });
    }

    toObject(): INote {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.lineIndex,
            _lineLayer: this.lineLayer,
            _cutDirection: this.cutDirection,
            _customData: deepCopy(this.customData),
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
    get lineIndex() {
        return this.data._lineIndex;
    }
    set lineIndex(value: INote['_lineIndex']) {
        this.data._lineIndex = value;
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
    get lineLayer() {
        return this.data._lineLayer;
    }
    set lineLayer(value: INote['_lineLayer']) {
        this.data._lineLayer = value;
    }

    /** Type `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * 3 -> Bomb
     * ```
     */
    get type() {
        return this.data._type;
    }
    set type(value: INote['_type']) {
        this.data._type = value;
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
    get cutDirection() {
        return this.data._cutDirection;
    }
    set cutDirection(value: INote['_cutDirection']) {
        this.data._cutDirection = value;
    }

    setLineIndex(value: INote['_lineIndex']) {
        this.lineIndex = value;
        return this;
    }
    setLineLayer(value: INote['_lineLayer']) {
        this.lineLayer = value;
        return this;
    }
    setType(value: INote['_type']) {
        this.type = value;
        return this;
    }
    setCutDirection(value: INote['_cutDirection']) {
        this.cutDirection = value;
        return this;
    }

    /** Check if note is a red or blue this.
     * ```ts
     * if (isNote(note)) {}
     * ```
     */
    isNote = (): boolean => {
        return this.type === 0 || this.type === 1;
    };

    /** Check if note is a bomb note
     * ```ts
     * if (isBomb(note)) {}
     * ```
     */
    isBomb = (): boolean => {
        return this.type === 3;
    };

    /** Get note and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const notePos = getPosition(note);
     * ```
     */
    getPosition = (): [number, number] => {
        if (this.customData?._position) {
            return [this.customData._position[0], this.customData._position[1]];
        }
        return [
            (this.lineIndex <= -1000
                ? this.lineIndex / 1000
                : this.lineIndex >= 1000
                ? this.lineIndex / 1000
                : this.lineIndex) - 2,
            this.lineLayer <= -1000
                ? this.lineLayer / 1000
                : this.lineLayer >= 1000
                ? this.lineLayer / 1000
                : this.lineLayer,
        ];
    };

    /** Get note and return standardised note angle.
     * ```ts
     * const noteAngle = getAngle(note);
     * ```
     */
    getAngle = (): number => {
        if (this.customData?._cutDirection) {
            return this.customData._cutDirection > 0
                ? this.customData._cutDirection % 360
                : 360 + (this.customData._cutDirection % 360);
        }
        if (this.cutDirection >= 1000) {
            return Math.abs(((this.cutDirection % 1000) % 360) - 360);
        }
        return NoteCutAngle[this.cutDirection] || 0;
    };

    /** Get two notes and return the distance between two notes.
     * ```ts
     * const noteDistance = distance(note1, note2);
     * ```
     */
    getDistance = (compareTo: Note): number => {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    };

    /** Compare two notes and return if the notes is in vertical alignment.
     * ```ts
     * if (isVertical(note1, note2)) {}
     * ```
     */
    isVertical = (compareTo: Note): boolean => {
        const [nX1] = this.getPosition();
        const [nX2] = compareTo.getPosition();
        const d = nX1 - nX2;
        return d > -0.001 && d < 0.001;
    };

    /** Compare two notes and return if the notes is in horizontal alignment.
     * ```ts
     * if (isHorizontal(note1, note2)) {}
     * ```
     */
    isHorizontal = (compareTo: Note): boolean => {
        const [_, nY1] = this.getPosition();
        const [_2, nY2] = compareTo.getPosition();
        const d = nY1 - nY2;
        return d > -0.001 && d < 0.001;
    };

    /** Compare two notes and return if the notes is in diagonal alignment.
     * ```ts
     * if (isDiagonal(note1, note2)) {}
     * ```
     */
    isDiagonal = (compareTo: Note): boolean => {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const dX = Math.abs(nX1 - nX2);
        const dY = Math.abs(nY1 - nY2);
        return dX === dY;
    };

    /** Compare two notes and return if the notes is an inline.
     * ```ts
     * if (isInline(note1, note2)) {}
     * ```
     */
    isInline = (compareTo: Note, lapping = 0.5): boolean => {
        return this.getDistance(compareTo) <= lapping;
    };

    /** Compare current note with the note ahead of it and return if the notes is a double.
     * ```ts
     * if (isDouble(note, notes, index)) {}
     * ```
     */
    isDouble = (notes: Note[], index: number): boolean => {
        for (let i = index, len = notes.length; i < len; i++) {
            if (notes[i].time < this.time + 0.01 && notes[i].type !== this.type) {
                return true;
            }
            if (notes[i].time > this.time + 0.01) {
                return false;
            }
        }
        return false;
    };

    /** Compare two notes and return if the notes is adjacent.
     * ```ts
     * if (isAdjacent(note1, note2)) {}
     * ```
     */
    isAdjacent = (compareTo: Note): boolean => {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    };

    /** Compare two notes and return if the notes is a window.
     * ```ts
     * if (isWindow(note1, note2)) {}
     * ```
     */
    isWindow = (compareTo: Note): boolean => {
        return this.getDistance(compareTo) > 1.8;
    };

    /** Compare two notes and return if the notes is a slanted window.
     * ```ts
     * if (isSlantedWindow(note1, note2)) {}
     * ```
     */
    isSlantedWindow = (compareTo: Note): boolean => {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    };

    /** Check if note has Chroma properties.
     * ```ts
     * if (hasChroma(note)) {}
     * ```
     */
    hasChroma = (): boolean => {
        return Array.isArray(this.customData?._color) || typeof this.customData?._disableSpawnEffect === 'boolean';
    };

    /** Check if note has Noodle Extensions properties.
     * ```ts
     * if (hasNoodleExtensions(note)) {}
     * ```
     */
    // god i hate these
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData?._animation) ||
            typeof this.customData?._cutDirection === 'number' ||
            typeof this.customData?._disableNoteGravity === 'boolean' ||
            typeof this.customData?._disableNoteLook === 'boolean' ||
            typeof this.customData?._fake === 'boolean' ||
            Array.isArray(this.customData?._flip) ||
            typeof this.customData?._interactable === 'boolean' ||
            Array.isArray(this.customData?._localRotation) ||
            typeof this.customData?._noteJumpMovementSpeed === 'number' ||
            typeof this.customData?._noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData?._position) ||
            Array.isArray(this.customData?._rotation) ||
            typeof this.customData?._track === 'string'
        );
    };

    /** Check if note has Mapping Extensions properties.
     * ```ts
     * if (hasMappingExtensions(note)) {}
     * ```
     */
    hasMappingExtensions = (): boolean => {
        return (
            this.cutDirection >= 1000 ||
            this.lineIndex > 3 ||
            this.lineIndex < 0 ||
            this.lineLayer > 2 ||
            this.lineLayer < 0
        );
    };

    /** Check if note has a valid cut direction.
     * ```ts
     * if (isValidDirection(note)) {}
     * ```
     */
    isValidDirection = (): boolean => {
        return this.cutDirection >= 0 && this.cutDirection <= 8;
    };

    /** Check if note is a valid, vanilla this.
     * ```ts
     * if (isValid(note)) {}
     * ```
     */
    isValid = (): boolean => {
        return !this.hasMappingExtensions() && this.isValidDirection();
    };
}

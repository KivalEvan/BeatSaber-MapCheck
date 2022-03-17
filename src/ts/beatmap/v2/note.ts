import { INote, NoteCount } from '../../types/beatmap/v2/note';
import { BeatPerMinute } from '../shared/bpm';
import { radToDeg, shortRotDistance } from '../../utils/math';
import { BeatmapObject } from './object';
import { ObjectToReturn } from '../../types/utils';
import { NoteCutAngle } from '../shared/constants';

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
                })
            )
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
            _customData: this.customData,
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

    get customData() {
        return this.data._customData;
    }
    set customData(value: typeof this.data._customData) {
        this.data._customData = value;
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
    setCustomData(value: typeof this.data._customData) {
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
        if (this.customData?.position) {
            return [this.customData.position[0], this.customData.position[1]];
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
        if (this.customData?.cutDirection) {
            return this.customData.cutDirection > 0
                ? this.customData.cutDirection % 360
                : 360 + (this.customData.cutDirection % 360);
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
    distance = (compareTo: Note): number => {
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
        return this.distance(compareTo) <= lapping;
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
        const d = this.distance(compareTo);
        return d > 0.499 && d < 1.001;
    };

    /** Compare two notes and return if the notes is a window.
     * ```ts
     * if (isWindow(note1, note2)) {}
     * ```
     */
    isWindow = (compareTo: Note): boolean => {
        return this.distance(compareTo) > 1.8;
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

    /** Check if the note intersect on swing path by angle and distance.
     * ```ts
     * if (isIntersect(note1, note2, [[20, 1.5]])) {}
     * ```
     */
    // a fkin abomination that's what this is
    isIntersect = (
        compareTo: Note,
        angleDistances: [number, number, number?][],
        ahead = false
    ): [boolean, boolean] => {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const nA1 = this.getAngle();
        const nA2 = compareTo.getAngle();
        const angle = ahead ? 540 : 360;
        let resultN1 = false;
        if (this.cutDirection !== 8) {
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
        if (compareTo.cutDirection !== 8) {
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
    isEnd = (prevNote: Note, cd: number): boolean => {
        // fuck u and ur dot note stack
        if (this.cutDirection === 8 && prevNote.cutDirection === 8 && cd !== 8) {
            // if end note on right side
            if (this.lineIndex > prevNote.lineIndex) {
                if (cd === 5 || cd === 3 || cd === 7) {
                    return true;
                }
            }
            // if end note on left side
            if (this.lineIndex < prevNote.lineIndex) {
                if (cd === 6 || cd === 2 || cd === 4) {
                    return true;
                }
            }
            // if end note is above
            if (this.lineLayer > prevNote.lineLayer) {
                if (cd === 4 || cd === 0 || cd === 5) {
                    return true;
                }
            }
            // if end note is below
            if (this.lineLayer < prevNote.lineLayer) {
                if (cd === 6 || cd === 1 || cd === 7) {
                    return true;
                }
            }
        }
        // if end note on right side
        if (this.lineIndex > prevNote.lineIndex) {
            // check if end note is arrowed
            if (
                this.cutDirection === 5 ||
                this.cutDirection === 3 ||
                this.cutDirection === 7
            ) {
                return true;
            }
            // check if end note is dot and start arrow is pointing to it
            if (
                (prevNote.cutDirection === 5 ||
                    prevNote.cutDirection === 3 ||
                    prevNote.cutDirection === 7) &&
                this.cutDirection === 8
            ) {
                return true;
            }
        }
        // if end note on left side
        if (this.lineIndex < prevNote.lineIndex) {
            if (
                this.cutDirection === 6 ||
                this.cutDirection === 2 ||
                this.cutDirection === 4
            ) {
                return true;
            }
            if (
                (prevNote.cutDirection === 6 ||
                    prevNote.cutDirection === 2 ||
                    prevNote.cutDirection === 4) &&
                this.cutDirection === 8
            ) {
                return true;
            }
        }
        // if end note is above
        if (this.lineLayer > prevNote.lineLayer) {
            if (
                this.cutDirection === 4 ||
                this.cutDirection === 0 ||
                this.cutDirection === 5
            ) {
                return true;
            }
            if (
                (prevNote.cutDirection === 4 ||
                    prevNote.cutDirection === 0 ||
                    prevNote.cutDirection === 5) &&
                this.cutDirection === 8
            ) {
                return true;
            }
        }
        // if end note is below
        if (this.lineLayer < prevNote.lineLayer) {
            if (
                this.cutDirection === 6 ||
                this.cutDirection === 1 ||
                this.cutDirection === 7
            ) {
                return true;
            }
            if (
                (prevNote.cutDirection === 6 ||
                    prevNote.cutDirection === 1 ||
                    prevNote.cutDirection === 7) &&
                this.cutDirection === 8
            ) {
                return true;
            }
        }
        return false;
    };

    // TODO: update with new position/rotation system
    predictDirection = (prevNote: Note): number => {
        if (this.isEnd(prevNote, 8)) {
            return this.cutDirection === 8 ? prevNote.cutDirection : this.cutDirection;
        }
        if (this.cutDirection !== 8) {
            return this.cutDirection;
        }
        if (this.time > prevNote.time) {
            // if end note on right side
            if (this.lineIndex > prevNote.lineIndex) {
                if (this.isHorizontal(prevNote)) {
                    return 3;
                }
            }
            // if end note on left side
            if (this.lineIndex < prevNote.lineIndex) {
                if (this.isHorizontal(prevNote)) {
                    return 2;
                }
            }
            // if end note is above
            if (this.lineLayer > prevNote.lineLayer) {
                if (this.isVertical(prevNote)) {
                    return 0;
                }
                if (this.lineIndex > prevNote.lineIndex) {
                    return 5;
                }
                if (this.lineIndex < prevNote.lineIndex) {
                    return 4;
                }
            }
            // if end note is below
            if (this.lineLayer < prevNote.lineLayer) {
                if (this.isVertical(prevNote)) {
                    return 1;
                }
                if (this.lineIndex > prevNote.lineIndex) {
                    return 7;
                }
                if (this.lineIndex < prevNote.lineIndex) {
                    return 6;
                }
            }
        }
        return 8;
    };

    /** Check if note has Chroma properties.
     * ```ts
     * if (hasChroma(note)) {}
     * ```
     */
    hasChroma = (): boolean => {
        return (
            Array.isArray(this.customData?.color) ||
            typeof this.customData?.disableSpawnEffect === 'boolean'
        );
    };

    /** Check if note has Noodle Extensions properties.
     * ```ts
     * if (hasNoodleExtensions(note)) {}
     * ```
     */
    // god i hate these
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData?.animation) ||
            typeof this.customData?.cutDirection === 'number' ||
            typeof this.customData?.disableNoteGravity === 'boolean' ||
            typeof this.customData?.disableNoteLook === 'boolean' ||
            typeof this.customData?.fake === 'boolean' ||
            Array.isArray(this.customData?.flip) ||
            typeof this.customData?.interactable === 'boolean' ||
            Array.isArray(this.customData?.localRotation) ||
            typeof this.customData?.noteJumpMovementSpeed === 'number' ||
            typeof this.customData?.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData?.position) ||
            Array.isArray(this.customData?.rotation) ||
            typeof this.customData?.track === 'string'
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

    /** Count number of red, blue, and bomb notes with their properties in given array and return a note count object.
     * ```ts
     * const list = count(notes);
     * console.log(list);
     * ```
     */
    count = (notes: Note[]): NoteCount => {
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
    };

    /** Count number of specified line index in a given array and return a counted number of line index.
     * ```ts
     * const indexCount = countIndex(notes, 0);
     * ```
     */
    countIndex = (notes: Note[], i: number): number => {
        return notes.filter((n) => n.lineIndex === i).length;
    };

    /** Count number of specified line layer in a given array and return a counted number of line layer.
     * ```ts
     * const layerCount = countLayer(notes, 0);
     * ```
     */
    countLayer = (notes: Note[], l: number): number => {
        return notes.filter((n) => n.lineLayer === l).length;
    };

    /** Count number of specified line index and line layer in a given array and return a counted number of line index and line layer.
     * ```ts
     * const indexLayerCount = countIndexLayer(notes, 0, 0);
     * ```
     */
    countIndexLayer = (notes: Note[], i: number, l: number): number => {
        return notes.filter((n) => n.lineIndex === i && n.lineLayer === l).length;
    };

    /** Count number of specified `_cutDirection` in a given array and return a counted number of `_cutDirection`.
     * ```ts
     * const cdCount = countDirection(notes, 0);
     * ```
     */
    countDirection = (notes: Note[], cd: number): number => {
        return notes.filter((n) => n.cutDirection === cd).length;
    };

    /** Count number of specified angle in a given array and return a counted number of angle.
     * ```ts
     * const angleCount = countAngle(notes, 0);
     * ```
     */
    countAngle = (notes: Note[], angle: number): number => {
        return notes.filter((n) => n.getAngle() === angle).length;
    };

    /** Calculate note per second.
     * ```ts
     * const nps = nps(notes, 10);
     * ```
     */
    nps = (notes: Note[], duration: number): number => {
        return duration ? notes.filter((n) => n.isNote()).length / duration : 0;
    };

    /** Calculate the peak by rolling average.
     * ```ts
     * const peakNPS = peak(notes, 10, BPM ?? 128);
     * ```
     */
    peak = (notes: Note[], beat: number, bpm: BeatPerMinute | number): number => {
        const nArr = notes.filter(this.isNote);
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

    /** Check the angle equality of the two notes.
     * @param {(Note|number|null)}  - First beatmap note, note `_cutDirection`, or null value
     * @param {(Note|number|null)} n2 - Second beatmap note, note `_cutDirection`, or null value
     * @param {number} angleTol - Angle tolerance
     * @param {boolean} equal - If it should check inner or outer angle
     * @returns {boolean} If condition is met
     */
    static checkDirection = (
        n1: Note | number | null,
        n2: Note | number | null,
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
            if (n1.cutDirection === 8) {
                return false;
            }
            nA1 = n1.getAngle();
        }
        if (typeof n2 === 'number') {
            nA2 = n2;
        } else {
            if (n2.cutDirection === 8) {
                return false;
            }
            nA2 = n2.getAngle();
        }
        return equal
            ? shortRotDistance(nA1, nA2, 360) <= angleTol
            : shortRotDistance(nA1, nA2, 360) >= angleTol;
    };
}

import { IBaseNote } from '../../types/beatmap/v3/baseNote';
import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { ObjectToReturn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { LINE_COUNT } from '../shared/constants';
import { BaseNote } from './baseNote';

/** Bomb note beatmap object. */
export class BombNote extends BaseNote<IBombNote> {
    static default: ObjectToReturn<Required<IBombNote>> = {
        b: 0,
        x: 0,
        y: 0,
        customData: () => {
            return {};
        },
    };

    private constructor(bombNote: Required<IBombNote>) {
        super(bombNote);
    }

    static create(): BombNote;
    static create(bombNotes: Partial<IBombNote>): BombNote;
    static create(...bombNotes: Partial<IBombNote>[]): BombNote[];
    static create(...bombNotes: Partial<IBombNote>[]): BombNote | BombNote[] {
        const result: BombNote[] = [];
        bombNotes?.forEach((bn) =>
            result.push(
                new BombNote({
                    b: bn.b ?? BombNote.default.b,
                    x: bn.x ?? BombNote.default.x,
                    y: bn.y ?? BombNote.default.y,
                    customData: bn.customData ?? BombNote.default.customData(),
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new BombNote({
            b: BombNote.default.b,
            x: BombNote.default.x,
            y: BombNote.default.y,
            customData: BombNote.default.customData(),
        });
    }

    toObject(): IBombNote {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
            customData: deepCopy(this.customData),
        };
    }

    mirror() {
        this.posX = LINE_COUNT - 1 - this.posX;
        return this;
    }

    getPosition(): [number, number] {
        // if (bomb._customData?._position) {
        //     return [bomb._customData._position[0], bomb._customData._position[1]];
        // }
        return [
            (this.posX <= -1000 ? this.posX / 1000 : this.posX >= 1000 ? this.posX / 1000 : this.posX) - 2,
            this.posY <= -1000 ? this.posY / 1000 : this.posY >= 1000 ? this.posY / 1000 : this.posY,
        ];
    }

    getDistance(compareTo: BaseNote<IBaseNote>) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    }

    isVertical(compareTo: BaseNote<IBaseNote>) {
        const [nX1] = this.getPosition();
        const [nX2] = compareTo.getPosition();
        const d = nX1 - nX2;
        return d > -0.001 && d < 0.001;
    }

    isHorizontal(compareTo: BaseNote<IBaseNote>) {
        const [_, nY1] = this.getPosition();
        const [_2, nY2] = compareTo.getPosition();
        const d = nY1 - nY2;
        return d > -0.001 && d < 0.001;
    }

    isDiagonal(compareTo: BaseNote<IBaseNote>) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const dX = Math.abs(nX1 - nX2);
        const dY = Math.abs(nY1 - nY2);
        return dX === dY;
    }

    isInline(compareTo: BaseNote<IBaseNote>, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
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
     * if (bomb.hasChroma()) {}
     * ```
     */
    hasChroma = (): boolean => {
        return Array.isArray(this.customData?.color) || typeof this.customData?.spawnEffect === 'boolean';
    };

    /** Check if note has Noodle Extensions properties.
     * ```ts
     * if (bomb.hasNoodleExtensions()) {}
     * ```
     */
    // god i hate these
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData?.animation) ||
            typeof this.customData?.disableNoteGravity === 'boolean' ||
            typeof this.customData?.disableNoteLook === 'boolean' ||
            Array.isArray(this.customData?.flip) ||
            typeof this.customData?.uninteractable === 'boolean' ||
            Array.isArray(this.customData?.localRotation) ||
            typeof this.customData?.noteJumpMovementSpeed === 'number' ||
            typeof this.customData?.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData?.coordinates) ||
            Array.isArray(this.customData?.worldRotation) ||
            typeof this.customData?.worldRotation === 'number' ||
            typeof this.customData?.track === 'string'
        );
    };

    /** Check if bomb has Mapping Extensions properties.
     * ```ts
     * if (bomb.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return this.posX > 3 || this.posX < 0 || this.posY > 2 || this.posY < 0;
    }

    /** Check if bomb is valid & vanilla.
     * ```ts
     * if (bomb.isValid()) {}
     * ```
     */
    isValid() {
        return !this.hasMappingExtensions();
    }
}

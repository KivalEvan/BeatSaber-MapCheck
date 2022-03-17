import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { BaseObject } from './baseObject';
import { LINE_COUNT } from '../shared/constants';

/** Bomb note beatmap object. */
export class BombNote extends BaseObject<IBombNote> {
    static default: Required<IBombNote> = {
        b: 0,
        x: 0,
        y: 0,
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
                })
            )
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
        });
    }

    toObject(): IBombNote {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
        };
    }

    /** Position x `<int>` of bomb.
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
    set posX(value: IBombNote['x']) {
        this.data.x = value;
    }

    /** Position y `<int>` of bomb.
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
    set posY(value: IBombNote['y']) {
        this.data.y = value;
    }

    setPosX(value: IBombNote['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IBombNote['y']) {
        this.posY = value;
        return this;
    }

    /** Check if bomb has Mapping Extensions properties.
     * ```ts
     * if (bomb.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return this.posX > 3 || this.posX < 0 || this.posY > 2 || this.posY < 0;
    }

    mirror() {
        this.posX = LINE_COUNT - 1 - this.posX;
        return this;
    }
}

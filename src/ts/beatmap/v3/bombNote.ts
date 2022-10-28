import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { deepCopy } from '../../utils/misc';
import { ObjectReturnFn } from '../../types/utils';
import { WrapBombNote } from '../wrapper/bombNote';

/** Bomb note beatmap v3 class object. */
export class BombNote extends WrapBombNote<Required<IBombNote>> {
    static default: ObjectReturnFn<Required<IBombNote>> = {
        b: 0,
        x: 0,
        y: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(bombNote: Required<IBombNote>) {
        super(bombNote);
    }

    static create(): BombNote[];
    static create(...bombNotes: Partial<IBombNote>[]): BombNote[];
    static create(...bombNotes: Partial<IBombNote>[]): BombNote[] {
        const result: BombNote[] = [];
        bombNotes?.forEach((bn) =>
            result.push(
                new this({
                    b: bn.b ?? BombNote.default.b,
                    x: bn.x ?? BombNote.default.x,
                    y: bn.y ?? BombNote.default.y,
                    customData: bn.customData ?? BombNote.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: BombNote.default.b,
                x: BombNote.default.x,
                y: BombNote.default.y,
                customData: BombNote.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IBombNote> {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IBombNote['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: IBombNote['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: IBombNote['y']) {
        this.data.y = value;
    }

    get customData(): NonNullable<IBombNote['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IBombNote['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<IBombNote['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: IBombNote['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }

    mirror() {
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
        return super.mirror();
    }

    isChroma(): boolean {
        return Array.isArray(this.customData.color) || typeof this.customData.spawnEffect === 'boolean';
    }

    // god i hate these
    isNoodleExtensions(): boolean {
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
    }
}

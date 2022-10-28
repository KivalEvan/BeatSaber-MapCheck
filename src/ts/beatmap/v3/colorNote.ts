import { IColorNote } from '../../types/beatmap/v3/colorNote';
import { NoteDirectionAngle } from '../shared/constants';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapColorNote } from '../wrapper/colorNote';

/** Color note beatmap v3 class object. */
export class ColorNote extends WrapColorNote<Required<IColorNote>> {
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

    get time() {
        return this.data.b;
    }
    set time(value: IColorNote['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: IColorNote['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: IColorNote['y']) {
        this.data.y = value;
    }

    get color() {
        return this.data.c;
    }
    set color(value: IColorNote['c']) {
        this.data.c = value;
    }

    get type() {
        return this.data.c;
    }
    set type(value: IColorNote['c']) {
        this.data.c = value;
    }

    get direction() {
        return this.data.d;
    }
    set direction(value: IColorNote['d']) {
        this.data.d = value;
    }

    get angleOffset() {
        return this.data.a;
    }
    set angleOffset(value: IColorNote['a']) {
        this.data.a = value;
    }

    get customData(): NonNullable<IColorNote['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IColorNote['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<IColorNote['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: IColorNote['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
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
        return super.mirror(flipColor);
    }

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

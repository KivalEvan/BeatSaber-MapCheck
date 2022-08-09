import { BaseSlider } from './baseSlider';
import { LINE_COUNT, NoteDirectionAngle } from '../shared/constants';
import { IBurstSlider } from '../../types/beatmap/v3/burstSlider';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';

/** Burst slider beatmap v3 class object.
 *
 * Also known as chain.
 */
export class BurstSlider extends BaseSlider<IBurstSlider> {
    static default: ObjectReturnFn<Required<IBurstSlider>> = {
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        d: 0,
        tb: 0,
        tx: 0,
        ty: 0,
        sc: 1,
        s: 1,
        customData: () => {
            return {};
        },
    };

    protected constructor(burstSlider: Required<IBurstSlider>) {
        super(burstSlider);
    }

    static create(): BurstSlider[];
    static create(...burstSliders: Partial<IBurstSlider>[]): BurstSlider[];
    static create(...burstSliders: Partial<IBurstSlider>[]): BurstSlider[] {
        const result: BurstSlider[] = [];
        burstSliders?.forEach((bs) =>
            result.push(
                new this({
                    b: bs.b ?? bs.tb ?? BurstSlider.default.b,
                    c: bs.c ?? BurstSlider.default.c,
                    x: bs.x ?? BurstSlider.default.x,
                    y: bs.y ?? BurstSlider.default.y,
                    d: bs.d ?? BurstSlider.default.d,
                    tb: bs.tb ?? bs.b ?? BurstSlider.default.tb,
                    tx: bs.tx ?? BurstSlider.default.tx,
                    ty: bs.ty ?? BurstSlider.default.ty,
                    sc: bs.sc ?? BurstSlider.default.sc,
                    s: bs.s ?? BurstSlider.default.s,
                    customData: bs.customData ?? BurstSlider.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: BurstSlider.default.b,
                c: BurstSlider.default.c,
                x: BurstSlider.default.x,
                y: BurstSlider.default.y,
                d: BurstSlider.default.d,
                tb: BurstSlider.default.tb,
                tx: BurstSlider.default.tx,
                ty: BurstSlider.default.ty,
                sc: BurstSlider.default.sc,
                s: BurstSlider.default.s,
                customData: BurstSlider.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IBurstSlider> {
        return {
            b: this.time,
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            tb: this.tailTime,
            tx: this.tailPosX,
            ty: this.tailPosY,
            sc: this.sliceCount,
            s: this.squish,
            customData: deepCopy(this.customData),
        };
    }

    /** Slice count or element `<int>` in burst slider.
     *
     * **NOTE:** Must be more than `0`, the head counts as `1`.
     */
    get sliceCount() {
        return this.data.sc;
    }
    set sliceCount(value: IBurstSlider['sc']) {
        this.data.sc = value;
    }

    /** Length multiplier `<float>` of element in burst slider.
     * ```ts
     * 1 -> Normal length
     * 0.5 -> Half length
     * 0.25 -> Quarter length
     * ```
     * **WARNING:** Value `0` will crash the game.
     */
    get squish() {
        return this.data.s;
    }
    set squish(value: IBurstSlider['s']) {
        this.data.s = value;
    }

    setSliceCount(value: IBurstSlider['sc']) {
        this.sliceCount = value;
        return this;
    }
    setSquish(value: IBurstSlider['s']) {
        this.squish = value;
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
        this.posX = LINE_COUNT - 1 - this.posX;
        this.tailPosX = LINE_COUNT - 1 - this.tailPosX;
        if (flipColor) {
            this.color = ((1 + this.color) % 2) as typeof this.color;
        }
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

    /** Get chain and return standardised note angle.
     * ```ts
     * const chainAngle = chain.getAngle();
     * ```
     */
    getAngle(type?: 'vanilla' | 'me' | 'ne') {
        switch (type) {
            case 'vanilla':
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
            case 'me':
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
            /* falls through */
            case 'ne':
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
        }
    }

    /** Check if burst slider has Mapping Extensions properties.
     * ```ts
     * if (burstSlider.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return (
            this.posY > 2 ||
            this.posY < 0 ||
            this.posX <= -1000 ||
            this.posX >= 1000 ||
            (this.direction >= 1000 && this.direction <= 1360)
        );
    }

    /** Check if burst slider is valid & vanilla.
     * ```ts
     * if (burstSlider.isValid()) {}
     * ```
     */
    isValid() {
        return (
            !(
                this.hasMappingExtensions() ||
                this.isInverse() ||
                this.posX < 0 ||
                this.posX > 3 ||
                this.tailPosX < 0 ||
                this.tailPosX > 3
            ) && !(this.posX === this.tailPosX && this.posY === this.tailPosY)
        );
    }
}

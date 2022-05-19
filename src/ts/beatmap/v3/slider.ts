import { BaseSlider } from './baseSlider';
import { LINE_COUNT, NoteCutAngle } from '../shared/constants';
import { ISlider } from '../../types/beatmap/v3/slider';
import { deepCopy } from '../../utils/misc';
import { ObjectToReturn } from '../../types/utils';

/** Slider beatmap object.
 *
 * Also known as arc.
 */
export class Slider extends BaseSlider<ISlider> {
    static default: ObjectToReturn<Required<ISlider>> = {
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        d: 0,
        mu: 0.5,
        tb: 0,
        tx: 0,
        ty: 0,
        tc: 0,
        tmu: 0.5,
        m: 1,
        customData: () => {
            return {};
        },
    };

    private constructor(slider: Required<ISlider>) {
        super(slider);
    }

    static create(): Slider;
    static create(sliders: Partial<ISlider>): Slider;
    static create(...sliders: Partial<ISlider>[]): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider | Slider[] {
        const result: Slider[] = [];
        sliders?.forEach((s) =>
            result.push(
                new Slider({
                    b: s.b ?? Slider.default.b,
                    c: s.c ?? Slider.default.c,
                    x: s.x ?? Slider.default.x,
                    y: s.y ?? Slider.default.y,
                    d: s.d ?? Slider.default.d,
                    mu: s.mu ?? Slider.default.mu,
                    tb: s.tb ?? Slider.default.tb,
                    tx: s.tx ?? Slider.default.tx,
                    ty: s.ty ?? Slider.default.ty,
                    tc: s.tc ?? Slider.default.tc,
                    tmu: s.tmu ?? Slider.default.tmu,
                    m: s.m ?? Slider.default.m,
                    customData: s.customData ?? Slider.default.customData(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new Slider({
            b: Slider.default.b,
            c: Slider.default.c,
            x: Slider.default.x,
            y: Slider.default.y,
            d: Slider.default.d,
            mu: Slider.default.mu,
            tb: Slider.default.tb,
            tx: Slider.default.tx,
            ty: Slider.default.ty,
            tc: Slider.default.tc,
            tmu: Slider.default.tmu,
            m: Slider.default.m,
            customData: Slider.default.customData(),
        });
    }

    toObject(): ISlider {
        return {
            b: this.time,
            c: this.color,
            x: this.posX,
            y: this.posY,
            d: this.direction,
            mu: this.lengthMultiplier,
            tb: this.tailTime,
            tx: this.tailPosX,
            ty: this.tailPosY,
            tc: this.tailDirection,
            tmu: this.tailLengthMultiplier,
            m: this.midAnchor,
            customData: deepCopy(this.customData),
        };
    }

    /** Head control point length multiplier `<float>` of slider.
     * ```ts
     * 0 -> Flat Start
     * 1 -> Curved Start
     * ```
     * ---
     * Range: `0-1`
     */
    get lengthMultiplier() {
        return this.data.mu;
    }
    set lengthMultiplier(value: ISlider['mu']) {
        this.data.mu = value;
    }

    /** Tail control point length multiplier `<float>` of slider.
     * ```ts
     * 0 -> Flat End
     * 1 -> Curved End
     * ```
     * ---
     * Range: `0-1`
     */
    get tailLengthMultiplier() {
        return this.data.tmu;
    }
    set tailLengthMultiplier(value: ISlider['tmu']) {
        this.data.tmu = value;
    }

    /** Tail cut direction `<int>` of slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended, assumes down-directional.
     */
    get tailDirection() {
        return this.data.tc;
    }
    set tailDirection(value: ISlider['tc']) {
        this.data.tc = value;
    }

    /** Mid anchor mode `<int>` of slider.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    get midAnchor() {
        return this.data.m;
    }
    set midAnchor(value: ISlider['m']) {
        this.data.m = value;
    }

    setLengthMultiplier(value: ISlider['mu']) {
        this.lengthMultiplier = value;
        return this;
    }
    setTailLengthMultiplier(value: ISlider['tmu']) {
        this.tailLengthMultiplier = value;
        return this;
    }
    setTailDirection(value: ISlider['tc']) {
        this.tailDirection = value;
        return this;
    }
    setMidAnchor(value: ISlider['m']) {
        this.midAnchor = value;
        return this;
    }

    mirror(flipColor = true) {
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
        switch (this.tailDirection) {
            case 2:
                this.tailDirection = 3;
                break;
            case 3:
                this.tailDirection = 2;
                break;
            case 6:
                this.tailDirection = 7;
                break;
            case 7:
                this.tailDirection = 6;
                break;
            case 4:
                this.tailDirection = 5;
                break;
            case 5:
                this.tailDirection = 4;
                break;
        }
        if (this.midAnchor) {
            this.midAnchor = this.midAnchor === 1 ? 2 : 1;
        }
        return this;
    }

    /** Get and return standardised note angle.
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
        return NoteCutAngle[this.direction as keyof typeof NoteCutAngle] || 0;
    }

    /** Check if slider has Mapping Extensions properties.
     * ```ts
     * if (slider.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return (
            this.posY > 2 ||
            this.posY < 0 ||
            this.posX <= -1000 ||
            this.posX >= 1000 ||
            (this.direction >= 1000 && this.direction <= 1360) ||
            (this.tailDirection >= 1000 && this.tailDirection <= 1360)
        );
    }

    /** Check if slider is valid & vanilla.
     * ```ts
     * if (slider.isValid()) {}
     * ```
     */
    isValid() {
        return !(this.hasMappingExtensions() || this.isInverse());
    }
}

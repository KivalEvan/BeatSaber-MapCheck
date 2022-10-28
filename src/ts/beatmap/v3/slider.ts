import { ISlider } from '../../types/beatmap/v3/slider';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapSlider } from '../wrapper/slider';

/** Slider beatmap v3 class object.
 *
 * Also known as arc.
 */
export class Slider extends WrapSlider<Required<ISlider>> {
    static default: ObjectReturnFn<Required<ISlider>> = {
        b: 0,
        c: 0,
        x: 0,
        y: 0,
        d: 0,
        mu: 1,
        tb: 0,
        tx: 0,
        ty: 0,
        tc: 0,
        tmu: 1,
        m: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(slider: Required<ISlider>) {
        super(slider);
    }

    static create(): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[] {
        const result: Slider[] = [];
        sliders?.forEach((s) =>
            result.push(
                new this({
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
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
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
            }),
        ];
    }

    toJSON(): Required<ISlider> {
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

    get time() {
        return this.data.b;
    }
    set time(value: ISlider['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: ISlider['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: ISlider['y']) {
        this.data.y = value;
    }

    get color() {
        return this.data.c;
    }
    set color(value: ISlider['c']) {
        this.data.c = value;
    }

    get direction() {
        return this.data.d;
    }
    set direction(value: ISlider['d']) {
        this.data.d = value;
    }

    get lengthMultiplier() {
        return this.data.mu;
    }
    set lengthMultiplier(value: ISlider['mu']) {
        this.data.mu = value;
    }

    get tailTime() {
        return this.data.tb;
    }
    set tailTime(value: ISlider['tb']) {
        this.data.tb = value;
    }

    get tailPosX() {
        return this.data.tx;
    }
    set tailPosX(value: ISlider['tx']) {
        this.data.tx = value;
    }

    get tailPosY() {
        return this.data.ty;
    }
    set tailPosY(value: ISlider['ty']) {
        this.data.ty = value;
    }

    get tailDirection() {
        return this.data.tc;
    }
    set tailDirection(value: ISlider['tc']) {
        this.data.tc = value;
    }

    get tailLengthMultiplier() {
        return this.data.tmu;
    }
    set tailLengthMultiplier(value: ISlider['tmu']) {
        this.data.tmu = value;
    }

    get midAnchor() {
        return this.data.m;
    }
    set midAnchor(value: ISlider['m']) {
        this.data.m = value;
    }

    get customData(): NonNullable<ISlider['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ISlider['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<ISlider['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ISlider['customData']): this {
        this.customData = { ...this.customData, object };
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

    getTailPosition(type?: 'vanilla' | 'me' | 'ne'): [number, number] {
        switch (type) {
            case 'ne':
                if (this.customData.tailCoordinates) {
                    return [this.customData.tailCoordinates[0], this.customData.tailCoordinates[1]];
                }
                return [this.tailPosX, this.tailPosY];
            default:
                if (this.customData.tailCoordinates) {
                    return [this.customData.tailCoordinates[0], this.customData.tailCoordinates[1]];
                }
                return super.getTailPosition(type);
        }
    }
}

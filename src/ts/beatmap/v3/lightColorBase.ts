import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { Serializable } from '../shared/serializable';

/** Light color for new lighting system. */
export class LightColorBase extends Serializable<ILightColorBase> {
    static default: Required<ILightColorBase> = {
        b: 0,
        i: 0,
        c: 0,
        s: 1,
        f: 0,
    };

    private constructor(lightColorBase: Required<ILightColorBase>) {
        super(lightColorBase);
    }

    static create(): LightColorBase;
    static create(lightColors: Partial<ILightColorBase>): LightColorBase;
    static create(...lightColors: Partial<ILightColorBase>[]): LightColorBase[];
    static create(
        ...lightColors: Partial<ILightColorBase>[]
    ): LightColorBase | LightColorBase[] {
        const result: LightColorBase[] = [];
        lightColors?.forEach((lc) =>
            result.push(
                new LightColorBase({
                    b: lc.b ?? LightColorBase.default.b,
                    i: lc.i ?? LightColorBase.default.i,
                    c: lc.c ?? LightColorBase.default.c,
                    s: lc.s ?? LightColorBase.default.s,
                    f: lc.f ?? LightColorBase.default.f,
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new LightColorBase({
            b: LightColorBase.default.b,
            i: LightColorBase.default.i,
            c: LightColorBase.default.c,
            s: LightColorBase.default.s,
            f: LightColorBase.default.f,
        });
    }

    toObject(): ILightColorBase {
        return {
            b: this.time,
            i: this.transition,
            c: this.color,
            s: this.brightness,
            f: this.frequency,
        };
    }

    /** Relative beat time `<float>` to event box group. */
    get time() {
        return this.data.b;
    }
    set time(value: ILightColorBase['b']) {
        this.data.b = value;
    }

    /** Transition type `<int>` of base light color.
     * ```ts
     * 0 -> Instant
     * 1 -> Interpolate
     * 2 -> Extend
     * ```
     */
    get transition() {
        return this.data.i;
    }
    set transition(value: ILightColorBase['i']) {
        this.data.i = value;
    }

    /** Color `<int>` of base light color.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * 2 -> White
     * ```
     */
    get color() {
        return this.data.c;
    }
    set color(value: ILightColorBase['c']) {
        this.data.c = value;
    }

    /** Brightness `<float>` of base light color.
     *
     * Range: `0-1` (0% to 100%), can be more than 1.
     */
    get brightness() {
        return this.data.s;
    }
    set brightness(value: ILightColorBase['s']) {
        this.data.s = value;
    }

    /** Frequency `<int>` of base light color.
     *
     * Blinking frequency in beat time of the event, `0` is static.
     */
    get frequency() {
        return this.data.f;
    }
    set frequency(value: ILightColorBase['f']) {
        this.data.f = value;
    }
}

import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { EventBox } from './eventBox';
import { IndexFilter } from './indexFilter';
import { LightColorBase } from './lightColorBase';

/** Light color event box beatmap v3 class object. */
export class LightColorEventBox extends EventBox<ILightColorEventBox> {
    static default: ObjectReturnFn<Required<ILightColorEventBox>> = {
        f: () => {
            return {
                f: IndexFilter.default.f,
                p: IndexFilter.default.p,
                t: IndexFilter.default.t,
                r: IndexFilter.default.r,
            };
        },
        w: 0,
        d: 1,
        r: 0,
        t: 1,
        b: 0,
        e: () => [],
    };

    private e: LightColorBase[];
    protected constructor(lightColorEventBox: Required<ILightColorEventBox>) {
        super(lightColorEventBox);
        this.e = lightColorEventBox.e.map((e) => LightColorBase.create(e)[0]);
        const lastTime = Math.max(...this.e.map((e) => e.time));
        if (this.beatDistributionType === 2) {
            this.beatDistribution = this.beatDistribution < lastTime ? lastTime : this.beatDistribution;
        }
    }

    static create(): LightColorEventBox[];
    static create(...eventBoxes: DeepPartial<ILightColorEventBox>[]): LightColorEventBox[];
    static create(...eventBoxes: DeepPartial<ILightColorEventBox>[]): LightColorEventBox[] {
        const result: LightColorEventBox[] = [];
        eventBoxes?.forEach((eb) =>
            result.push(
                new this({
                    f: (eb as Required<ILightColorEventBox>).f ?? LightColorEventBox.default.f(),
                    w: eb.w ?? LightColorEventBox.default.w,
                    d: eb.d ?? LightColorEventBox.default.d,
                    r: eb.r ?? LightColorEventBox.default.r,
                    t: eb.t ?? LightColorEventBox.default.t,
                    b: eb.b ?? LightColorEventBox.default.b,
                    e: (eb as Required<ILightColorEventBox>).e ?? LightColorEventBox.default.e(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                f: LightColorEventBox.default.f(),
                w: LightColorEventBox.default.w,
                d: LightColorEventBox.default.d,
                r: LightColorEventBox.default.r,
                t: LightColorEventBox.default.t,
                b: LightColorEventBox.default.b,
                e: LightColorEventBox.default.e(),
            }),
        ];
    }

    toJSON(): ILightColorEventBox {
        return {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            r: this.brightnessDistribution,
            t: this.brightnessDistributionType,
            b: this.affectFirst,
            e: this.events.map((e) => e.toJSON()),
        };
    }

    /** Brightness distribution `<float>` of light color event box.
     *
     * Range: `0-1` (0% to 100%), can be more than 1.
     */
    get brightnessDistribution() {
        return this.data.r;
    }
    set brightnessDistribution(value: ILightColorEventBox['r']) {
        this.data.r = value;
    }

    /** Brightness distribution type `<int>` of light color event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    get brightnessDistributionType() {
        return this.data.t;
    }
    set brightnessDistributionType(value: ILightColorEventBox['t']) {
        this.data.t = value;
    }

    /** Brigthness distribution should affect first event `<int>` of light color event box. */
    get affectFirst(): ILightColorEventBox['b'] {
        return this.data.b;
    }
    set affectFirst(value: ILightColorEventBox['b'] | boolean) {
        this.data.b = value ? 1 : 0;
    }

    /** Light color base data list. */
    get events() {
        return this.e;
    }
    set events(value: LightColorBase[]) {
        this.e = value;
    }
}

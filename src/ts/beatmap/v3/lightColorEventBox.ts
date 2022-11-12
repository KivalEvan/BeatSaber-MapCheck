import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { DeepPartial, DeepPartialWrapper, ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorEventBox } from '../wrapper/lightColorEventBox';
import { IndexFilter } from './indexFilter';
import { LightColorBase } from './lightColorBase';

/** Light color event box beatmap v3 class object. */
export class LightColorEventBox extends WrapLightColorEventBox<
    Required<ILightColorEventBox>,
    Required<ILightColorBase>,
    Required<IIndexFilter>
> {
    static default: ObjectReturnFn<Required<ILightColorEventBox>> = {
        f: () => {
            return {
                f: IndexFilter.default.f,
                p: IndexFilter.default.p,
                t: IndexFilter.default.t,
                r: IndexFilter.default.r,
                c: IndexFilter.default.c,
                n: IndexFilter.default.n,
                s: IndexFilter.default.s,
                l: IndexFilter.default.l,
                d: IndexFilter.default.d,
            };
        },
        w: 0,
        d: 1,
        r: 0,
        t: 1,
        b: 0,
        i: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    private _f: IndexFilter;
    private _e: LightColorBase[];
    protected constructor(lightColorEventBox: Required<ILightColorEventBox>) {
        super(lightColorEventBox);
        this._f = IndexFilter.create(lightColorEventBox.f);
        this._e = lightColorEventBox.e.map((e) => LightColorBase.create(e)[0]);
        const lastTime = Math.max(...this._e.map((e) => e.time));
        if (this.beatDistributionType === 2) {
            this.beatDistribution = this.beatDistribution < lastTime ? lastTime : this.beatDistribution;
        }
    }

    static create(): LightColorEventBox[];
    static create(
        ...eventBoxes: DeepPartialWrapper<
            IWrapLightColorEventBox<Required<ILightColorEventBox>, Required<ILightColorBase>, Required<IIndexFilter>>
        >[]
    ): LightColorEventBox[];
    static create(...eventBoxes: DeepPartial<ILightColorEventBox>[]): LightColorEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightColorEventBox> &
            DeepPartialWrapper<
                IWrapLightColorEventBox<
                    Required<ILightColorEventBox>,
                    Required<ILightColorBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightColorEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightColorEventBox> &
            DeepPartialWrapper<
                IWrapLightColorEventBox<
                    Required<ILightColorEventBox>,
                    Required<ILightColorBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightColorEventBox[] {
        const result: LightColorEventBox[] = [];
        eventBoxes?.forEach((eb) =>
            result.push(
                new this({
                    f:
                        (eb.filter as IIndexFilter) ??
                        (eb as Required<ILightColorEventBox>).f ??
                        LightColorEventBox.default.f(),
                    w: eb.beatDistribution ?? eb.w ?? LightColorEventBox.default.w,
                    d: eb.beatDistributionType ?? eb.d ?? LightColorEventBox.default.d,
                    r: eb.brightnessDistribution ?? eb.r ?? LightColorEventBox.default.r,
                    t: eb.brightnessDistributionType ?? eb.t ?? LightColorEventBox.default.t,
                    b: eb.affectFirst ?? eb.b ?? LightColorEventBox.default.b,
                    i: eb.easing ?? eb.i ?? LightColorEventBox.default.i,
                    e:
                        (eb.events as ILightColorBase[]) ??
                        (eb as Required<ILightColorEventBox>).e ??
                        LightColorEventBox.default.e(),
                    customData: eb.customData ?? LightColorEventBox.default.customData(),
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
                i: LightColorEventBox.default.i,
                e: LightColorEventBox.default.e(),
                customData: LightColorEventBox.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightColorEventBox> {
        return {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            r: this.brightnessDistribution,
            t: this.brightnessDistributionType,
            b: this.affectFirst,
            i: this.easing,
            e: this.events.map((e) => e.toJSON()),
            customData: deepCopy(this.customData),
        };
    }

    get filter() {
        return this._f;
    }
    set filter(value: IndexFilter) {
        this._f = value;
    }

    get beatDistribution() {
        return this.data.w;
    }
    set beatDistribution(value: ILightColorEventBox['w']) {
        this.data.w = value;
    }

    get beatDistributionType() {
        return this.data.d;
    }
    set beatDistributionType(value: ILightColorEventBox['d']) {
        this.data.d = value;
    }

    get brightnessDistribution() {
        return this.data.r;
    }
    set brightnessDistribution(value: ILightColorEventBox['r']) {
        this.data.r = value;
    }

    get brightnessDistributionType() {
        return this.data.t;
    }
    set brightnessDistributionType(value: ILightColorEventBox['t']) {
        this.data.t = value;
    }

    get affectFirst(): ILightColorEventBox['b'] {
        return this.data.b;
    }
    set affectFirst(value: ILightColorEventBox['b'] | boolean) {
        this.data.b = value ? 1 : 0;
    }

    get easing() {
        return this.data.i;
    }
    set easing(value: ILightColorEventBox['i']) {
        this.data.i = value;
    }

    get events(): LightColorBase[] {
        return this._e;
    }
    set events(value: LightColorBase[]) {
        this._e = value;
    }

    get customData(): NonNullable<ILightColorEventBox['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightColorEventBox['customData']>) {
        this.data.customData = value;
    }

    setEvents(value: LightColorBase[]): this {
        this.events = value;
        return this;
    }
}

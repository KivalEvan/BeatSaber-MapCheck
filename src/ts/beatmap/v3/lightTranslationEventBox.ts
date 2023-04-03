import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { IWrapLightTranslationEventBoxAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBox';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightTranslationEventBox } from '../wrapper/lightTranslationEventBox';
import { IndexFilter } from './indexFilter';
import { LightTranslationBase } from './lightTranslationBase';

/** Light translation event box beatmap v3 class object. */
export class LightTranslationEventBox extends WrapLightTranslationEventBox<
    Required<ILightTranslationEventBox>,
    Required<ILightTranslationBase>,
    Required<IIndexFilter>
> {
    static default: ObjectReturnFn<Required<ILightTranslationEventBox>> = {
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
        s: 0,
        t: 1,
        a: 0,
        r: 0,
        b: 0,
        i: 0,
        l: () => [],
        customData: () => {
            return {};
        },
    };

    private _f: IndexFilter;
    private _l: LightTranslationBase[];
    protected constructor(lightTranslationEventBox: Required<ILightTranslationEventBox>) {
        super(lightTranslationEventBox);
        this._f = IndexFilter.create(lightTranslationEventBox.f);
        this._l = lightTranslationEventBox.l.map((l) => LightTranslationBase.create(l)[0]);
    }

    static create(): LightTranslationEventBox[];
    static create(
        ...eventBoxes: DeepPartial<
            IWrapLightTranslationEventBoxAttribute<
                Required<ILightTranslationEventBox>,
                Required<ILightTranslationBase>,
                Required<IIndexFilter>
            >
        >[]
    ): LightTranslationEventBox[];
    static create(
        ...eventBoxes: DeepPartial<ILightTranslationEventBox>[]
    ): LightTranslationEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    Required<ILightTranslationEventBox>,
                    Required<ILightTranslationBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightTranslationEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    Required<ILightTranslationEventBox>,
                    Required<ILightTranslationBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightTranslationEventBox[] {
        const result: LightTranslationEventBox[] = [];
        eventBoxes?.forEach((eb) =>
            result.push(
                new this({
                    f:
                        (eb.filter as IIndexFilter) ??
                        (eb as Required<ILightTranslationEventBox>).f ??
                        LightTranslationEventBox.default.f(),
                    w: eb.beatDistribution ?? eb.w ?? LightTranslationEventBox.default.w,
                    d: eb.beatDistributionType ?? eb.d ?? LightTranslationEventBox.default.d,
                    s: eb.translationDistribution ?? eb.s ?? LightTranslationEventBox.default.s,
                    t: eb.translationDistributionType ?? eb.t ?? LightTranslationEventBox.default.t,
                    a: eb.axis ?? eb.a ?? LightTranslationEventBox.default.a,
                    r: eb.flip ?? eb.r ?? LightTranslationEventBox.default.r,
                    b: eb.affectFirst ?? eb.b ?? LightTranslationEventBox.default.b,
                    i: eb.easing ?? eb.i ?? LightTranslationEventBox.default.i,
                    l:
                        (eb.events as ILightTranslationBase[]) ??
                        (eb as Required<ILightTranslationEventBox>).l ??
                        LightTranslationEventBox.default.l(),
                    customData: eb.customData ?? LightTranslationEventBox.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                f: LightTranslationEventBox.default.f(),
                w: LightTranslationEventBox.default.w,
                d: LightTranslationEventBox.default.d,
                s: LightTranslationEventBox.default.s,
                t: LightTranslationEventBox.default.t,
                a: LightTranslationEventBox.default.a,
                r: LightTranslationEventBox.default.r,
                b: LightTranslationEventBox.default.b,
                i: LightTranslationEventBox.default.i,
                l: LightTranslationEventBox.default.l(),
                customData: LightTranslationEventBox.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightTranslationEventBox> {
        return {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.translationDistribution,
            t: this.translationDistributionType,
            a: this.axis,
            r: this.flip,
            b: this.affectFirst,
            i: this.easing,
            l: this.events.map((l) => l.toJSON()),
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
    set beatDistribution(value: ILightTranslationEventBox['w']) {
        this.data.w = value;
    }

    get beatDistributionType() {
        return this.data.d;
    }
    set beatDistributionType(value: ILightTranslationEventBox['d']) {
        this.data.d = value;
    }

    get translationDistribution() {
        return this.data.s;
    }
    set translationDistribution(value: ILightTranslationEventBox['s']) {
        this.data.s = value;
    }

    get translationDistributionType() {
        return this.data.t;
    }
    set translationDistributionType(value: ILightTranslationEventBox['t']) {
        this.data.t = value;
    }

    get axis() {
        return this.data.a;
    }
    set axis(value: ILightTranslationEventBox['a']) {
        this.data.a = value;
    }

    get flip(): ILightTranslationEventBox['r'] {
        return this.data.r;
    }
    set flip(value: ILightTranslationEventBox['r'] | boolean) {
        this.data.r = value ? 1 : 0;
    }

    get affectFirst(): ILightTranslationEventBox['b'] {
        return this.data.b;
    }
    set affectFirst(value: ILightTranslationEventBox['b'] | boolean) {
        this.data.b = value ? 1 : 0;
    }

    get easing() {
        return this.data.i;
    }
    set easing(value: ILightTranslationEventBox['i']) {
        this.data.i = value;
    }

    get events(): LightTranslationBase[] {
        return this._l;
    }
    set events(value: LightTranslationBase[]) {
        this._l = value;
    }

    get customData(): NonNullable<ILightTranslationEventBox['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightTranslationEventBox['customData']>) {
        this.data.customData = value;
    }

    setEvents(value: LightTranslationBase[]): this {
        this.events = value;
        return this;
    }
}

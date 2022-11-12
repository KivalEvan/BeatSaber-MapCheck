import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox';
import { DeepPartial, DeepPartialWrapper, ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightRotationEventBox } from '../wrapper/lightRotationEventBox';
import { IndexFilter } from './indexFilter';
import { LightRotationBase } from './lightRotationBase';

/** Light rotation event box beatmap v3 class object. */
export class LightRotationEventBox extends WrapLightRotationEventBox<
    Required<ILightRotationEventBox>,
    Required<ILightRotationBase>,
    Required<IIndexFilter>
> {
    static default: ObjectReturnFn<Required<ILightRotationEventBox>> = {
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
    private _l: LightRotationBase[];
    protected constructor(lightRotationEventBox: Required<ILightRotationEventBox>) {
        super(lightRotationEventBox);
        this._f = IndexFilter.create(lightRotationEventBox.f);
        this._l = lightRotationEventBox.l.map((l) => LightRotationBase.create(l)[0]);
        const lastTime = Math.max(...this._l.map((l) => l.time));
        if (this.beatDistributionType === 2) {
            this.beatDistribution = this.beatDistribution < lastTime ? lastTime : this.beatDistribution;
        }
    }

    static create(): LightRotationEventBox[];
    static create(
        ...eventBoxes: DeepPartialWrapper<
            IWrapLightRotationEventBox<
                Required<ILightRotationEventBox>,
                Required<ILightRotationBase>,
                Required<IIndexFilter>
            >
        >[]
    ): LightRotationEventBox[];
    static create(...eventBoxes: DeepPartial<ILightRotationEventBox>[]): LightRotationEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightRotationEventBox> &
            DeepPartialWrapper<
                IWrapLightRotationEventBox<
                    Required<ILightRotationEventBox>,
                    Required<ILightRotationBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightRotationEventBox[];
    static create(
        ...eventBoxes: (DeepPartial<ILightRotationEventBox> &
            DeepPartialWrapper<
                IWrapLightRotationEventBox<
                    Required<ILightRotationEventBox>,
                    Required<ILightRotationBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightRotationEventBox[] {
        const result: LightRotationEventBox[] = [];
        eventBoxes?.forEach((eb) =>
            result.push(
                new this({
                    f:
                        (eb.filter as IIndexFilter) ??
                        (eb as Required<ILightRotationEventBox>).f ??
                        LightRotationEventBox.default.f(),
                    w: eb.beatDistribution ?? eb.w ?? LightRotationEventBox.default.w,
                    d: eb.beatDistributionType ?? eb.d ?? LightRotationEventBox.default.d,
                    s: eb.rotationDistribution ?? eb.s ?? LightRotationEventBox.default.s,
                    t: eb.rotationDistributionType ?? eb.t ?? LightRotationEventBox.default.t,
                    a: eb.axis ?? eb.a ?? LightRotationEventBox.default.a,
                    r: eb.flip ?? eb.r ?? LightRotationEventBox.default.r,
                    b: eb.affectFirst ?? eb.b ?? LightRotationEventBox.default.b,
                    i: eb.easing ?? eb.i ?? LightRotationEventBox.default.i,
                    l:
                        (eb.events as ILightRotationBase[]) ??
                        (eb as Required<ILightRotationEventBox>).l ??
                        LightRotationEventBox.default.l(),
                    customData: eb.customData ?? LightRotationEventBox.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                f: LightRotationEventBox.default.f(),
                w: LightRotationEventBox.default.w,
                d: LightRotationEventBox.default.d,
                s: LightRotationEventBox.default.s,
                t: LightRotationEventBox.default.t,
                a: LightRotationEventBox.default.a,
                r: LightRotationEventBox.default.r,
                b: LightRotationEventBox.default.b,
                i: LightRotationEventBox.default.i,
                l: LightRotationEventBox.default.l(),
                customData: LightRotationEventBox.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightRotationEventBox> {
        return {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.rotationDistribution,
            t: this.rotationDistributionType,
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
    set beatDistribution(value: ILightRotationEventBox['w']) {
        this.data.w = value;
    }

    get beatDistributionType() {
        return this.data.d;
    }
    set beatDistributionType(value: ILightRotationEventBox['d']) {
        this.data.d = value;
    }

    get rotationDistribution() {
        return this.data.s;
    }
    set rotationDistribution(value: ILightRotationEventBox['s']) {
        this.data.s = value;
    }

    get rotationDistributionType() {
        return this.data.t;
    }
    set rotationDistributionType(value: ILightRotationEventBox['t']) {
        this.data.t = value;
    }

    get axis() {
        return this.data.a;
    }
    set axis(value: ILightRotationEventBox['a']) {
        this.data.a = value;
    }

    get flip(): ILightRotationEventBox['r'] {
        return this.data.r;
    }
    set flip(value: ILightRotationEventBox['r'] | boolean) {
        this.data.r = value ? 1 : 0;
    }

    get affectFirst(): ILightRotationEventBox['b'] {
        return this.data.b;
    }
    set affectFirst(value: ILightRotationEventBox['b'] | boolean) {
        this.data.b = value ? 1 : 0;
    }

    get easing() {
        return this.data.i;
    }
    set easing(value: ILightRotationEventBox['i']) {
        this.data.i = value;
    }

    get events() {
        return this._l;
    }
    set events(value: LightRotationBase[]) {
        this._l = value;
    }

    get customData(): NonNullable<ILightRotationEventBox['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightRotationEventBox['customData']>) {
        this.data.customData = value;
    }

    setEvents(value: LightRotationBase[]): this {
        this.events = value;
        return this;
    }
}

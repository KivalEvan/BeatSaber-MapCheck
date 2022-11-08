import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightRotationEventBox } from '../wrapper/lightRotationEventBox';
import { IndexFilter } from './indexFilter';
import { LightRotationBase } from './lightRotationBase';

/** Light rotation event box beatmap v3 class object. */
export class LightRotationEventBox extends WrapLightRotationEventBox<Required<ILightRotationEventBox>> {
    static default: ObjectReturnFn<Required<ILightRotationEventBox>> = {
        f: () => {
            return {
                f: IndexFilter.default.f,
                p: IndexFilter.default.p,
                t: IndexFilter.default.t,
                r: IndexFilter.default.r,
                c: IndexFilter.default.c,
                l: IndexFilter.default.l,
                d: IndexFilter.default.d,
                n: IndexFilter.default.n,
                s: IndexFilter.default.s,
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
    static create(...eventBoxes: Partial<ILightRotationEventBox>[]): LightRotationEventBox[];
    static create(...eventBoxes: Partial<ILightRotationEventBox>[]): LightRotationEventBox[] {
        const result: LightRotationEventBox[] = [];
        eventBoxes?.forEach((eb) =>
            result.push(
                new this({
                    f: eb.f ?? LightRotationEventBox.default.f(),
                    w: eb.w ?? LightRotationEventBox.default.w,
                    d: eb.d ?? LightRotationEventBox.default.d,
                    s: eb.s ?? LightRotationEventBox.default.s,
                    t: eb.t ?? LightRotationEventBox.default.t,
                    a: eb.a ?? LightRotationEventBox.default.a,
                    r: eb.r ?? LightRotationEventBox.default.r,
                    b: eb.b ?? LightRotationEventBox.default.b,
                    i: eb.i ?? LightRotationEventBox.default.i,
                    l: eb.l ?? LightRotationEventBox.default.l(),
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
            l: this.events.map((l) => l.toJSON()),
            i: this.easing,
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

    setCustomData(value: NonNullable<ILightRotationEventBox['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ILightRotationEventBox['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }

    setEvents(value: LightRotationBase[]): this {
        this.events = value;
        return this;
    }
}

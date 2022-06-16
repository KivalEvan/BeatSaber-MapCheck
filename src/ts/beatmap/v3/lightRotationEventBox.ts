import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { ObjectToReturn } from '../../types/utils';
import { EventBox } from './eventBox';
import { IndexFilter } from './indexFilter';
import { LightRotationBase } from './lightRotationBase';

/** Light rotation event box beatmap v3 class object. */
export class LightRotationEventBox extends EventBox<ILightRotationEventBox> {
    static default: ObjectToReturn<ILightRotationEventBox> = {
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
        s: 0,
        t: 1,
        a: 0,
        r: 0,
        b: 0,
        l: () => [],
    };

    private l: LightRotationBase[];
    private constructor(lightRotationEventBox: Required<ILightRotationEventBox>) {
        super(lightRotationEventBox);
        this.l = lightRotationEventBox.l.map((l) => LightRotationBase.create(l));
        const lastTime = Math.max(...this.l.map((l) => l.time));
        if (this.beatDistributionType === 2) {
            this.beatDistribution = this.beatDistribution < lastTime ? lastTime : this.beatDistribution;
        }
    }

    static create(): LightRotationEventBox;
    static create(eventBoxes: Partial<ILightRotationEventBox>): LightRotationEventBox;
    static create(...eventBoxes: Partial<ILightRotationEventBox>[]): LightRotationEventBox[];
    static create(...eventBoxes: Partial<ILightRotationEventBox>[]): LightRotationEventBox | LightRotationEventBox[] {
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
                    l: eb.l ?? LightRotationEventBox.default.l(),
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new this({
            f: LightRotationEventBox.default.f(),
            w: LightRotationEventBox.default.w,
            d: LightRotationEventBox.default.d,
            s: LightRotationEventBox.default.s,
            t: LightRotationEventBox.default.t,
            a: LightRotationEventBox.default.a,
            r: LightRotationEventBox.default.r,
            b: LightRotationEventBox.default.b,
            l: LightRotationEventBox.default.l(),
        });
    }

    toObject(): ILightRotationEventBox {
        return {
            f: this.filter.toObject(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.rotationDistribution,
            t: this.rotationDistributionType,
            a: this.axis,
            r: this.flip,
            b: this.affectFirst,
            l: this.events.map((l) => l.toObject()),
        };
    }

    /** Rotation distribution `<float>` of light rotation event box. */
    get rotationDistribution() {
        return this.data.s;
    }
    set rotationDistribution(value: ILightRotationEventBox['s']) {
        this.data.s = value;
    }

    /** Rotation distribution type `<int>` of light rotation event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    get rotationDistributionType() {
        return this.data.t;
    }
    set rotationDistributionType(value: ILightRotationEventBox['t']) {
        this.data.t = value;
    }

    /** Axis `<int>` of light rotation event box.
     * ```ts
     * 0 -> X
     * 1 -> Y
     * ```
     */
    get axis() {
        return this.data.a;
    }
    set axis(value: ILightRotationEventBox['a']) {
        this.data.a = value;
    }

    /** Flip rotation `<int>` in light rotation event box. */
    get flip(): ILightRotationEventBox['r'] {
        return this.data.r;
    }
    set flip(value: ILightRotationEventBox['r'] | boolean) {
        this.data.r = value ? 1 : 0;
    }

    /** Rotation distribution should affect first event `<int>` of light rotation event box. */
    get affectFirst(): ILightRotationEventBox['b'] {
        return this.data.b;
    }
    set affectFirst(value: ILightRotationEventBox['b'] | boolean) {
        this.data.b = value ? 1 : 0;
    }

    /** Light rotation base data list. */
    get events() {
        return this.l;
    }
    set events(value: LightRotationBase[]) {
        this.l = value;
    }
}

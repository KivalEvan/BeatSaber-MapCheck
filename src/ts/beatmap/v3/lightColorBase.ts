import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { IWrapLightColorBase } from '../../types/beatmap/wrapper/lightColorBase';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorBase } from '../wrapper/lightColorBase';

/** Light color base beatmap v3 class object. */
export class LightColorBase extends WrapLightColorBase<Required<ILightColorBase>> {
    static default: ObjectReturnFn<Required<ILightColorBase>> = {
        b: 0,
        i: 0,
        c: 0,
        s: 1,
        f: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(lightColorBase: Required<ILightColorBase>) {
        super(lightColorBase);
    }

    static create(): LightColorBase[];
    static create(...lightColors: PartialWrapper<IWrapLightColorBase<Required<ILightColorBase>>>[]): LightColorBase[];
    static create(...lightColors: Partial<ILightColorBase>[]): LightColorBase[];
    static create(
        ...lightColors: (Partial<ILightColorBase> & PartialWrapper<IWrapLightColorBase<Required<ILightColorBase>>>)[]
    ): LightColorBase[];
    static create(
        ...lightColors: (Partial<ILightColorBase> & PartialWrapper<IWrapLightColorBase<Required<ILightColorBase>>>)[]
    ): LightColorBase[] {
        const result: LightColorBase[] = [];
        lightColors?.forEach((lc) =>
            result.push(
                new this({
                    b: lc.time ?? lc.b ?? LightColorBase.default.b,
                    i: lc.transition ?? lc.i ?? LightColorBase.default.i,
                    c: lc.color ?? lc.c ?? LightColorBase.default.c,
                    s: lc.brightness ?? lc.s ?? LightColorBase.default.s,
                    f: lc.frequency ?? lc.f ?? LightColorBase.default.f,
                    customData: lc.customData ?? LightColorBase.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightColorBase.default.b,
                i: LightColorBase.default.i,
                c: LightColorBase.default.c,
                s: LightColorBase.default.s,
                f: LightColorBase.default.f,
                customData: LightColorBase.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightColorBase> {
        return {
            b: this.time,
            i: this.transition,
            c: this.color,
            s: this.brightness,
            f: this.frequency,
            customData: deepCopy(this.data.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: ILightColorBase['b']) {
        this.data.b = value;
    }

    get transition() {
        return this.data.i;
    }
    set transition(value: ILightColorBase['i']) {
        this.data.i = value;
    }

    get color() {
        return this.data.c;
    }
    set color(value: ILightColorBase['c']) {
        this.data.c = value;
    }

    get brightness() {
        return this.data.s;
    }
    set brightness(value: ILightColorBase['s']) {
        this.data.s = value;
    }

    get frequency() {
        return this.data.f;
    }
    set frequency(value: ILightColorBase['f']) {
        this.data.f = value;
    }

    get customData(): NonNullable<ILightColorBase['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightColorBase['customData']>) {
        this.data.customData = value;
    }
}

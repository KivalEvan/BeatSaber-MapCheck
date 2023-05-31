import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { IWrapLightColorBaseAttribute } from '../../types/beatmap/wrapper/lightColorBase';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorBase } from '../wrapper/lightColorBase';

/** Light color base beatmap v3 class object. */
export class LightColorBase extends WrapLightColorBase<ILightColorBase> {
    static default: ObjectReturnFn<ILightColorBase> = {
        b: 0,
        i: 0,
        c: 0,
        s: 1,
        f: 0,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapLightColorBaseAttribute<ILightColorBase>>);
    constructor(data: Partial<ILightColorBase>);
    constructor(
        data: Partial<ILightColorBase> & Partial<IWrapLightColorBaseAttribute<ILightColorBase>>,
    );
    constructor(
        data: Partial<ILightColorBase> &
            Partial<IWrapLightColorBaseAttribute<ILightColorBase>> = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? LightColorBase.default.b;
        this._transition = data.transition ?? data.i ?? LightColorBase.default.i;
        this._color = data.color ?? data.c ?? LightColorBase.default.c;
        this._brightness = data.brightness ?? data.s ?? LightColorBase.default.s;
        this._frequency = data.frequency ?? data.f ?? LightColorBase.default.f;
        this._customData = data.customData ?? LightColorBase.default.customData();
    }

    static create(): LightColorBase[];
    static create(
        ...data: Partial<IWrapLightColorBaseAttribute<ILightColorBase>>[]
    ): LightColorBase[];
    static create(...data: Partial<ILightColorBase>[]): LightColorBase[];
    static create(
        ...data: (Partial<ILightColorBase> &
            Partial<IWrapLightColorBaseAttribute<ILightColorBase>>)[]
    ): LightColorBase[];
    static create(
        ...data: (Partial<ILightColorBase> &
            Partial<IWrapLightColorBaseAttribute<ILightColorBase>>)[]
    ): LightColorBase[] {
        const result: LightColorBase[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ILightColorBase {
        return {
            b: this.time,
            i: this.transition,
            c: this.color,
            s: this.brightness,
            f: this.frequency,
            customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<ILightColorBase['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<ILightColorBase['customData']>) {
        this._customData = value;
    }
}

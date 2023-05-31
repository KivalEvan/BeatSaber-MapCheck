import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { IWrapLightTranslationBaseAttribute } from '../../types/beatmap/wrapper/lightTranslationBase';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightTranslationBase } from '../wrapper/lightTranslationBase';

/** Light translation base beatmap v3 class object. */
export class LightTranslationBase extends WrapLightTranslationBase<ILightTranslationBase> {
    static default: ObjectReturnFn<ILightTranslationBase> = {
        b: 0,
        p: 0,
        e: 0,
        t: 0,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>);
    constructor(data: Partial<ILightTranslationBase>);
    constructor(
        data: Partial<ILightTranslationBase> &
            Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>,
    );
    constructor(
        data: Partial<ILightTranslationBase> &
            Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>> = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? LightTranslationBase.default.b;
        this._previous = data.previous ?? data.p ?? LightTranslationBase.default.p;
        this._easing = data.easing ?? data.e ?? LightTranslationBase.default.e;
        this._translation = data.translation ?? data.t ?? LightTranslationBase.default.t;
        this._customData = data.customData ?? LightTranslationBase.default.customData();
    }

    static create(): LightTranslationBase[];
    static create(
        ...data: Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>[]
    ): LightTranslationBase[];
    static create(...data: Partial<ILightTranslationBase>[]): LightTranslationBase[];
    static create(
        ...data: (Partial<ILightTranslationBase> &
            Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>)[]
    ): LightTranslationBase[];
    static create(
        ...data: (Partial<ILightTranslationBase> &
            Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>)[]
    ): LightTranslationBase[] {
        const result: LightTranslationBase[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ILightTranslationBase {
        return {
            b: this.time,
            p: this.previous,
            e: this.easing,
            t: this.translation,
            customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<ILightTranslationBase['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<ILightTranslationBase['customData']>) {
        this._customData = value;
    }
}

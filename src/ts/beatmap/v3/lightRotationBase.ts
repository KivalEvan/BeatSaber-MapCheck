import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { IWrapLightRotationBaseAttribute } from '../../types/beatmap/wrapper/lightRotationBase';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightRotationBase } from '../wrapper/lightRotationBase';

/** Light rotation base beatmap v3 class object. */
export class LightRotationBase extends WrapLightRotationBase<ILightRotationBase> {
    static default: ObjectReturnFn<ILightRotationBase> = {
        b: 0,
        p: 0,
        e: 0,
        l: 0,
        r: 0,
        o: 0,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>);
    constructor(data: Partial<ILightRotationBase>);
    constructor(
        data: Partial<ILightRotationBase> &
            Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>,
    );
    constructor(
        data: Partial<ILightRotationBase> &
            Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>> = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? LightRotationBase.default.b;
        this._previous = data.previous ?? data.p ?? LightRotationBase.default.p;
        this._easing = data.easing ?? data.e ?? LightRotationBase.default.e;
        this._loop = data.loop ?? data.l ?? LightRotationBase.default.l;
        this._rotation = data.rotation ?? data.r ?? LightRotationBase.default.r;
        this._direction = data.direction ?? data.o ?? LightRotationBase.default.o;
        this._customData = data.customData ?? LightRotationBase.default.customData();
    }

    static create(): LightRotationBase[];
    static create(
        ...data: Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>[]
    ): LightRotationBase[];
    static create(...data: Partial<ILightRotationBase>[]): LightRotationBase[];
    static create(
        ...data: (Partial<ILightRotationBase> &
            Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>)[]
    ): LightRotationBase[];
    static create(
        ...data: (Partial<ILightRotationBase> &
            Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>)[]
    ): LightRotationBase[] {
        const result: LightRotationBase[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ILightRotationBase {
        return {
            b: this.time,
            p: this.previous,
            e: this.easing,
            l: this.loop,
            r: this.rotation,
            o: this.direction,
            customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<ILightRotationBase['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<ILightRotationBase['customData']>) {
        this._customData = value;
    }
}

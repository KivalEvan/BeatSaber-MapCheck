import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightRotationBase } from '../wrapper/lightRotationBase';

/** Light rotation base beatmap v3 class object. */
export class LightRotationBase extends WrapLightRotationBase<Required<ILightRotationBase>> {
    static default: ObjectReturnFn<Required<ILightRotationBase>> = {
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

    protected constructor(lightRotationBase: Required<ILightRotationBase>) {
        super(lightRotationBase);
    }

    static create(): LightRotationBase[];
    static create(...lightRotations: Partial<ILightRotationBase>[]): LightRotationBase[];
    static create(...lightRotations: Partial<ILightRotationBase>[]): LightRotationBase[] {
        const result: LightRotationBase[] = [];
        lightRotations?.forEach((lr) =>
            result.push(
                new this({
                    b: lr.b ?? LightRotationBase.default.b,
                    p: lr.p ?? LightRotationBase.default.p,
                    e: lr.e ?? LightRotationBase.default.e,
                    l: lr.l ?? LightRotationBase.default.l,
                    r: lr.r ?? LightRotationBase.default.r,
                    o: lr.o ?? LightRotationBase.default.o,
                    customData: lr.customData ?? LightRotationBase.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightRotationBase.default.b,
                p: LightRotationBase.default.p,
                e: LightRotationBase.default.e,
                l: LightRotationBase.default.l,
                r: LightRotationBase.default.r,
                o: LightRotationBase.default.o,
                customData: LightRotationBase.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightRotationBase> {
        return {
            b: this.time,
            p: this.previous,
            e: this.easing,
            l: this.loop,
            r: this.rotation,
            o: this.direction,
            customData: deepCopy(this.data.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: ILightRotationBase['b']) {
        this.data.b = value;
    }

    get previous() {
        return this.data.p;
    }
    set previous(value: ILightRotationBase['p']) {
        this.data.p = value;
    }

    get easing() {
        return this.data.e;
    }
    set easing(value: ILightRotationBase['e']) {
        this.data.e = value;
    }

    get loop() {
        return this.data.l;
    }
    set loop(value: ILightRotationBase['l']) {
        this.data.l = value;
    }

    get rotation() {
        return this.data.r;
    }
    set rotation(value: ILightRotationBase['r']) {
        this.data.r = value;
    }

    get direction() {
        return this.data.o;
    }
    set direction(value: ILightRotationBase['o']) {
        this.data.o = value;
    }

    get customData(): NonNullable<ILightRotationBase['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightRotationBase['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<ILightRotationBase['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ILightRotationBase['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }
}

import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { Serializable } from '../shared/serializable';

/** Light rotation for new lighting system. */
export class LightRotationBase extends Serializable<ILightRotationBase> {
    static default: Required<ILightRotationBase> = {
        b: 0,
        p: 0,
        e: 0,
        l: 0,
        r: 0,
        o: 0,
    };

    private constructor(lightRotationBase: Required<ILightRotationBase>) {
        super(lightRotationBase);
    }

    static create(): LightRotationBase;
    static create(lightRotations: Partial<ILightRotationBase>): LightRotationBase;
    static create(...lightRotations: Partial<ILightRotationBase>[]): LightRotationBase[];
    static create(...lightRotations: Partial<ILightRotationBase>[]): LightRotationBase | LightRotationBase[] {
        const result: LightRotationBase[] = [];
        lightRotations?.forEach((lr) =>
            result.push(
                new LightRotationBase({
                    b: lr.b ?? LightRotationBase.default.b,
                    p: lr.p ?? LightRotationBase.default.p,
                    e: lr.e ?? LightRotationBase.default.e,
                    l: lr.l ?? LightRotationBase.default.l,
                    r: lr.r ?? LightRotationBase.default.r,
                    o: lr.o ?? LightRotationBase.default.o,
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new LightRotationBase({
            b: LightRotationBase.default.b,
            p: LightRotationBase.default.p,
            e: LightRotationBase.default.e,
            l: LightRotationBase.default.l,
            r: LightRotationBase.default.r,
            o: LightRotationBase.default.o,
        });
    }

    toObject(): ILightRotationBase {
        return {
            b: this.time,
            p: this.previous,
            e: this.ease,
            l: this.loop,
            r: this.rotation,
            o: this.direction,
        };
    }

    /** Relative beat time `<float>` to event box group. */
    get time() {
        return this.data.b;
    }
    set time(value: ILightRotationBase['b']) {
        this.data.b = value;
    }

    /** Use previous event rotation value `<int>` in light rotation. */
    get previous() {
        return this.data.p;
    }
    set previous(value: ILightRotationBase['p']) {
        this.data.p = value;
    }

    /** Ease type `<int>` of light rotation.
     * ```ts
     * -1 -> Step
     * 0 -> Linear
     * 1 -> EaseInQuad
     * 2 -> EaseOutQuad
     * 3 -> EaseInOutQuad
     * ```
     */
    get ease() {
        return this.data.e;
    }
    set ease(value: ILightRotationBase['e']) {
        this.data.e = value;
    }

    /** Loop count `<int>` in light rotation. */
    get loop() {
        return this.data.l;
    }
    set loop(value: ILightRotationBase['l']) {
        this.data.l = value;
    }

    /** Rotation value `<float>` of light rotation.
     * ```ts
     * Left-side -> Clockwise
     * Right-side -> Counter-Clockwise
     * ```
     */
    get rotation() {
        return this.data.r;
    }
    set rotation(value: ILightRotationBase['r']) {
        this.data.r = value;
    }

    /** Rotation direction `<int>` of light rotation.
     * ```ts
     * 0 -> Automatic
     * 1 -> Clockwise
     * 2 -> Counter-clockwise
     * ```
     */
    get direction() {
        return this.data.o;
    }
    set direction(value: ILightRotationBase['o']) {
        this.data.o = value;
    }
}

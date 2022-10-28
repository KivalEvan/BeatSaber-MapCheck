import { IWrapLightRotationBase } from '../../types/beatmap/wrapper/lightRotationBase';
import { WrapBaseObject } from './baseObject';

/** Light rotation base beatmap class object. */
export abstract class WrapLightRotationBase<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapLightRotationBase
{
    abstract get previous(): IWrapLightRotationBase['previous'];
    abstract set previous(value: IWrapLightRotationBase['previous']);
    abstract get easing(): IWrapLightRotationBase['easing'];
    abstract set easing(value: IWrapLightRotationBase['easing']);
    abstract get loop(): IWrapLightRotationBase['loop'];
    abstract set loop(value: IWrapLightRotationBase['loop']);
    abstract get rotation(): IWrapLightRotationBase['rotation'];
    abstract set rotation(value: IWrapLightRotationBase['rotation']);
    abstract get direction(): IWrapLightRotationBase['direction'];
    abstract set direction(value: IWrapLightRotationBase['direction']);

    setPrevious(value: IWrapLightRotationBase['previous']) {
        this.previous = value;
        return this;
    }
    setEasing(value: IWrapLightRotationBase['easing']) {
        this.easing = value;
        return this;
    }
    setLoop(value: IWrapLightRotationBase['loop']) {
        this.loop = value;
        return this;
    }
    setRotation(value: IWrapLightRotationBase['rotation']) {
        this.rotation = value;
        return this;
    }
    setDirection(value: IWrapLightRotationBase['direction']) {
        this.direction = value;
        return this;
    }

    isValid(): boolean {
        return (
            (this.previous === 0 || this.previous === 1) &&
            this.easing >= -1 &&
            this.easing <= 3 &&
            (this.loop === 0 || this.loop === 1) &&
            this.direction >= 0 &&
            this.direction <= 2
        );
    }
}

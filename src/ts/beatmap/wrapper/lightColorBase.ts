import { IWrapLightColorBase } from '../../types/beatmap/wrapper/lightColorBase';
import { WrapBaseObject } from './baseObject';

/** Light color base beatmap class object. */
export abstract class WrapLightColorBase<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapLightColorBase
{
    abstract get transition(): IWrapLightColorBase['transition'];
    abstract set transition(value: IWrapLightColorBase['transition']);
    abstract get color(): IWrapLightColorBase['color'];
    abstract set color(value: IWrapLightColorBase['color']);
    abstract get brightness(): IWrapLightColorBase['brightness'];
    abstract set brightness(value: IWrapLightColorBase['brightness']);
    abstract get frequency(): IWrapLightColorBase['frequency'];
    abstract set frequency(value: IWrapLightColorBase['frequency']);

    setTransition(value: IWrapLightColorBase['transition']): this {
        this.transition = value;
        return this;
    }
    setColor(value: IWrapLightColorBase['color']): this {
        this.color = value;
        return this;
    }
    setBrightness(value: IWrapLightColorBase['brightness']): this {
        this.brightness = value;
        return this;
    }
    setFrequency(value: IWrapLightColorBase['frequency']): this {
        this.frequency = value;
        return this;
    }

    isValid(): boolean {
        return (
            this.transition >= 0 &&
            this.transition <= 2 &&
            this.color >= 0 &&
            this.color <= 2 &&
            this.brightness >= 0 &&
            this.frequency >= 0
        );
    }
}

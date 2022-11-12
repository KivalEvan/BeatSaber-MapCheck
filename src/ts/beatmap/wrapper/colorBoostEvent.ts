import { WrapBaseObject } from './baseObject';
import { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent';

/** Boost event beatmap class object. */
export abstract class WrapColorBoostEvent<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapColorBoostEvent<T>
{
    abstract get toggle(): IWrapColorBoostEvent['toggle'];
    abstract set toggle(value: IWrapColorBoostEvent['toggle']);

    setToggle(value: boolean): this {
        this.toggle = value;
        return this;
    }

    isValid(): boolean {
        return true;
    }
}

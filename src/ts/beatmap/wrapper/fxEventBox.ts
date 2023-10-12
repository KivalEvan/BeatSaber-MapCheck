import { IWrapFxEventBox } from '../../types/beatmap/wrapper/fxEventBox';
import { WrapEventBox } from './eventBox';

/** FX event box beatmap class object. */
export abstract class WrapFxEventBox<
      TBox extends { [P in keyof TBox]: TBox[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBox<TBox, number, TFilter>
   implements IWrapFxEventBox<TBox, TFilter>
{
   protected _fxDistribution!: IWrapFxEventBox['fxDistribution'];
   protected _fxDistributionType!: IWrapFxEventBox['fxDistributionType'];
   protected declare _events: number[];

   get fxDistribution(): IWrapFxEventBox['fxDistribution'] {
      return this._fxDistribution;
   }
   set fxDistribution(value: IWrapFxEventBox['fxDistribution']) {
      this._fxDistribution = value;
   }
   get fxDistributionType(): IWrapFxEventBox['fxDistributionType'] {
      return this._fxDistributionType;
   }
   set fxDistributionType(value: IWrapFxEventBox['fxDistributionType']) {
      this._fxDistributionType = value;
   }
   get events(): number[] {
      return this._events;
   }
   set events(value: number[]) {
      this._events = value;
   }

   setFxDistribution(value: IWrapFxEventBox['fxDistribution']) {
      this.fxDistribution = value;
      return this;
   }
   setFxDistributionType(value: IWrapFxEventBox['fxDistributionType']) {
      this.fxDistributionType = value;
      return this;
   }
   abstract setEvents(value: number[]): this;

   isValid(): boolean {
      return (
         super.isValid() &&
         (this.fxDistributionType === 1 || this.fxDistributionType === 2) &&
         (this.affectFirst === 0 || this.affectFirst === 1)
      );
   }
}

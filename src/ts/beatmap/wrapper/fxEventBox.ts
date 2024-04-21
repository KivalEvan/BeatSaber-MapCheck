import type { IWrapFxEventBox } from '../../types/beatmap/wrapper/fxEventBox.ts';
import type { IWrapFxEventFloat } from '../../types/beatmap/wrapper/fxEventFloat.ts';
import { WrapEventBox } from './eventBox.ts';

/** FX event box beatmap class object. */
export abstract class WrapFxEventBox<
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBox<TBox, TBase, TFilter>
   implements IWrapFxEventBox<TBox, TBase, TFilter>
{
   protected _fxDistribution!: IWrapFxEventBox['fxDistribution'];
   protected _fxDistributionType!: IWrapFxEventBox['fxDistributionType'];
   protected declare _events: IWrapFxEventFloat<TBase>[];

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
   get events(): IWrapFxEventFloat<TBase>[] {
      return this._events;
   }
   set events(value: IWrapFxEventFloat<TBase>[]) {
      this._events = value;
   }

   setFxDistribution(value: IWrapFxEventBox['fxDistribution']): this {
      this.fxDistribution = value;
      return this;
   }
   setFxDistributionType(value: IWrapFxEventBox['fxDistributionType']): this {
      this.fxDistributionType = value;
      return this;
   }
   abstract setEvents(value: IWrapFxEventFloat<TBase>[]): this;

   isValid(): boolean {
      return (
         super.isValid() &&
         (this.fxDistributionType === 1 || this.fxDistributionType === 2) &&
         (this.affectFirst === 0 || this.affectFirst === 1)
      );
   }
}

import { IWrapLightColorBase } from '../../types/beatmap/wrapper/lightColorBase';
import { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox';
import { WrapEventBox } from './eventBox';

/** Light color event box beatmap class object. */
export abstract class WrapLightColorEventBox<
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBox<TBox, TBase, TFilter>
   implements IWrapLightColorEventBox<TBox, TBase, TFilter>
{
   protected _brightnessDistribution!: IWrapLightColorEventBox['brightnessDistribution'];
   protected _brightnessDistributionType!: IWrapLightColorEventBox['brightnessDistributionType'];
   protected declare _events: IWrapLightColorBase<TBase>[];

   get brightnessDistribution(): IWrapLightColorEventBox['brightnessDistribution'] {
      return this._brightnessDistribution;
   }
   set brightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']) {
      this._brightnessDistribution = value;
   }
   get brightnessDistributionType(): IWrapLightColorEventBox['brightnessDistributionType'] {
      return this._brightnessDistributionType;
   }
   set brightnessDistributionType(value: IWrapLightColorEventBox['brightnessDistributionType']) {
      this._brightnessDistributionType = value;
   }
   get events(): IWrapLightColorBase<TBase>[] {
      return this._events;
   }
   set events(value: IWrapLightColorBase<TBase>[]) {
      this._events = value;
   }

   setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']) {
      this.brightnessDistribution = value;
      return this;
   }
   setBrightnessDistributionType(value: IWrapLightColorEventBox['brightnessDistributionType']) {
      this.brightnessDistributionType = value;
      return this;
   }
   abstract setEvents(value: IWrapLightColorBase<TBase>[]): this;

   isValid(): boolean {
      return (
         super.isValid() &&
         (this.brightnessDistributionType === 1 || this.brightnessDistributionType === 2) &&
         (this.affectFirst === 0 || this.affectFirst === 1)
      );
   }
}

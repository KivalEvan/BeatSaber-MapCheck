import type { IWrapLightTranslationEvent } from '../../types/beatmap/wrapper/lightTranslationEvent.ts';
import type { IWrapLightTranslationEventBox } from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import { WrapEventBox } from './eventBox.ts';

/** Light translation event box beatmap class object. */
export abstract class WrapLightTranslationEventBox<
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBox<TBox, TBase, TFilter>
   implements IWrapLightTranslationEventBox<TBox>
{
   protected _translationDistribution!: IWrapLightTranslationEventBox['gapDistribution'];
   protected _translationDistributionType!: IWrapLightTranslationEventBox['gapDistributionType'];
   protected _axis!: IWrapLightTranslationEventBox['axis'];
   protected _flip!: IWrapLightTranslationEventBox['flip'];
   protected declare _events: IWrapLightTranslationEvent<TBase>[];

   get gapDistribution(): IWrapLightTranslationEventBox['gapDistribution'] {
      return this._translationDistribution;
   }
   set gapDistribution(value: IWrapLightTranslationEventBox['gapDistribution']) {
      this._translationDistribution = value;
   }
   get gapDistributionType(): IWrapLightTranslationEventBox['gapDistributionType'] {
      return this._translationDistributionType;
   }
   set gapDistributionType(value: IWrapLightTranslationEventBox['gapDistributionType']) {
      this._translationDistributionType = value;
   }
   get axis(): IWrapLightTranslationEventBox['axis'] {
      return this._axis;
   }
   set axis(value: IWrapLightTranslationEventBox['axis']) {
      this._axis = value;
   }
   get flip(): IWrapLightTranslationEventBox['flip'] {
      return this._flip;
   }
   set flip(value: IWrapLightTranslationEventBox['flip']) {
      this._flip = value;
   }
   get events(): IWrapLightTranslationEvent<TBase>[] {
      return this._events;
   }
   set events(value: IWrapLightTranslationEvent<TBase>[]) {
      this._events = value;
   }

   setGapDistribution(value: IWrapLightTranslationEventBox['gapDistribution']): this {
      this.gapDistribution = value;
      return this;
   }
   setGapDistributionType(value: IWrapLightTranslationEventBox['gapDistributionType']): this {
      this.gapDistributionType = value;
      return this;
   }
   setAxis(value: IWrapLightTranslationEventBox['axis']): this {
      this.axis = value;
      return this;
   }
   setFlip(value: IWrapLightTranslationEventBox['flip']): this {
      this.flip = value;
      return this;
   }
   abstract setEvents(value: IWrapLightTranslationEvent<TBase>[]): this;

   isValid(): boolean {
      return (
         super.isValid() &&
         (this.gapDistributionType === 1 || this.gapDistributionType === 2) &&
         (this.axis === 0 || this.axis === 1) &&
         (this.flip === 0 || this.flip === 1) &&
         (this.affectFirst === 0 || this.affectFirst === 1)
      );
   }
}

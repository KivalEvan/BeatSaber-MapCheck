import type { IWrapLightTranslationEvent } from '../../types/beatmap/wrapper/lightTranslationEvent.ts';
import type {
   IWrapLightTranslationEventBox,
   IWrapLightTranslationEventBoxAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { EventBox } from './abstract/eventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightTranslationEvent } from './lightTranslationEvent.ts';

export class LightTranslationEventBox extends EventBox implements IWrapLightTranslationEventBox {
   static defaultValue: IWrapLightTranslationEventBoxAttribute = {
      filter: {
         type: 1,
         p0: 0,
         p1: 0,
         reverse: 0,
         chunks: 0,
         random: 0,
         seed: 0,
         limit: 0,
         limitAffectsType: 0,
         customData: {},
      },
      axis: 0,
      flip: 0,
      beatDistribution: 0,
      beatDistributionType: 1,
      gapDistribution: 0,
      gapDistributionType: 1,
      affectFirst: 0,
      easing: 0,
      events: [],
      customData: {},
   };

   static create(
      ...data: Partial<IWrapLightTranslationEventBoxAttribute>[]
   ): LightTranslationEventBox[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapLightTranslationEventBoxAttribute, 'customData'> = {}) {
      super();
      this.filter = new IndexFilter(data.filter ?? LightTranslationEventBox.defaultValue.filter);
      this.axis = data.axis ?? LightTranslationEventBox.defaultValue.axis;
      this.flip = data.flip ?? LightTranslationEventBox.defaultValue.flip;
      this.beatDistribution =
         data.beatDistribution ?? LightTranslationEventBox.defaultValue.beatDistribution;
      this.beatDistributionType =
         data.beatDistributionType ?? LightTranslationEventBox.defaultValue.beatDistributionType;
      this.gapDistribution =
         data.gapDistribution ?? LightTranslationEventBox.defaultValue.gapDistribution;
      this.gapDistributionType =
         data.gapDistributionType ?? LightTranslationEventBox.defaultValue.gapDistributionType;
      this.affectFirst = data.affectFirst ?? LightTranslationEventBox.defaultValue.affectFirst;
      this.easing = data.easing ?? LightTranslationEventBox.defaultValue.easing;
      this.events = (data.events ?? LightTranslationEventBox.defaultValue.events).map(
         (obj) => new LightTranslationEvent(obj),
      );
      this.customData = deepCopy(
         data.customData ?? LightTranslationEventBox.defaultValue.customData,
      );
   }

   gapDistribution: IWrapLightTranslationEventBox['gapDistribution'];
   gapDistributionType: IWrapLightTranslationEventBox['gapDistributionType'];
   axis: IWrapLightTranslationEventBox['axis'];
   flip: IWrapLightTranslationEventBox['flip'];
   events: IWrapLightTranslationEvent[];

   setGapDistribution(value: this['gapDistribution']): this {
      this.gapDistribution = value;
      return this;
   }
   setGapDistributionType(value: this['gapDistributionType']): this {
      this.gapDistributionType = value;
      return this;
   }
   setAxis(value: this['axis']): this {
      this.axis = value;
      return this;
   }
   setFlip(value: this['flip']): this {
      this.flip = value;
      return this;
   }
   setEvents(value: this['events']): this {
      this.events = value;
      return this;
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              (this.gapDistributionType === 1 || this.gapDistributionType === 2) &&
              (this.axis === 0 || this.axis === 1) &&
              (this.flip === 0 || this.flip === 1) &&
              (this.affectFirst === 0 || this.affectFirst === 1);
   }
}

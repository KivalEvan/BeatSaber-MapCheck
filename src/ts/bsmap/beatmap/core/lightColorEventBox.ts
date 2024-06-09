import type { IWrapLightColorEvent } from '../../types/beatmap/wrapper/lightColorEvent.ts';
import type {
   IWrapLightColorEventBox,
   IWrapLightColorEventBoxAttribute,
} from '../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { EventBox } from './abstract/eventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightColorEvent } from './lightColorEvent.ts';

export class LightColorEventBox extends EventBox implements IWrapLightColorEventBox {
   static defaultValue: IWrapLightColorEventBoxAttribute = {
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
      beatDistribution: 0,
      beatDistributionType: 1,
      brightnessDistribution: 0,
      brightnessDistributionType: 1,
      affectFirst: 0,
      easing: 0,
      events: [],
      customData: {},
   };

   static create(...data: Partial<IWrapLightColorEventBoxAttribute>[]): LightColorEventBox[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapLightColorEventBoxAttribute, 'customData'> = {}) {
      super();
      this.filter = new IndexFilter(data.filter ?? LightColorEventBox.defaultValue.filter);
      this.beatDistribution =
         data.beatDistribution ?? LightColorEventBox.defaultValue.beatDistribution;
      this.beatDistributionType =
         data.beatDistributionType ?? LightColorEventBox.defaultValue.beatDistributionType;
      this.brightnessDistribution =
         data.brightnessDistribution ?? LightColorEventBox.defaultValue.brightnessDistribution;
      this.brightnessDistributionType =
         data.brightnessDistributionType ??
         LightColorEventBox.defaultValue.brightnessDistributionType;
      this.affectFirst = data.affectFirst ?? LightColorEventBox.defaultValue.affectFirst;
      this.easing = data.easing ?? LightColorEventBox.defaultValue.easing;
      this.events = (data.events ?? LightColorEventBox.defaultValue.events).map(
         (obj) => new LightColorEvent(obj),
      );
      this.customData = deepCopy(data.customData ?? LightColorEventBox.defaultValue.customData);
   }

   brightnessDistribution: IWrapLightColorEventBox['brightnessDistribution'];
   brightnessDistributionType: IWrapLightColorEventBox['brightnessDistributionType'];
   events: IWrapLightColorEvent[];

   setBrightnessDistribution(value: this['brightnessDistribution']): this {
      this.brightnessDistribution = value;
      return this;
   }
   setBrightnessDistributionType(value: this['brightnessDistributionType']): this {
      this.brightnessDistributionType = value;
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
              (this.brightnessDistributionType === 1 || this.brightnessDistributionType === 2) &&
              (this.affectFirst === 0 || this.affectFirst === 1);
   }
}

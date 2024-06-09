import type {
   IWrapFxEventBox,
   IWrapFxEventBoxAttribute,
} from '../../types/beatmap/wrapper/fxEventBox.ts';
import type { IWrapFxEventFloat } from '../../types/beatmap/wrapper/fxEventFloat.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { EventBox } from './abstract/eventBox.ts';
import { FxEventFloat } from './fxEventFloat.ts';
import { IndexFilter } from './indexFilter.ts';

export class FxEventBox extends EventBox implements IWrapFxEventBox {
   static defaultValue: IWrapFxEventBoxAttribute = {
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
      fxDistribution: 0,
      fxDistributionType: 1,
      affectFirst: 0,
      easing: 0,
      events: [],
      customData: {},
   };

   static create(...data: Partial<IWrapFxEventBoxAttribute>[]): FxEventBox[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapFxEventBoxAttribute, 'customData'> = {}) {
      super();
      this.filter = new IndexFilter(data.filter ?? FxEventBox.defaultValue.filter);
      this.beatDistribution = data.beatDistribution ?? FxEventBox.defaultValue.beatDistribution;
      this.beatDistributionType =
         data.beatDistributionType ?? FxEventBox.defaultValue.beatDistributionType;
      this.fxDistribution = data.fxDistribution ?? FxEventBox.defaultValue.fxDistribution;
      this.fxDistributionType =
         data.fxDistributionType ?? FxEventBox.defaultValue.fxDistributionType;
      this.affectFirst = data.affectFirst ?? FxEventBox.defaultValue.affectFirst;
      this.easing = data.easing ?? FxEventBox.defaultValue.easing;
      this.events = (data.events ?? FxEventBox.defaultValue.events).map(
         (obj) => new FxEventFloat(obj),
      );
      this.customData = deepCopy(data.customData ?? FxEventBox.defaultValue.customData);
   }

   fxDistribution: IWrapFxEventBox['fxDistribution'];
   fxDistributionType: IWrapFxEventBox['fxDistributionType'];
   events: IWrapFxEventFloat[];

   setFxDistribution(value: this['fxDistribution']): this {
      this.fxDistribution = value;
      return this;
   }
   setFxDistributionType(value: this['fxDistributionType']): this {
      this.fxDistributionType = value;
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
              (this.fxDistributionType === 1 || this.fxDistributionType === 2) &&
              (this.affectFirst === 0 || this.affectFirst === 1);
   }
}

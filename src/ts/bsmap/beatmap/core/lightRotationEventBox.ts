import type { IWrapLightRotationEvent } from '../../types/beatmap/wrapper/lightRotationEvent.ts';
import type {
   IWrapLightRotationEventBox,
   IWrapLightRotationEventBoxAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { EventBox } from './abstract/eventBox.ts';
import { IndexFilter } from './indexFilter.ts';
import { LightRotationEvent } from './lightRotationEvent.ts';

export class LightRotationEventBox extends EventBox implements IWrapLightRotationEventBox {
   static defaultValue: IWrapLightRotationEventBoxAttribute = {
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
      rotationDistribution: 0,
      rotationDistributionType: 1,
      affectFirst: 0,
      easing: 0,
      events: [],
      customData: {},
   };

   static create(...data: Partial<IWrapLightRotationEventBoxAttribute>[]): LightRotationEventBox[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: DeepPartialIgnore<IWrapLightRotationEventBoxAttribute, 'customData'> = {}) {
      super();
      this.filter = new IndexFilter(data.filter ?? LightRotationEventBox.defaultValue.filter);
      this.axis = data.axis ?? LightRotationEventBox.defaultValue.axis;
      this.flip = data.flip ?? LightRotationEventBox.defaultValue.flip;
      this.beatDistribution =
         data.beatDistribution ?? LightRotationEventBox.defaultValue.beatDistribution;
      this.beatDistributionType =
         data.beatDistributionType ?? LightRotationEventBox.defaultValue.beatDistributionType;
      this.rotationDistribution =
         data.rotationDistribution ?? LightRotationEventBox.defaultValue.rotationDistribution;
      this.rotationDistributionType =
         data.rotationDistributionType ??
         LightRotationEventBox.defaultValue.rotationDistributionType;
      this.affectFirst = data.affectFirst ?? LightRotationEventBox.defaultValue.affectFirst;
      this.easing = data.easing ?? LightRotationEventBox.defaultValue.easing;
      this.events = (data.events ?? LightRotationEventBox.defaultValue.events).map(
         (obj) => new LightRotationEvent(obj),
      );
      this.customData = deepCopy(data.customData ?? LightRotationEventBox.defaultValue.customData);
   }

   rotationDistribution: IWrapLightRotationEventBox['rotationDistribution'];
   rotationDistributionType: IWrapLightRotationEventBox['rotationDistributionType'];
   axis: IWrapLightRotationEventBox['axis'];
   flip: IWrapLightRotationEventBox['flip'];
   events: IWrapLightRotationEvent[];

   setRotationDistribution(value: this['rotationDistribution']): this {
      this.rotationDistribution = value;
      return this;
   }
   setRotationDistributionType(value: this['rotationDistributionType']): this {
      this.rotationDistributionType = value;
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
              (this.rotationDistributionType === 1 || this.rotationDistributionType === 2) &&
              (this.axis === 0 || this.axis === 1) &&
              (this.flip === 0 || this.flip === 1) &&
              (this.affectFirst === 0 || this.affectFirst === 1);
   }
}

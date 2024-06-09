import type {
   IWrapLightColorEvent,
   IWrapLightColorEventAttribute,
} from '../../types/beatmap/wrapper/lightColorEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { BaseObject } from './abstract/baseObject.ts';

export class LightColorEvent extends BaseObject implements IWrapLightColorEvent {
   static defaultValue: IWrapLightColorEventAttribute = {
      time: 0,
      previous: 0,
      color: 0,
      frequency: 0,
      brightness: 0,
      strobeBrightness: 0,
      strobeFade: 0,
      easing: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapLightColorEventAttribute>[]): LightColorEvent[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapLightColorEventAttribute> = {}) {
      super();
      this.time = data.time ?? LightColorEvent.defaultValue.time;
      this.previous = data.previous ?? LightColorEvent.defaultValue.previous;
      this.color = data.color ?? LightColorEvent.defaultValue.color;
      this.frequency = data.frequency ?? LightColorEvent.defaultValue.frequency;
      this.brightness = data.brightness ?? LightColorEvent.defaultValue.brightness;
      this.strobeBrightness =
         data.strobeBrightness ?? LightColorEvent.defaultValue.strobeBrightness;
      this.strobeFade = data.strobeFade ?? LightColorEvent.defaultValue.strobeFade;
      this.easing = data.easing ?? LightColorEvent.defaultValue.easing;
      this.customData = deepCopy(data.customData ?? LightColorEvent.defaultValue.customData);
   }

   previous: IWrapLightColorEvent['previous'];
   color: IWrapLightColorEvent['color'];
   brightness: IWrapLightColorEvent['brightness'];
   frequency: IWrapLightColorEvent['frequency'];
   strobeBrightness: IWrapLightColorEvent['strobeBrightness'];
   strobeFade: IWrapLightColorEvent['strobeFade'];
   easing: IWrapLightColorEvent['easing'];

   setPrevious(value: this['previous']): this {
      this.previous = value;
      return this;
   }
   setColor(value: this['color']): this {
      this.color = value;
      return this;
   }
   setBrightness(value: this['brightness']): this {
      this.brightness = value;
      return this;
   }
   setFrequency(value: this['frequency']): this {
      this.frequency = value;
      return this;
   }
   setStrobeBrightness(value: this['strobeBrightness']): this {
      this.strobeBrightness = value;
      return this;
   }
   setStrobeFade(value: this['strobeFade']): this {
      this.strobeFade = value;
      return this;
   }
   setEasing(value: this['easing']): this {
      this.easing = value;
      return this;
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              (this.previous === 0 || this.previous === 1) &&
              this.easing >= -1 &&
              this.easing <= 103 &&
              this.color >= -1 &&
              this.color <= 2 &&
              this.brightness >= 0 &&
              this.frequency >= 0;
   }
}

import { BaseObject } from './abstract/baseObject.ts';
import type { IWrapEvent, IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import { EventType } from '../shared/constants.ts';
import { EventLightValue } from '../shared/constants.ts';
import { deepCopy } from '../../utils/misc.ts';

export class BasicEvent extends BaseObject implements IWrapEvent {
   static defaultValue: Required<IWrapEventAttribute> = {
      time: 0,
      type: 0,
      value: 0,
      floatValue: 0,
      customData: {},
   };
   static create(...data: Partial<IWrapEventAttribute>[]): BasicEvent[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapEventAttribute> = {}) {
      super();
      this.time = data.time ?? BasicEvent.defaultValue.time;
      this.type = data.type ?? BasicEvent.defaultValue.type;
      this.value = data.value ?? BasicEvent.defaultValue.value;
      this.floatValue = data.floatValue ?? BasicEvent.defaultValue.floatValue;
      this.customData = deepCopy(data.customData ?? BasicEvent.defaultValue.customData);
   }

   isValidType(): boolean {
      return (
         (this.type >= 0 && this.type <= 19) ||
         (this.type >= 40 && this.type <= 43) ||
         this.type === 100
      );
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) &&
              this.isValidType() &&
              this.value >= 0 &&
              !(!this.isLaserRotationEvent() && this.value > 12 && !this.isOldChroma());
   }

   type: IWrapEvent['type'];
   value: IWrapEvent['value'];
   floatValue: IWrapEvent['floatValue'];

   setType(value: this['type']): this {
      this.type = value;
      return this;
   }
   setValue(value: this['value']): this {
      this.value = value;
      return this;
   }
   setFloatValue(value: this['floatValue']): this {
      this.floatValue = value;
      return this;
   }

   isOff(): boolean {
      return this.value === EventLightValue.OFF;
   }
   isOn(): boolean {
      return (
         this.value === EventLightValue.BLUE_ON ||
         this.value === EventLightValue.RED_ON ||
         this.value === EventLightValue.WHITE_ON
      );
   }
   isFlash(): boolean {
      return (
         this.value === EventLightValue.BLUE_FLASH ||
         this.value === EventLightValue.RED_FLASH ||
         this.value === EventLightValue.WHITE_FLASH
      );
   }
   isFade(): boolean {
      return (
         this.value === EventLightValue.BLUE_FADE ||
         this.value === EventLightValue.RED_FADE ||
         this.value === EventLightValue.WHITE_FADE
      );
   }
   isTransition(): boolean {
      return (
         this.value === EventLightValue.BLUE_TRANSITION ||
         this.value === EventLightValue.RED_TRANSITION ||
         this.value === EventLightValue.WHITE_TRANSITION
      );
   }
   isBlue(): boolean {
      return (
         this.value === EventLightValue.BLUE_ON ||
         this.value === EventLightValue.BLUE_FLASH ||
         this.value === EventLightValue.BLUE_FADE ||
         this.value === EventLightValue.BLUE_TRANSITION
      );
   }
   isRed(): boolean {
      return (
         this.value === EventLightValue.RED_ON ||
         this.value === EventLightValue.RED_FLASH ||
         this.value === EventLightValue.RED_FADE ||
         this.value === EventLightValue.RED_TRANSITION
      );
   }
   isWhite(): boolean {
      return (
         this.value === EventLightValue.WHITE_ON ||
         this.value === EventLightValue.WHITE_FLASH ||
         this.value === EventLightValue.WHITE_FADE ||
         this.value === EventLightValue.WHITE_TRANSITION
      );
   }

   isLightEvent(): boolean {
      return (
         this.type === 0 ||
         this.type === 1 ||
         this.type === 2 ||
         this.type === 3 ||
         this.type === 4 ||
         this.type === 6 ||
         this.type === 7 ||
         this.type === 10 ||
         this.type === 11
      );
   }
   isColorBoost(): boolean {
      return this.type === EventType.COLOR_BOOST;
   }
   isRingEvent(): boolean {
      return this.type === EventType.RING_ROTATION || this.type === EventType.RING_ZOOM;
   }
   isLaserRotationEvent(): boolean {
      return (
         this.type === EventType.LEFT_LASER_ROTATION || this.type === EventType.RIGHT_LASER_ROTATION
      );
   }
   isLaneRotationEvent(): boolean {
      return (
         this.type === EventType.EARLY_LANE_ROTATION || this.type === EventType.LATE_LANE_ROTATION
      );
   }
   isExtraEvent(): boolean {
      return (
         this.type === EventType.UTILITY_EVENT_0 ||
         this.type === EventType.UTILITY_EVENT_1 ||
         this.type === EventType.UTILITY_EVENT_2 ||
         this.type === EventType.UTILITY_EVENT_3
      );
   }
   isSpecialEvent(): boolean {
      return (
         this.type === EventType.SPECIAL_EVENT_0 ||
         this.type === EventType.SPECIAL_EVENT_1 ||
         this.type === EventType.SPECIAL_EVENT_2 ||
         this.type === EventType.SPECIAL_EVENT_3
      );
   }
   isBpmEvent(): boolean {
      return this.type === EventType.BPM_CHANGE;
   }
   isLightingEvent(): boolean {
      return (
         this.isLightEvent() ||
         this.isRingEvent() ||
         this.isLaserRotationEvent() ||
         this.isExtraEvent()
      );
   }
   isOldChroma(): boolean {
      return this.value >= 2000000000;
   }
}

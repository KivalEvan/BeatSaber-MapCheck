import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';
import type { EnvironmentAllName } from '../shared/environment.ts';
import type { ICustomDataEvent } from './custom/event.ts';

export interface IWrapEventAttribute extends IWrapBaseObjectAttribute {
   /**
    * Event type `<int>` of basic event.
    * ```ts
    * 0 -> Back Lasers
    * 1 -> Ring Lights
    * 2 -> Left Lasers
    * 3 -> Right Lasers
    * 4 -> Center Lights
    * 5 -> Light Boost
    * 6 -> Extra Left Lights
    * 7 -> Extra Right Lights
    * 8 -> Ring Rotation
    * 9 -> Ring Zoom
    * 10 -> Extra Left Lasers
    * 11 -> Extra Right Lasers
    * 12 -> Left Laser Rotation
    * 13 -> Right Laser Rotation
    * 14 -> Early Lane Rotation
    * 15 -> Late Lane Rotation
    * 16 -> Utility Event 0
    * 17 -> Utility Event 1
    * 18 -> Utility Event 2
    * 19 -> Utility Event 3
    * 40 -> Special Event 0
    * 41 -> Special Event 1
    * 42 -> Special Event 2
    * 43 -> Special Event 3
    * 100 -> BPM Change
    * ```
    */
   type: number;
   /** Value `<int>` of basic event. */
   value: number;
   /** Float value `<float>` of basic event. */
   floatValue: number;
   customData: ICustomDataEvent;
}

export interface IWrapEvent extends Omit<IWrapBaseObject, 'customData'>, IWrapEventAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   setType(value: number): this;
   setValue(value: number): this;
   setFloatValue(value: number): this;

   /**
    * Check if light event is an off event.
    * ```ts
    * if (event.isOff()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isOff(): boolean;

   /**
    * Check if light event is an on event.
    * ```ts
    * if (event.isOn()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isOn(): boolean;

   /**
    * Check if light event is a flash event.
    * ```ts
    * if (event.isFlash()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isFlash(): boolean;

   /**
    * Check if light event is a fade event.
    * ```ts
    * if (event.isFade()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isFade(): boolean;

   /**
    * Check if light event is a transition event.
    * ```ts
    * if (event.isTransition()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isTransition(): boolean;

   /**
    * Check if light event is a blue light.
    * ```ts
    * if (event.isBlue()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isBlue(): boolean;

   /**
    * Check if light event is a red light.
    * ```ts
    * if (event.isRed()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isRed(): boolean;

   /**
    * Check if light event is a white light.
    * ```ts
    * if (event.isWhite()) {}
    * ```
    *
    * This may check non-light event too.
    */
   isWhite(): boolean;

   /**
    * Check if event is a light event.
    * ```ts
    * if (event.isLightEvent()) {}
    * ```
    */
   isLightEvent(environment?: EnvironmentAllName): boolean;

   /**
    * Check if event is a boost event.
    * ```ts
    * if (event.isColorBoost()) {}
    * ```
    */
   isColorBoost(): boolean;

   /**
    * Check if event is a ring event.
    * ```ts
    * if (event.isRingEvent()) {}
    * ```
    *
    * This does not check for ring zoom.
    */
   isRingEvent(environment?: EnvironmentAllName): boolean;

   /**
    * Check if event is a laser rotation event.
    * ```ts
    * if (event.isLaserRotationEvent()) {}
    * ```
    */
   isLaserRotationEvent(environment?: EnvironmentAllName): boolean;

   /**
    * Check if event is a lane rotation event.
    * ```ts
    * if (event.isLaneRotationEvent()) {}
    * ```
    */
   isLaneRotationEvent(): boolean;

   /**
    * Check if event is a extra event.
    * ```ts
    * if (event.isExtraEvent()) {}
    * ```
    */
   isExtraEvent(environment?: EnvironmentAllName): boolean;

   /**
    * Check if event is a special event.
    * ```ts
    * if (event.isSpecialEvent()) {}
    * ```
    */
   isSpecialEvent(environment?: EnvironmentAllName): boolean;

   /**
    * Check if event is a BPM change event.
    * ```ts
    * if (event.isBpmEvent()) {}
    * ```
    */
   isBpmEvent(): boolean;

   /**
    * Not to be confused with `isLightEvent`, this checks for event that affects the environment/lighting.
    * ```ts
    * if (event.isLightingEvent()) {}
    * ```
    */
   isLightingEvent(): boolean;

   /**
    * Check if event has old Chroma properties.
    * ```ts
    * if (event.isOldChroma()) {}
    * ```
    */
   isOldChroma(): boolean;

   /**
    * Check if event is a valid type.
    * ```ts
    * if (event.isValidType()) {}
    * ```
    */
   isValidType(): boolean;
}

// deno-lint-ignore-file no-unused-vars
import { WrapBaseObject } from './baseObject.ts';
import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { IWrapEvent } from '../../types/beatmap/wrapper/event.ts';

/** Event beatmap class object. */
export abstract class WrapEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapEvent<T>
{
   protected _type!: IWrapEvent['type'];
   protected _value!: IWrapEvent['value'];
   protected _floatValue!: IWrapEvent['floatValue'];

   get type(): IWrapEvent['type'] {
      return this._type;
   }
   set type(value: IWrapEvent['type']) {
      this._type = value;
   }
   get value(): IWrapEvent['value'] {
      return this._value;
   }
   set value(value: IWrapEvent['value']) {
      this._value = value;
   }
   get floatValue(): IWrapEvent['floatValue'] {
      return this._floatValue;
   }
   set floatValue(value: IWrapEvent['floatValue']) {
      this._floatValue = value;
   }

   setType(value: IWrapEvent['type']): this {
      this.type = value;
      return this;
   }
   setValue(value: IWrapEvent['value']): this {
      this.value = value;
      return this;
   }
   setFloatValue(value: IWrapEvent['floatValue']): this {
      this.floatValue = value;
      return this;
   }

   isOff(): boolean {
      return this.value === 0;
   }

   isOn(): boolean {
      return this.value === 1 || this.value === 5 || this.value === 9;
   }

   isFlash(): boolean {
      return this.value === 2 || this.value === 6 || this.value === 10;
   }

   isFade(): boolean {
      return this.value === 3 || this.value === 7 || this.value === 11;
   }

   isTransition(): boolean {
      return this.value === 4 || this.value === 8 || this.value === 12;
   }

   isBlue(): boolean {
      return this.value === 1 || this.value === 2 || this.value === 3 || this.value === 4;
   }

   isRed(): boolean {
      return this.value === 5 || this.value === 6 || this.value === 7 || this.value === 8;
   }

   isWhite(): boolean {
      return this.value === 9 || this.value === 10 || this.value === 11 || this.value === 12;
   }

   isLightEvent(environment?: EnvironmentAllName): boolean {
      switch (environment) {
         case 'LizzoEnvironment':
            return (
               this.type === 0 ||
               this.type === 1 ||
               this.type === 2 ||
               this.type === 3 ||
               this.type === 4 ||
               this.type === 6 ||
               this.type === 7 ||
               this.type === 8 ||
               this.type === 9 ||
               this.type === 10 ||
               this.type === 11 ||
               this.type === 12
            );
         default:
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
   }

   isColorBoost(): boolean {
      return this.type === 5;
   }

   isRingEvent(environment?: EnvironmentAllName): boolean {
      switch (environment) {
         case 'LizzoEnvironment':
            return false;
         default:
            return this.type === 8 || this.type === 9;
      }
   }

   isLaserRotationEvent(environment?: EnvironmentAllName): boolean {
      switch (environment) {
         case 'LizzoEnvironment':
            return false;
         default:
            return this.type === 12 || this.type === 13;
      }
   }

   isLaneRotationEvent(environment?: EnvironmentAllName): boolean {
      return this.type === 14 || this.type === 15;
   }

   isExtraEvent(environment?: EnvironmentAllName): boolean {
      return this.type === 16 || this.type === 17 || this.type === 18 || this.type === 19;
   }

   isSpecialEvent(environment?: EnvironmentAllName): boolean {
      return this.type === 40 || this.type === 41 || this.type === 42 || this.type === 43;
   }

   isBpmEvent(): boolean {
      return this.type === 100;
   }

   isLightingEvent(environment?: EnvironmentAllName): boolean {
      return (
         this.isLightEvent(environment) ||
         this.isRingEvent(environment) ||
         this.isLaserRotationEvent(environment) ||
         this.isExtraEvent(environment)
      );
   }

   isOldChroma(): boolean {
      return this.value >= 2000000000;
   }

   isValidType(): boolean {
      return (
         (this.type >= 0 && this.type <= 19) ||
         (this.type >= 40 && this.type <= 43) ||
         this.type === 100
      );
   }

   isValid(): boolean {
      return (
         this.isValidType() &&
         this.value >= 0 &&
         !(!this.isLaserRotationEvent() && this.value > 12 && !this.isOldChroma())
      );
   }
}

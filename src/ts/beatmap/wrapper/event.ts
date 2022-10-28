// deno-lint-ignore-file no-unused-vars
import { WrapBaseObject } from './baseObject';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IWrapEvent } from '../../types/beatmap/wrapper/event';

/** Event beatmap class object. */
export abstract class WrapEvent<T extends Record<keyof T, unknown>> extends WrapBaseObject<T> implements IWrapEvent {
    abstract get type(): IWrapEvent['type'];
    abstract set type(value: IWrapEvent['type']);
    abstract get value(): IWrapEvent['value'];
    abstract set value(value: IWrapEvent['value']);
    abstract get floatValue(): IWrapEvent['floatValue'];
    abstract set floatValue(value: IWrapEvent['floatValue']);

    setType(value: IWrapEvent['type']) {
        this.type = value;
        return this;
    }
    setValue(value: IWrapEvent['value']) {
        this.value = value;
        return this;
    }
    setFloatValue(value: IWrapEvent['floatValue']) {
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

    isBPMChangeEvent(): boolean {
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

    abstract isChroma(): boolean;

    isValidType(): boolean {
        return (this.type >= 0 && this.type <= 19) || (this.type >= 40 && this.type <= 43) || this.type === 100;
    }

    isValid(): boolean {
        return (
            this.isValidType() &&
            this.value >= 0 &&
            !(!this.isLaserRotationEvent() && this.value > 12 && !this.isOldChroma())
        );
    }
}

import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { ObjectToReturn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { BaseObject } from './baseObject';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends BaseObject<IColorBoostEvent> {
    static default: ObjectToReturn<Required<IColorBoostEvent>> = {
        b: 0,
        o: false,
        customData: () => {
            return {};
        },
    };

    private constructor(boostEvent: Required<IColorBoostEvent>) {
        super(boostEvent);
    }

    static create(): ColorBoostEvent;
    static create(colorBoostEvents: Partial<IColorBoostEvent>): ColorBoostEvent;
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent | ColorBoostEvent[] {
        const result: ColorBoostEvent[] = [];
        colorBoostEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.b ?? ColorBoostEvent.default.b,
                    o: be.o ?? ColorBoostEvent.default.o,
                    customData: be.customData ?? ColorBoostEvent.default.customData(),
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new this({
            b: ColorBoostEvent.default.b,
            o: ColorBoostEvent.default.o,
            customData: ColorBoostEvent.default.customData(),
        });
    }

    toObject(): Required<IColorBoostEvent> {
        return {
            b: this.time,
            o: this.toggle,
            customData: deepCopy(this.customData),
        };
    }

    /** Toggle `<boolean>` of boost event. */
    get toggle() {
        return this.data.o;
    }
    set toggle(value: IColorBoostEvent['o']) {
        this.data.o = value;
    }
}

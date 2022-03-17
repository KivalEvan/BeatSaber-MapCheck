import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { BaseObject } from './baseObject';

/** Boost event beatmap object. */
export class ColorBoostEvent extends BaseObject<IColorBoostEvent> {
    static default: Required<IColorBoostEvent> = {
        b: 0,
        o: false,
    };

    private constructor(boostEvent: Required<IColorBoostEvent>) {
        super(boostEvent);
    }

    static create(): ColorBoostEvent;
    static create(colorBoostEvents: Partial<IColorBoostEvent>): ColorBoostEvent;
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
    static create(
        ...colorBoostEvents: Partial<IColorBoostEvent>[]
    ): ColorBoostEvent | ColorBoostEvent[] {
        const result: ColorBoostEvent[] = [];
        colorBoostEvents?.forEach((be) =>
            result.push(
                new ColorBoostEvent({
                    b: be.b ?? ColorBoostEvent.default.b,
                    o: be.o ?? ColorBoostEvent.default.o,
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new ColorBoostEvent({
            b: ColorBoostEvent.default.b,
            o: ColorBoostEvent.default.o,
        });
    }

    toObject(): IColorBoostEvent {
        return {
            b: this.time,
            o: this.toggle,
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

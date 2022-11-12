import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapColorBoostEvent } from '../wrapper/colorBoostEvent';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends WrapColorBoostEvent<Required<IColorBoostEvent>> {
    static default: ObjectReturnFn<Required<IColorBoostEvent>> = {
        b: 0,
        o: false,
        customData: () => {
            return {};
        },
    };

    protected constructor(boostEvent: Required<IColorBoostEvent>) {
        super(boostEvent);
    }

    static create(): ColorBoostEvent[];
    static create(
        ...colorBoostEvents: PartialWrapper<IWrapColorBoostEvent<Required<IColorBoostEvent>>>[]
    ): ColorBoostEvent[];
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
    static create(
        ...colorBoostEvents: (Partial<IColorBoostEvent> &
            PartialWrapper<IWrapColorBoostEvent<Required<IColorBoostEvent>>>)[]
    ): ColorBoostEvent[];
    static create(
        ...colorBoostEvents: (Partial<IColorBoostEvent> &
            PartialWrapper<IWrapColorBoostEvent<Required<IColorBoostEvent>>>)[]
    ): ColorBoostEvent[] {
        const result: ColorBoostEvent[] = [];
        colorBoostEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.time ?? be.b ?? ColorBoostEvent.default.b,
                    o: be.toggle ?? be.o ?? ColorBoostEvent.default.o,
                    customData: be.customData ?? ColorBoostEvent.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: ColorBoostEvent.default.b,
                o: ColorBoostEvent.default.o,
                customData: ColorBoostEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IColorBoostEvent> {
        return {
            b: this.time,
            o: this.toggle,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IColorBoostEvent['b']) {
        this.data.b = value;
    }

    get toggle() {
        return this.data.o;
    }
    set toggle(value: IColorBoostEvent['o']) {
        this.data.o = value;
    }

    get customData(): NonNullable<IColorBoostEvent['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IColorBoostEvent['customData']>) {
        this.data.customData = value;
    }

    isValid(): boolean {
        return true;
    }
}

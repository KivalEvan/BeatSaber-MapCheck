import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapColorBoostEvent } from '../wrapper/colorBoostEvent';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends WrapColorBoostEvent<IColorBoostEvent> {
    static default: ObjectReturnFn<IColorBoostEvent> = {
        b: 0,
        o: false,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>);
    constructor(data: Partial<IColorBoostEvent>);
    constructor(
        data: Partial<IColorBoostEvent> & Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>,
    );
    constructor(
        data: Partial<IColorBoostEvent> &
            Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>> = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? ColorBoostEvent.default.b;
        this._toggle = data.toggle ?? data.o ?? ColorBoostEvent.default.o;
        this._customData = data.customData ?? ColorBoostEvent.default.customData();
    }

    static create(): ColorBoostEvent[];
    static create(
        ...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]
    ): ColorBoostEvent[];
    static create(...data: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
    static create(
        ...data: (Partial<IColorBoostEvent> &
            Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
    ): ColorBoostEvent[];
    static create(
        ...data: (Partial<IColorBoostEvent> &
            Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
    ): ColorBoostEvent[] {
        const result: ColorBoostEvent[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IColorBoostEvent {
        return {
            b: this.time,
            o: this.toggle,
            customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IColorBoostEvent['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IColorBoostEvent['customData']>) {
        this._customData = value;
    }

    isValid(): boolean {
        return true;
    }
}

import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { ObjectToReturn } from '../../types';
import { deepCopy } from '../../utils/misc';
import { BaseObject } from './baseObject';

/** Basic event beatmap object. */
export class BasicEvent extends BaseObject<IBasicEvent> {
    static default: ObjectToReturn<Required<IBasicEvent>> = {
        b: 0,
        et: 0,
        i: 0,
        f: 1,
        customData: () => {
            return {};
        },
    };

    private constructor(basicEvent: Required<IBasicEvent>) {
        super(basicEvent);
    }

    static create(): BasicEvent;
    static create(basicEvents: Partial<IBasicEvent>): BasicEvent;
    static create(...basicEvents: Partial<IBasicEvent>[]): BasicEvent[];
    static create(...basicEvents: Partial<IBasicEvent>[]): BasicEvent | BasicEvent[] {
        const result: BasicEvent[] = [];
        basicEvents?.forEach((be) =>
            result.push(
                new BasicEvent({
                    b: be.b ?? BasicEvent.default.b,
                    et: be.et ?? BasicEvent.default.et,
                    i: be.i ?? BasicEvent.default.i,
                    f: be.f ?? BasicEvent.default.f,
                    customData: be.customData ?? BasicEvent.default.customData(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new BasicEvent({
            b: BasicEvent.default.b,
            et: BasicEvent.default.et,
            i: BasicEvent.default.i,
            f: BasicEvent.default.f,
            customData: BasicEvent.default.customData(),
        });
    }

    toObject(): IBasicEvent {
        return {
            b: this.time,
            et: this.type,
            i: this.value,
            f: this.floatValue,
            customData: deepCopy(this.customData),
        };
    }

    /** Event type `<int>` of basic event.
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
    get type() {
        return this.data.et;
    }
    set type(value: IBasicEvent['et']) {
        this.data.et = value;
    }

    /** Value `<int>` of basic event. */
    get value() {
        return this.data.i;
    }
    set value(value: IBasicEvent['i']) {
        this.data.i = value;
    }

    /** Float value `<float>` of basic event. */
    get floatValue() {
        return this.data.f;
    }
    set floatValue(value: IBasicEvent['f']) {
        this.data.f = value;
    }

    setType(value: IBasicEvent['et']) {
        this.type = value;
        return this;
    }
    setValue(value: IBasicEvent['i']) {
        this.value = value;
        return this;
    }
    setFloatValue(value: IBasicEvent['f']) {
        this.floatValue = value;
        return this;
    }

    /** Check if light event is an off event.
     * ```ts
     * if (basicEvent.isOff()) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isOff() {
        return this.value === 0;
    }

    /** Check if light event is an on event.
     * ```ts
     * if (basicEvent.isOn()) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isOn() {
        return this.value === 1 || this.value === 5;
    }

    /** Check if light event is a flash event.
     * ```ts
     * if (basicEvent.isFlash()) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isFlash() {
        return this.value === 2 || this.value === 6;
    }

    /** Check if light event is a fade event.
     * ```ts
     * if (basicEvent.isFade()) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isFade() {
        return this.value === 3 || this.value === 7;
    }

    /** Check if light event is a transition event.
     * ```ts
     * if (basicEvent.isTransition()) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isTransition() {
        return this.value === 4 || this.value === 8;
    }

    /** Check if event is a valid type.
     * ```ts
     * if (basicEvent.isValidType()) {}
     * ```
     */
    isValidType() {
        return (this.type >= 0 && this.type <= 17) || this.type === 100;
    }

    /** Check if event is a light event.
     * ```ts
     * if (basicEvent.isLightEvent()) {}
     * ```
     */
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

    /** Check if event is a boost event.
     * ```ts
     * if (basicEvent.isColorBoost()) {}
     * ```
     */
    isColorBoost(): boolean {
        return this.type === 5;
    }

    /** Check if event is a ring event.
     * ```ts
     * if (basicEvent.isRingEvent()) {}
     * ```
     * ---
     * This does not check for ring zoom.
     */
    isRingEvent() {
        return this.type === 8;
    }

    /** Check if event is a ring zoom event.
     * ```ts
     * if (basicEvent.isZoomEvent()) {}
     * ```
     */
    isZoomEvent() {
        return this.type === 9;
    }

    /** Check if event is a laser rotation event.
     * ```ts
     * if (basicEvent.isLaserRotationEvent()) {}
     * ```
     */
    isLaserRotationEvent(): boolean {
        return this.type === 12 || this.type === 13;
    }

    /** Check if event is a lane rotation event.
     * ```ts
     * if (basicEvent.isLaneRotationEvent()) {}
     * ```
     */
    isLaneRotationEvent(): boolean {
        return this.type === 14 || this.type === 15;
    }

    /** Check if event is a extra event.
     * ```ts
     * if (basicEvent.isExtraEvent()) {}
     * ```
     */
    isExtraEvent(): boolean {
        return (
            this.type === 16 || this.type === 17 || this.type === 18 || this.type === 19
        );
    }

    /** Check if event is a special event.
     * ```ts
     * if (basicEvent.isSpecialEvent()) {}
     * ```
     */
    isSpecialEvent(): boolean {
        return (
            this.type === 40 || this.type === 41 || this.type === 42 || this.type === 43
        );
    }

    /** Check if event is a BPM change event.
     * ```ts
     * if (basicEvent.isBPMChangeEvent()) {}
     * ```
     */
    isBPMChangeEvent(): boolean {
        return this.type === 100;
    }

    /** Not to be confused with isLightEvent, this checks for event that affects the environment/lighting.
     * ```ts
     * if (basicEvent.isLightingEvent()) {}
     * ```
     */
    isLightingEvent() {
        return (
            this.isLightEvent() ||
            this.isRingEvent() ||
            this.isZoomEvent() ||
            this.isLaserRotationEvent() ||
            this.isExtraEvent()
        );
    }

    /** Check if event has old Chroma properties.
     * ```ts
     * if (basicEvent.hasOldChroma()) {}
     * ```
     */
    hasOldChroma() {
        return this.value >= 2000000000;
    }

    /** Check if event is a valid, vanilla event.
     * ```ts
     * if (basicEvent.isValid()) {}
     * ```
     */
    isValid() {
        return (
            this.isValidType() &&
            this.value >= 0 &&
            !(!this.isLaserRotationEvent() && this.value > 8 && !this.hasOldChroma())
        );
    }
}

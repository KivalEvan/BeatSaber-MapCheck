import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { LightRotationEventBox } from './lightRotationEventBox';
import { WrapLightRotationEventBoxGroup } from '../wrapper/lightRotationEventBoxGroup';
import { deepCopy } from '../../utils/misc';

/** Light translation event box group beatmap v3 class object. */
export class LightRotationEventBoxGroup extends WrapLightRotationEventBoxGroup<Required<ILightRotationEventBoxGroup>> {
    static default: ObjectReturnFn<Required<ILightRotationEventBoxGroup>> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    private _e: LightRotationEventBox[];
    protected constructor(eventBoxGroup: Required<ILightRotationEventBoxGroup>) {
        super(eventBoxGroup);
        this._e = eventBoxGroup.e.map((e) => LightRotationEventBox.create(e)[0]);
    }

    static create(): LightRotationEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightRotationEventBoxGroup>[]): LightRotationEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightRotationEventBoxGroup>[]): LightRotationEventBoxGroup[] {
        const result: LightRotationEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new this({
                    b: ebg.b ?? LightRotationEventBoxGroup.default.b,
                    g: ebg.g ?? LightRotationEventBoxGroup.default.g,
                    e: (ebg as Required<ILightRotationEventBoxGroup>).e ?? LightRotationEventBoxGroup.default.e(),
                    customData: ebg.customData ?? LightRotationEventBoxGroup.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightRotationEventBoxGroup.default.b,
                g: LightRotationEventBoxGroup.default.g,
                e: LightRotationEventBoxGroup.default.e(),
                customData: LightRotationEventBoxGroup.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightRotationEventBoxGroup> {
        return {
            b: this.time,
            g: this.id,
            e: this.events.map((e) => e.toJSON()),
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: ILightRotationEventBoxGroup['b']) {
        this.data.b = value;
    }

    get id() {
        return this.data.g;
    }
    set id(value: ILightRotationEventBoxGroup['g']) {
        this.data.g = value;
    }

    get events() {
        return this._e;
    }
    set events(value: LightRotationEventBox[]) {
        this._e = value;
    }

    get customData(): NonNullable<ILightRotationEventBoxGroup['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightRotationEventBoxGroup['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<ILightRotationEventBoxGroup['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ILightRotationEventBoxGroup['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }

    isValid(): boolean {
        return this.id >= 0;
    }
}

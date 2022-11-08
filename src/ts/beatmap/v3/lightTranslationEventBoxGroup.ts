import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { LightTranslationEventBox } from './lightTranslationEventBox';
import { WrapLightTranslationEventBoxGroup } from '../wrapper/lightTranslationEventBoxGroup';
import { deepCopy } from '../../utils/misc';

/** Light translation event box group beatmap v3 class object. */
export class LightTranslationEventBoxGroup extends WrapLightTranslationEventBoxGroup<
    Required<ILightTranslationEventBoxGroup>
> {
    static default: ObjectReturnFn<Required<ILightTranslationEventBoxGroup>> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    private _e: LightTranslationEventBox[];
    protected constructor(eventBoxGroup: Required<ILightTranslationEventBoxGroup>) {
        super(eventBoxGroup);
        this._e = eventBoxGroup.e.map((e) => LightTranslationEventBox.create(e)[0]);
    }

    static create(): LightTranslationEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightTranslationEventBoxGroup>[]): LightTranslationEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightTranslationEventBoxGroup>[]): LightTranslationEventBoxGroup[] {
        const result: LightTranslationEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new this({
                    b: ebg.b ?? LightTranslationEventBoxGroup.default.b,
                    g: ebg.g ?? LightTranslationEventBoxGroup.default.g,
                    e: (ebg as Required<ILightTranslationEventBoxGroup>).e ?? LightTranslationEventBoxGroup.default.e(),
                    customData: ebg.customData ?? LightTranslationEventBoxGroup.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightTranslationEventBoxGroup.default.b,
                g: LightTranslationEventBoxGroup.default.g,
                e: LightTranslationEventBoxGroup.default.e(),
                customData: LightTranslationEventBoxGroup.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightTranslationEventBoxGroup> {
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
    set time(value: ILightTranslationEventBoxGroup['b']) {
        this.data.b = value;
    }

    get id() {
        return this.data.g;
    }
    set id(value: ILightTranslationEventBoxGroup['g']) {
        this.data.g = value;
    }

    get events() {
        return this._e;
    }
    set events(value: LightTranslationEventBox[]) {
        this._e = value;
    }

    get customData(): NonNullable<ILightTranslationEventBoxGroup['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightTranslationEventBoxGroup['customData']>) {
        this.data.customData = value;
    }

    setCustomData(value: NonNullable<ILightTranslationEventBoxGroup['customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ILightTranslationEventBoxGroup['customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }

    isValid(): boolean {
        return this.id >= 0;
    }
}

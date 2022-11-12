import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { IWrapLightColorEventBoxGroup } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { DeepPartial, DeepPartialWrapper, ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorEventBoxGroup } from '../wrapper/lightColorEventBoxGroup';
import { LightColorEventBox } from './lightColorEventBox';

/** Light color event box group beatmap v3 class object. */
export class LightColorEventBoxGroup extends WrapLightColorEventBoxGroup<
    Required<ILightColorEventBoxGroup>,
    Required<ILightColorEventBox>,
    Required<ILightColorBase>,
    Required<IIndexFilter>
> {
    static default: ObjectReturnFn<Required<ILightColorEventBoxGroup>> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    private _e: LightColorEventBox[];
    protected constructor(eventBoxGroup: Required<ILightColorEventBoxGroup>) {
        super(eventBoxGroup);
        this._e = eventBoxGroup.e.map((e) => LightColorEventBox.create(e)[0]);
    }

    static create(): LightColorEventBoxGroup[];
    static create(
        ...eventBoxGroups: DeepPartialWrapper<
            IWrapLightColorEventBoxGroup<
                Required<ILightColorEventBoxGroup>,
                Required<ILightColorEventBox>,
                Required<ILightColorBase>,
                Required<IIndexFilter>
            >
        >[]
    ): LightColorEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>[]): LightColorEventBoxGroup[];
    static create(
        ...eventBoxGroups: (DeepPartial<ILightColorEventBoxGroup> &
            DeepPartialWrapper<
                IWrapLightColorEventBoxGroup<
                    Required<ILightColorEventBoxGroup>,
                    Required<ILightColorEventBox>,
                    Required<ILightColorBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightColorEventBoxGroup[];
    static create(
        ...eventBoxGroups: (DeepPartial<ILightColorEventBoxGroup> &
            DeepPartialWrapper<
                IWrapLightColorEventBoxGroup<
                    Required<ILightColorEventBoxGroup>,
                    Required<ILightColorEventBox>,
                    Required<ILightColorBase>,
                    Required<IIndexFilter>
                >
            >)[]
    ): LightColorEventBoxGroup[] {
        const result: LightColorEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new this({
                    b: ebg.time ?? ebg.b ?? LightColorEventBoxGroup.default.b,
                    g: ebg.id ?? ebg.g ?? LightColorEventBoxGroup.default.g,
                    e:
                        (ebg.events as ILightColorEventBox[]) ??
                        (ebg.e as unknown as ILightColorEventBox[]) ??
                        LightColorEventBoxGroup.default.e(),
                    customData: ebg.customData ?? LightColorEventBoxGroup.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightColorEventBoxGroup.default.b,
                g: LightColorEventBoxGroup.default.g,
                e: LightColorEventBoxGroup.default.e(),
                customData: LightColorEventBoxGroup.default.customData(),
            }),
        ];
    }

    toJSON(): Required<ILightColorEventBoxGroup> {
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
    set time(value: ILightColorEventBoxGroup['b']) {
        this.data.b = value;
    }

    get id() {
        return this.data.g;
    }
    set id(value: ILightColorEventBoxGroup['g']) {
        this.data.g = value;
    }

    get events(): LightColorEventBox[] {
        return this._e;
    }
    set events(value: LightColorEventBox[]) {
        this._e = value;
    }

    get customData(): NonNullable<ILightColorEventBoxGroup['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<ILightColorEventBoxGroup['customData']>) {
        this.data.customData = value;
    }

    isValid(): boolean {
        return this.id >= 0;
    }
}

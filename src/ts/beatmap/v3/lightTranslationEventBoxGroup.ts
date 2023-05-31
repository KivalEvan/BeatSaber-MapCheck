import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { LightTranslationEventBox } from './lightTranslationEventBox';
import { WrapLightTranslationEventBoxGroup } from '../wrapper/lightTranslationEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';

/** Light translation event box group beatmap v3 class object. */
export class LightTranslationEventBoxGroup extends WrapLightTranslationEventBoxGroup<
    ILightTranslationEventBoxGroup,
    ILightTranslationEventBox,
    ILightTranslationBase,
    IIndexFilter
> {
    static default: ObjectReturnFn<ILightTranslationEventBoxGroup> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(
        data: DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
                ILightTranslationEventBoxGroup,
                ILightTranslationEventBox,
                ILightTranslationBase,
                IIndexFilter
            >
        >,
    );
    constructor(data: DeepPartial<ILightTranslationEventBoxGroup>);
    constructor(
        data: DeepPartial<ILightTranslationEventBoxGroup> &
            DeepPartial<
                IWrapLightTranslationEventBoxGroupAttribute<
                    ILightTranslationEventBoxGroup,
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >,
    );
    constructor(
        data: DeepPartial<ILightTranslationEventBoxGroup> &
            DeepPartial<
                IWrapLightTranslationEventBoxGroupAttribute<
                    ILightTranslationEventBoxGroup,
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            > = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? LightTranslationEventBoxGroup.default.b;
        this._id = data.id ?? data.g ?? LightTranslationEventBoxGroup.default.g;
        this._boxes = (
            (data.boxes as ILightTranslationEventBox[]) ??
            (data.e as unknown as ILightTranslationEventBox[]) ??
            LightTranslationEventBoxGroup.default.e()
        ).map((obj) => new LightTranslationEventBox(obj));
        this._customData = data.customData ?? LightTranslationEventBoxGroup.default.customData();
    }

    static create(): LightTranslationEventBoxGroup[];
    static create(
        ...data: DeepPartial<
            IWrapLightTranslationEventBoxGroupAttribute<
                ILightTranslationEventBoxGroup,
                ILightTranslationEventBox,
                ILightTranslationBase,
                IIndexFilter
            >
        >[]
    ): LightTranslationEventBoxGroup[];
    static create(
        ...data: DeepPartial<ILightTranslationEventBoxGroup>[]
    ): LightTranslationEventBoxGroup[];
    static create(
        ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
            DeepPartial<
                IWrapLightTranslationEventBoxGroupAttribute<
                    ILightTranslationEventBoxGroup,
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >)[]
    ): LightTranslationEventBoxGroup[];
    static create(
        ...data: (DeepPartial<ILightTranslationEventBoxGroup> &
            DeepPartial<
                IWrapLightTranslationEventBoxGroupAttribute<
                    ILightTranslationEventBoxGroup,
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >)[]
    ): LightTranslationEventBoxGroup[] {
        const result: LightTranslationEventBoxGroup[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ILightTranslationEventBoxGroup {
        return {
            b: this.time,
            g: this.id,
            e: this.boxes.map((e) => e.toJSON()),
            customData: deepCopy(this.customData),
        };
    }

    get boxes() {
        return this._boxes as LightTranslationEventBox[];
    }
    set boxes(value: LightTranslationEventBox[]) {
        this._boxes = value;
    }

    get customData(): NonNullable<ILightTranslationEventBoxGroup['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<ILightTranslationEventBoxGroup['customData']>) {
        this._customData = value;
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

import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { IWrapLightTranslationEventBoxAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBox';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightTranslationEventBox } from '../wrapper/lightTranslationEventBox';
import { IndexFilter } from './indexFilter';
import { LightTranslationBase } from './lightTranslationBase';

/** Light translation event box beatmap v3 class object. */
export class LightTranslationEventBox extends WrapLightTranslationEventBox<
    ILightTranslationEventBox,
    ILightTranslationBase,
    IIndexFilter
> {
    static default: ObjectReturnFn<ILightTranslationEventBox> = {
        f: () => {
            return {
                f: IndexFilter.default.f,
                p: IndexFilter.default.p,
                t: IndexFilter.default.t,
                r: IndexFilter.default.r,
                c: IndexFilter.default.c,
                n: IndexFilter.default.n,
                s: IndexFilter.default.s,
                l: IndexFilter.default.l,
                d: IndexFilter.default.d,
            };
        },
        w: 0,
        d: 1,
        s: 0,
        t: 1,
        a: 0,
        r: 0,
        b: 0,
        i: 0,
        l: () => [],
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(
        data: DeepPartial<
            IWrapLightTranslationEventBoxAttribute<
                ILightTranslationEventBox,
                ILightTranslationBase,
                IIndexFilter
            >
        >,
    );
    constructor(data: DeepPartial<ILightTranslationEventBox>);
    constructor(
        data: DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >,
    );
    constructor(
        data: DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            > = {},
    ) {
        super();

        this._filter = new IndexFilter(
            (data.filter as IIndexFilter) ??
                (data as ILightTranslationEventBox).f ??
                LightTranslationEventBox.default.f(),
        );
        this._beatDistribution =
            data.beatDistribution ?? data.w ?? LightTranslationEventBox.default.w;
        this._beatDistributionType =
            data.beatDistributionType ?? data.d ?? LightTranslationEventBox.default.d;
        this._translationDistribution =
            data.translationDistribution ?? data.s ?? LightTranslationEventBox.default.s;
        this._translationDistributionType =
            data.translationDistributionType ?? data.t ?? LightTranslationEventBox.default.t;
        this._axis = data.axis ?? data.a ?? LightTranslationEventBox.default.a;
        this._flip = data.flip ?? data.r ?? LightTranslationEventBox.default.r;
        this._affectFirst = data.affectFirst ?? data.b ?? LightTranslationEventBox.default.b;
        this._easing = data.easing ?? data.i ?? LightTranslationEventBox.default.i;
        this._events = (
            (data.events as ILightTranslationBase[]) ??
            (data as ILightTranslationEventBox).l ??
            LightTranslationEventBox.default.l()
        ).map((obj) => new LightTranslationBase(obj));
        this._customData = data.customData ?? LightTranslationEventBox.default.customData();
    }

    static create(): LightTranslationEventBox[];
    static create(
        ...data: DeepPartial<
            IWrapLightTranslationEventBoxAttribute<
                ILightTranslationEventBox,
                ILightTranslationBase,
                IIndexFilter
            >
        >[]
    ): LightTranslationEventBox[];
    static create(...data: DeepPartial<ILightTranslationEventBox>[]): LightTranslationEventBox[];
    static create(
        ...data: (DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >)[]
    ): LightTranslationEventBox[];
    static create(
        ...data: (DeepPartial<ILightTranslationEventBox> &
            DeepPartial<
                IWrapLightTranslationEventBoxAttribute<
                    ILightTranslationEventBox,
                    ILightTranslationBase,
                    IIndexFilter
                >
            >)[]
    ): LightTranslationEventBox[] {
        const result: LightTranslationEventBox[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ILightTranslationEventBox {
        return {
            f: this.filter.toJSON(),
            w: this.beatDistribution,
            d: this.beatDistributionType,
            s: this.translationDistribution,
            t: this.translationDistributionType,
            a: this.axis,
            r: this.flip,
            b: this.affectFirst,
            i: this.easing,
            l: this.events.map((l) => l.toJSON()),
            customData: deepCopy(this.customData),
        };
    }

    get filter() {
        return this._filter as IndexFilter;
    }
    set filter(value: IndexFilter) {
        this._filter = value;
    }

    get events() {
        return this._events as LightTranslationBase[];
    }
    set events(value: LightTranslationBase[]) {
        this._events = value;
    }

    get customData(): NonNullable<ILightTranslationEventBox['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<ILightTranslationEventBox['customData']>) {
        this._customData = value;
    }

    setEvents(value: LightTranslationBase[]): this {
        this.events = value;
        return this;
    }
}

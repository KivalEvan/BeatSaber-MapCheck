import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { SpecialEventsKeywordFiltersKeywords } from './specialEventsKeywordFiltersKeywords';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';

/** Special event types with keywords beatmap v2 class object. */
export class SpecialEventsKeywordFilters extends WrapEventTypesWithKeywords<
    ISpecialEventsKeywordFilters,
    ISpecialEventsKeywordFiltersKeywords
> {
    static default: ObjectReturnFn<ISpecialEventsKeywordFilters> = {
        _keywords: () => [],
    };

    constructor();
    constructor(data: DeepPartial<IWrapEventTypesWithKeywordsAttribute>);
    constructor(data: DeepPartial<ISpecialEventsKeywordFilters>);
    constructor(
        data: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
    );
    constructor(
        data: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
    ) {
        super();

        this._list = (
            (data.list?.map((k) => {
                return { _keyword: k?.keyword, _specialEvents: k?.events };
            }) as ISpecialEventsKeywordFiltersKeywords[]) ??
            data._keywords ??
            SpecialEventsKeywordFilters.default._keywords()
        ).map(
            (d) =>
                new SpecialEventsKeywordFiltersKeywords({
                    _keyword: d._keyword,
                    _specialEvents: d._specialEvents,
                }),
        );
    }

    static create(): SpecialEventsKeywordFilters;
    static create(
        data: DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
    ): SpecialEventsKeywordFilters;
    static create(data: DeepPartial<ISpecialEventsKeywordFilters>): SpecialEventsKeywordFilters;
    static create(
        data: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
    ): SpecialEventsKeywordFilters;
    static create(
        data: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
    ): SpecialEventsKeywordFilters {
        return new this(data);
    }

    toJSON(): ISpecialEventsKeywordFilters {
        return {
            _keywords: this.list.map((d) => d.toJSON()),
        };
    }

    get list() {
        return this._list as SpecialEventsKeywordFiltersKeywords[];
    }
    set list(value: SpecialEventsKeywordFiltersKeywords[]) {
        this._list = value;
    }

    addData(value: SpecialEventsKeywordFiltersKeywords) {
        this._list.push(value);
        return this;
    }
}

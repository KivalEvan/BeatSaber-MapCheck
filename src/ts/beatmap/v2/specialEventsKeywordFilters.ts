import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { SpecialEventsKeywordFiltersKeywords } from './specialEventsKeywordFiltersKeywords';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';

/** Special event types with keywords beatmap v2 class object. */
export class SpecialEventsKeywordFilters extends WrapEventTypesWithKeywords<
    Required<ISpecialEventsKeywordFilters>,
    Required<ISpecialEventsKeywordFiltersKeywords>
> {
    static default: ObjectReturnFn<Required<ISpecialEventsKeywordFilters>> = {
        _keywords: () => [],
    };

    private _d: SpecialEventsKeywordFiltersKeywords[];
    protected constructor(specialEventsWithKeywords: Required<ISpecialEventsKeywordFilters>) {
        super(specialEventsWithKeywords);
        this._d = specialEventsWithKeywords._keywords.map(
            (d) =>
                SpecialEventsKeywordFiltersKeywords.create({
                    _keyword: d._keyword,
                    _specialEvents: d._specialEvents,
                })[0],
        );
    }

    static create(): SpecialEventsKeywordFilters;
    static create(
        specialEventsWithKeywords: DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
    ): SpecialEventsKeywordFilters;
    static create(specialEventsWithKeywords: DeepPartial<ISpecialEventsKeywordFilters>): SpecialEventsKeywordFilters;
    static create(
        specialEventsWithKeywords: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
    ): SpecialEventsKeywordFilters;
    static create(
        specialEventsWithKeywords: DeepPartial<ISpecialEventsKeywordFilters> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
    ): SpecialEventsKeywordFilters {
        return new this({
            _keywords:
                (specialEventsWithKeywords.list?.map((k) => {
                    return { _keyword: k?.keyword, _specialEvents: k?.events };
                }) as ISpecialEventsKeywordFiltersKeywords[]) ??
                specialEventsWithKeywords._keywords ??
                SpecialEventsKeywordFilters.default._keywords(),
        });
    }

    toJSON(): ISpecialEventsKeywordFilters {
        return {
            _keywords: this._d.map((d) => d.toJSON()),
        };
    }

    get list() {
        return this._d;
    }
    set list(value: SpecialEventsKeywordFiltersKeywords[]) {
        this._d = value;
    }

    addData(value: SpecialEventsKeywordFiltersKeywords) {
        this._d.push(value);
        return this;
    }
}

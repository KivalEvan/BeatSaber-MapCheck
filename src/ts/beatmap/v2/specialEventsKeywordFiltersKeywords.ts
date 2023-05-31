import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { IWrapEventTypesForKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { ObjectReturnFn } from '../../types/utils';
import { WrapEventTypesForKeywords } from '../wrapper/eventTypesForKeywords';

/** Special event types for keywords beatmap v2 class object.
 *
 * Used in special event types with keywords.
 */
export class SpecialEventsKeywordFiltersKeywords extends WrapEventTypesForKeywords<ISpecialEventsKeywordFiltersKeywords> {
    static default: ObjectReturnFn<ISpecialEventsKeywordFiltersKeywords> = {
        _keyword: '',
        _specialEvents: () => [],
    };

    constructor();
    constructor(data: Partial<IWrapEventTypesForKeywordsAttribute>);
    constructor(data: Partial<ISpecialEventsKeywordFiltersKeywords>);
    constructor(
        data: Partial<ISpecialEventsKeywordFiltersKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute>,
    );
    constructor(
        data: Partial<ISpecialEventsKeywordFiltersKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute> = {},
    ) {
        super();

        this._keyword =
            data.keyword ?? data._keyword ?? SpecialEventsKeywordFiltersKeywords.default._keyword;
        this._events =
            data.events ??
            data._specialEvents ??
            SpecialEventsKeywordFiltersKeywords.default._specialEvents();
    }

    static create(): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...data: Partial<IWrapEventTypesForKeywordsAttribute>[]
    ): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...data: Partial<ISpecialEventsKeywordFiltersKeywords>[]
    ): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...data: (Partial<ISpecialEventsKeywordFiltersKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute>)[]
    ): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...data: (Partial<ISpecialEventsKeywordFiltersKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute>)[]
    ): SpecialEventsKeywordFiltersKeywords[] {
        const result: SpecialEventsKeywordFiltersKeywords[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): ISpecialEventsKeywordFiltersKeywords {
        return {
            _keyword: this.keyword,
            _specialEvents: this.events,
        };
    }
}

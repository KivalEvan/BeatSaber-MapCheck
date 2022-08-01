import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords';
import { ObjectReturnFn } from '../../types/utils';
import { Serializable } from '../shared/serializable';

/** Special event types for keywords beatmap v2 class object.
 *
 * Used in special event types with keywords.
 */
export class SpecialEventsKeywordFiltersKeywords extends Serializable<ISpecialEventsKeywordFiltersKeywords> {
    static default: ObjectReturnFn<Required<ISpecialEventsKeywordFiltersKeywords>> = {
        _keyword: '',
        _specialEvents: () => [],
    };

    protected constructor(specialEventsForKeywords: Required<ISpecialEventsKeywordFiltersKeywords>) {
        super(specialEventsForKeywords);
    }

    static create(): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...basicEventTypesForKeywords: Partial<ISpecialEventsKeywordFiltersKeywords>[]
    ): SpecialEventsKeywordFiltersKeywords[];
    static create(
        ...basicEventTypesForKeywords: Partial<ISpecialEventsKeywordFiltersKeywords>[]
    ): SpecialEventsKeywordFiltersKeywords[] {
        const result: SpecialEventsKeywordFiltersKeywords[] = [];
        basicEventTypesForKeywords?.forEach((betfk) =>
            result.push(
                new this({
                    _keyword: betfk._keyword ?? SpecialEventsKeywordFiltersKeywords.default._keyword,
                    _specialEvents:
                        betfk._specialEvents ?? SpecialEventsKeywordFiltersKeywords.default._specialEvents(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _keyword: SpecialEventsKeywordFiltersKeywords.default._keyword,
                _specialEvents: SpecialEventsKeywordFiltersKeywords.default._specialEvents(),
            }),
        ];
    }

    toJSON(): ISpecialEventsKeywordFiltersKeywords {
        return {
            _keyword: this.keyword,
            _specialEvents: this.events,
        };
    }

    /** Keyword `<string>` of basic event types for keywords. */
    get keyword() {
        return this.data._keyword;
    }
    set keyword(value: ISpecialEventsKeywordFiltersKeywords['_keyword']) {
        this.data._keyword = value;
    }

    /** Event type `<int[]>` of basic event types for keywords. */
    get events() {
        return this.data._specialEvents;
    }
    set events(value: ISpecialEventsKeywordFiltersKeywords['_specialEvents']) {
        this.data._specialEvents = value;
    }

    setKeyword(value: ISpecialEventsKeywordFiltersKeywords['_keyword']) {
        this.keyword = value;
        return this;
    }
    setEvents(value: ISpecialEventsKeywordFiltersKeywords['_specialEvents']) {
        this.events = value;
        return this;
    }
    addEvent(value: number) {
        this.events.push(value);
        return this;
    }
    removeEvent(value: number) {
        const index = this.events.indexOf(value, 0);
        if (index > -1) {
            this.events.splice(index, 1);
        }
        return this;
    }
}

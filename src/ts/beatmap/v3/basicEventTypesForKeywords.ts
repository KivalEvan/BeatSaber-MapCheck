import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IWrapEventTypesForKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { ObjectReturnFn } from '../../types/utils';
import { WrapEventTypesForKeywords } from '../wrapper/eventTypesForKeywords';

/** Basic event types for keywords beatmap v3 class object.
 *
 * Used in basic event types with keywords.
 */
export class BasicEventTypesForKeywords extends WrapEventTypesForKeywords<IBasicEventTypesForKeywords> {
    static default: ObjectReturnFn<IBasicEventTypesForKeywords> = {
        k: '',
        e: () => [],
    };

    constructor();
    constructor(data: Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>);
    constructor(
        data: Partial<IBasicEventTypesForKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>,
    );
    constructor(
        data: Partial<IBasicEventTypesForKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>> = {},
    ) {
        super();

        this._keyword = data.keyword ?? data.k ?? BasicEventTypesForKeywords.default.k;
        this._events = data.events ?? data.e ?? BasicEventTypesForKeywords.default.e();
    }

    static create(): BasicEventTypesForKeywords[];
    static create(
        ...data: Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>[]
    ): BasicEventTypesForKeywords[];
    static create(
        ...data: (Partial<IBasicEventTypesForKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>)[]
    ): BasicEventTypesForKeywords[];
    static create(
        ...data: (Partial<IBasicEventTypesForKeywords> &
            Partial<IWrapEventTypesForKeywordsAttribute<IBasicEventTypesForKeywords>>)[]
    ): BasicEventTypesForKeywords[] {
        const result: BasicEventTypesForKeywords[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IBasicEventTypesForKeywords {
        return {
            k: this.keyword,
            e: this.events,
        };
    }
}

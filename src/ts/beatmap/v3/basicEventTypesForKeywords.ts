import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { ObjectReturnFn } from '../../types/utils';
import { Serializable } from '../shared/serializable';

/** Basic event types for keywords beatmap v3 class object.
 *
 * Used in basic event types with keywords.
 */
export class BasicEventTypesForKeywords extends Serializable<IBasicEventTypesForKeywords> {
    static default: ObjectReturnFn<Required<IBasicEventTypesForKeywords>> = {
        k: '',
        e: () => [],
    };

    protected constructor(basicEventTypesForKeywords: Required<IBasicEventTypesForKeywords>) {
        super(basicEventTypesForKeywords);
    }

    static create(): BasicEventTypesForKeywords[];
    static create(...basicEventTypesForKeywords: Partial<IBasicEventTypesForKeywords>[]): BasicEventTypesForKeywords[];
    static create(...basicEventTypesForKeywords: Partial<IBasicEventTypesForKeywords>[]): BasicEventTypesForKeywords[] {
        const result: BasicEventTypesForKeywords[] = [];
        basicEventTypesForKeywords?.forEach((betfk) =>
            result.push(
                new this({
                    k: betfk.k ?? BasicEventTypesForKeywords.default.k,
                    e: betfk.e ?? BasicEventTypesForKeywords.default.e(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                k: BasicEventTypesForKeywords.default.k,
                e: BasicEventTypesForKeywords.default.e(),
            }),
        ];
    }

    toJSON(): IBasicEventTypesForKeywords {
        return {
            k: this.keyword,
            e: this.events,
        };
    }

    /** Keyword `<string>` of basic event types for keywords. */
    get keyword() {
        return this.data.k;
    }
    set keyword(value: IBasicEventTypesForKeywords['k']) {
        this.data.k = value;
    }

    /** Event type `<int[]>` of basic event types for keywords. */
    get events() {
        return this.data.e;
    }
    set events(value: IBasicEventTypesForKeywords['e']) {
        this.data.e = value;
    }

    setKeyword(value: IBasicEventTypesForKeywords['k']) {
        this.keyword = value;
        return this;
    }
    setEvents(value: IBasicEventTypesForKeywords['e']) {
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

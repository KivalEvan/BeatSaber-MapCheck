import { IWrapEventTypesForKeywords } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { Serializable } from '../shared/serializable';

/** Basic event types for keywords beatmap class object.
 *
 * Used in basic event types with keywords.
 */
export abstract class WrapEventTypesForKeywords<T extends { [P in keyof T]: T[P] }>
    extends Serializable<T>
    implements IWrapEventTypesForKeywords<T>
{
    protected _keyword!: IWrapEventTypesForKeywords['keyword'];
    protected _events!: IWrapEventTypesForKeywords['events'];

    get keyword(): IWrapEventTypesForKeywords['keyword'] {
        return this._keyword;
    }
    set keyword(value: IWrapEventTypesForKeywords['keyword']) {
        this._keyword = value;
    }
    get events(): IWrapEventTypesForKeywords['events'] {
        return this._events;
    }
    set events(value: IWrapEventTypesForKeywords['events']) {
        this._events = value;
    }

    setKeyword(value: IWrapEventTypesForKeywords['keyword']) {
        this.keyword = value;
        return this;
    }
    setEvents(value: IWrapEventTypesForKeywords['events']) {
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

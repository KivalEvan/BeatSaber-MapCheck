import { IWrapEventTypesForKeywords } from '../../types/beatmap/wrapper/eventTypesForKeywords';
import { Serializable } from '../shared/serializable';

/** Basic event types for keywords beatmap class object.
 *
 * Used in basic event types with keywords.
 */
export abstract class WrapEventTypesForKeywords<T extends Record<keyof T, unknown>>
    extends Serializable<T>
    implements IWrapEventTypesForKeywords
{
    abstract get keyword(): IWrapEventTypesForKeywords['keyword'];
    abstract set keyword(value: IWrapEventTypesForKeywords['keyword']);
    abstract get events(): IWrapEventTypesForKeywords['events'];
    abstract set events(value: IWrapEventTypesForKeywords['events']);

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

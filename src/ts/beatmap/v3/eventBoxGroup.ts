import { IEventBoxGroup } from '../../types/beatmap/v3/eventBoxGroup';
import { BaseObject } from './baseObject';

export abstract class EventBoxGroup extends BaseObject<IEventBoxGroup> {
    /** Toggle `<boolean>` of boost event. */
    get groupID() {
        return this.data.g;
    }
    set groupID(value: IEventBoxGroup['g']) {
        this.data.g = value;
    }
}

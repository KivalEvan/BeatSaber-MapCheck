import { IEventBoxGroupTemplate } from '../../types/beatmap/v3/eventBoxGroupTemplate';
import { Serializable } from '../shared/serializable';
import { EventBoxGroup } from './eventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { IEventBox } from '../../types/beatmap/v3/eventBox';

/** Base event box group template beatmap v3 class object. */
export abstract class EventBoxGroupTemplate<T extends IEventBox, U extends Serializable<T>> extends EventBoxGroup {
    private _e: U[];

    protected constructor(eventBoxGroup: Required<IEventBoxGroupTemplate<T>>, objects: U[]) {
        super(eventBoxGroup);
        this._e = objects;
    }

    toJSON(): Required<IEventBoxGroupTemplate<T>> {
        return {
            b: this.time,
            g: this.groupID,
            e: this.events.map((e) => e.toJSON()),
            customData: deepCopy(this.customData),
        };
    }

    get events() {
        return this._e;
    }
    set events(value: U[]) {
        this._e = value;
    }
}

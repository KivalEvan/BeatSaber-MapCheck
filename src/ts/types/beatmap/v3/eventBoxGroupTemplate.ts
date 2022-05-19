import { IEventBoxGroup } from './eventBoxGroup';

export interface IEventBoxGroupTemplate<T> extends IEventBoxGroup {
    e: T[];
}

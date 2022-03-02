import { EventBoxGroup } from './eventBoxGroup';

export interface EventBoxGroupTemplate<T> extends EventBoxGroup {
    e: T[];
}

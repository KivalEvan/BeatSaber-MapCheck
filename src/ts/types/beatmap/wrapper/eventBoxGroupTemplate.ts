import { IWrapEventBoxGroup } from './eventBoxGroup';

export interface IWrapEventBoxGroupTemplate<T> extends IWrapEventBoxGroup {
    events: T[];
}

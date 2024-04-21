// deno-lint-ignore-file no-explicit-any
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';

export interface IWrapEventBoxGroupAttribute<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<TGroup> {
   /** Group ID `<int>` of event box group */
   id: number;
   boxes: IWrapEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapEventBoxGroup<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapBaseObject<TGroup>,
      IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapEventBox<TBox, TBase, TFilter>[];
}

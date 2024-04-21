// deno-lint-ignore-file no-explicit-any
import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type { IWrapFxEventBox, IWrapFxEventBoxAttribute } from './fxEventBox.ts';

export interface IWrapFxEventBoxGroupAttribute<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapFxEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapFxEventBoxGroup<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter>,
      IWrapFxEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapFxEventBox<TBox, TBase, TFilter>[];
}

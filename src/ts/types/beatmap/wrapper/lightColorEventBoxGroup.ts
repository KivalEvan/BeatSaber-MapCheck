// deno-lint-ignore-file no-explicit-any
import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type {
   IWrapLightColorEventBox,
   IWrapLightColorEventBoxAttribute,
} from './lightColorEventBox.ts';

export interface IWrapLightColorEventBoxGroupAttribute<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapLightColorEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapLightColorEventBoxGroup<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter>,
      IWrapLightColorEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapLightColorEventBox<TBox, TBase, TFilter>[];
}

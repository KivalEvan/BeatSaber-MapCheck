// deno-lint-ignore-file no-explicit-any
import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBox,
   IWrapLightTranslationEventBoxAttribute,
} from './lightTranslationEventBox.ts';

export interface IWrapLightTranslationEventBoxGroupAttribute<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapLightTranslationEventBoxAttribute<TBox, TBase, TFilter>[];
}

export interface IWrapLightTranslationEventBoxGroup<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroup<TGroup, TBox, TBase, TFilter>,
      IWrapLightTranslationEventBoxGroupAttribute<TGroup, TBox, TBase, TFilter> {
   boxes: IWrapLightTranslationEventBox<TBox, TBase, TFilter>[];
}

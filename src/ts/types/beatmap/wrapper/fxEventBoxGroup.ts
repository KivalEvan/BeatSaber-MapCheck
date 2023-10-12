// deno-lint-ignore-file no-explicit-any
import { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup';
import { IWrapFxEventBox, IWrapFxEventBoxAttribute } from './fxEventBox';

export interface IWrapFxEventBoxGroupAttribute<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroupAttribute<TGroup, TBox, number, TFilter> {
   boxes: IWrapFxEventBoxAttribute<TBox, TFilter>[];
   /**
    * Type `<int>` of FX event.
    * ```ts
    * 0 -> Int
    * 1 -> Float
    * 2 -> Bool
    * ```
    */
   type: 0 | 1 | 2;
}

export interface IWrapFxEventBoxGroup<
   TGroup extends { [P in keyof TGroup]: TGroup[P] } = Record<string, any>,
   TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
   TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapEventBoxGroup<TGroup, TBox, number, TFilter>,
      IWrapFxEventBoxGroupAttribute<TGroup, TBox, TFilter> {
   boxes: IWrapFxEventBox<TBox, TFilter>[];
}

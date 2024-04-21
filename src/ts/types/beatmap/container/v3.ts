import type { FxType } from '../../../beatmap/shared/constants.ts';
import type { IEventBoxGroup } from '../v3/eventBoxGroup.ts';
import type { IFxEventBox } from '../v3/fxEventBox.ts';
import type { IFxEventFloat } from '../v3/fxEventFloat.ts';

export interface IEventBoxGroupContainer<TBox, TEvent> {
   object: IEventBoxGroup<TBox> & { t: FxType };
   boxData: TEvent[];
}

export interface IFxEventFloatBoxContainer {
   data: IFxEventBox;
   eventData: IFxEventFloat[];
}

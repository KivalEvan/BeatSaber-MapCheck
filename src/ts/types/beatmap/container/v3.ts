import { FxType } from '../../../beatmap/shared/constants';
import { IEventBoxGroup } from '../v3/eventBoxGroup';
import { IFxEventBox } from '../v3/fxEventBox';
import { IFxEventFloat } from '../v3/fxEventFloat';

export interface IEventBoxGroupContainer<TBox, TEvent> {
   object: IEventBoxGroup<TBox> & { t: FxType };
   boxData: TEvent[];
}

export interface IFxEventFloatBoxContainer {
   data: IFxEventBox;
   eventData: IFxEventFloat[];
}

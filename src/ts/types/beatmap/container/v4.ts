import type { IArc } from '../v4/arc.ts';
import type { IBasicEvent } from '../v4/basicEvent.ts';
import type { IBombNote } from '../v4/bombNote.ts';
import type { IChain } from '../v4/chain.ts';
import type { IColorBoostEvent } from '../v4/colorBoostEvent.ts';
import type { IColorNote } from '../v4/colorNote.ts';
import type { IEventBoxGroup } from '../v4/eventBoxGroup.ts';
import type { IFxEventBox } from '../v4/fxEventBox.ts';
import type { IFxEventFloat } from '../v4/fxEventFloat.ts';
import type { IIndexFilter } from '../v4/indexFilter.ts';
import type { ILightColorEvent } from '../v4/lightColorEvent.ts';
import type { ILightColorEventBox } from '../v4/lightColorEventBox.ts';
import type { ILightRotationEvent } from '../v4/lightRotationEvent.ts';
import type { ILightRotationEventBox } from '../v4/lightRotationEventBox.ts';
import type { ILightTranslationEvent } from '../v4/lightTranslationEvent.ts';
import type { ILightTranslationEventBox } from '../v4/lightTranslationEventBox.ts';
import type { IObjectLane } from '../v4/object.ts';
import type { IObject, IObjectArc, IObjectChain } from '../v4/object.ts';
import type { IObstacle } from '../v4/obstacle.ts';
import type { ISpawnRotation } from '../v4/spawnRotation.ts';
import type { IWaypoint } from '../v4/waypoint.ts';

export interface IArcContainer {
   object: IObjectArc;
   data: IArc;
   headData: IColorNote;
   tailData: IColorNote;
}

export interface IBasicEventContainer {
   object: IObject;
   data: IBasicEvent;
}

export interface IBombNoteContainer {
   object: IObjectLane;
   data: IBombNote;
}

export interface IChainContainer {
   object: IObjectChain;
   data: IColorNote;
   chainData: IChain;
}

export interface IColorBoostEventContainer {
   object: IObject;
   data: IColorBoostEvent;
}

export interface IColorNoteContainer {
   object: IObjectLane;
   data: IColorNote;
}

export interface IEventBoxGroupContainer<TEvent> {
   object: IEventBoxGroup;
   boxData: TEvent[];
}

export interface ILightColorBoxContainer {
   data: ILightColorEventBox;
   filterData: IIndexFilter;
   eventData: ILightColorEventContainer[];
}

export interface ILightColorEventContainer {
   data: ILightColorEvent;
   time: number;
}

export interface ILightRotationBoxContainer {
   data: ILightRotationEventBox;
   filterData: IIndexFilter;
   eventData: ILightRotationEventContainer[];
}

export interface ILightRotationEventContainer {
   data: ILightRotationEvent;
   time: number;
}

export interface ILightTranslationBoxContainer {
   data: ILightTranslationEventBox;
   filterData: IIndexFilter;
   eventData: ILightTranslationEventContainer[];
}

export interface ILightTranslationEventContainer {
   data: ILightTranslationEvent;
   time: number;
}

export interface IFxEventFloatBoxContainer {
   data: IFxEventBox;
   filterData: IIndexFilter;
   eventData: IFxEventFloatContainer[];
}

export interface IFxEventFloatContainer {
   data: IFxEventFloat;
   time: number;
}

export interface IObstacleContainer {
   object: IObjectLane;
   data: IObstacle;
}

export interface ISpawnRotationContainer {
   object: IObject;
   data: ISpawnRotation;
}

export interface IWaypointContainer {
   object: IObjectLane;
   data: IWaypoint;
}

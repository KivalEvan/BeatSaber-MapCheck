import { IArc } from '../v4/arc';
import { IBasicEvent } from '../v4/basicEvent';
import { IBombNote } from '../v4/bombNote';
import { IChain } from '../v4/chain';
import { IColorBoostEvent } from '../v4/colorBoostEvent';
import { IColorNote } from '../v4/colorNote';
import { IEventBoxGroup } from '../v4/eventBoxGroup';
import { IFxEventBox } from '../v4/fxEventBox';
import { IFxEventFloat } from '../v4/fxEventFloat';
import { IIndexFilter } from '../v4/indexFilter';
import { ILightColorEvent } from '../v4/lightColorEvent';
import { ILightColorEventBox } from '../v4/lightColorEventBox';
import { ILightRotationEvent } from '../v4/lightRotationEvent';
import { ILightRotationEventBox } from '../v4/lightRotationEventBox';
import { ILightTranslationEvent } from '../v4/lightTranslationEvent';
import { ILightTranslationEventBox } from '../v4/lightTranslationEventBox';
import { IObjectLane } from '../v4/object';
import { IObject, IObjectArc, IObjectChain } from '../v4/object';
import { IObstacle } from '../v4/obstacle';
import { ISpawnRotation } from '../v4/spawnRotation';
import { IWaypoint } from '../v4/waypoint';

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

import {
   IChromaCustomEventDataAnimateTrack,
   IChromaCustomEventDataAssignFogTrack,
   IChromaCustomEventDataAssignPathAnimation,
} from './chroma';
import { IHeckCustomEventDataAnimateTrack, IHeckCustomEventDataAssignPathAnimation } from './heck';
import {
   INECustomEventDataAnimateTrack,
   INECustomEventDataAssignPathAnimation,
   INECustomEventDataAssignPlayerToTrack,
   INECustomEventDataAssignTrackParent,
} from './noodleExtensions';

export type ICustomEventDataAnimateTrack = IHeckCustomEventDataAnimateTrack &
   IChromaCustomEventDataAnimateTrack &
   INECustomEventDataAnimateTrack;

export type ICustomEventDataAssignPathAnimation = IHeckCustomEventDataAssignPathAnimation &
   IChromaCustomEventDataAssignPathAnimation &
   INECustomEventDataAssignPathAnimation;

/** Custom Event interface for AnimateTrack. */
export interface ICustomEventAnimateTrack {
   _time: number;
   _type: 'AnimateTrack';
   _data: ICustomEventDataAnimateTrack;
}

/** Custom Event interface for AssignPathAnimation. */
export interface ICustomEventAssignPathAnimation {
   _time: number;
   _type: 'AssignPathAnimation';
   _data: ICustomEventDataAssignPathAnimation;
}

/** Custom Event interface for InvokeEvent. */
// export interface IHeckCustomEventInvokeEvent {
//     _time: number;
//     _type: 'InvokeEvent';
//     _data: IHeckCustomEventDataInvokeEvent;
// }

/** Custom Event interface for AssignFogTrack. */
export interface ICustomEventAssignFogTrack {
   _time: number;
   _type: 'AssignFogTrack';
   _data: IChromaCustomEventDataAssignFogTrack;
}

/** Custom Event interface for AssignTrackParent. */
export interface ICustomEventAssignTrackParent {
   _time: number;
   _type: 'AssignTrackParent';
   _data: INECustomEventDataAssignTrackParent;
}

/** Custom Event interface for AssignPlayerToTrack. */
export interface ICustomEventAssignPlayerToTrack {
   _time: number;
   _type: 'AssignPlayerToTrack';
   _data: INECustomEventDataAssignPlayerToTrack;
}

export type ICustomEvent =
   | ICustomEventAnimateTrack
   | ICustomEventAssignPathAnimation
   | ICustomEventAssignFogTrack
   | ICustomEventAssignTrackParent
   | ICustomEventAssignPlayerToTrack;

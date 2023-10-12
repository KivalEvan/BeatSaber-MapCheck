import {
   IChromaCustomEventDataAnimateComponent,
   IChromaCustomEventDataAnimateTrack,
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
   b: number;
   t: 'AnimateTrack';
   d: ICustomEventDataAnimateTrack;
}

/** Custom Event interface for AssignPathAnimation. */
export interface ICustomEventAssignPathAnimation {
   b: number;
   t: 'AssignPathAnimation';
   d: ICustomEventDataAssignPathAnimation;
}

/** Custom Event interface for InvokeEvent. */
// export interface IHeckCustomEventInvokeEvent {
//     b: number;
//     t: 'InvokeEvent';
//     d: IHeckCustomEventDataInvokeEvent;
// }

/** Custom Event interface for AnimateComponent. */
export interface ICustomEventAnimateComponent {
   b: number;
   t: 'AnimateComponent';
   d: IChromaCustomEventDataAnimateComponent;
}

/** Custom Event interface for AssignTrackParent. */
export interface ICustomEventAssignTrackParent {
   b: number;
   t: 'AssignTrackParent';
   d: INECustomEventDataAssignTrackParent;
}

/** Custom Event interface for AssignPlayerToTrack. */
export interface ICustomEventAssignPlayerToTrack {
   b: number;
   t: 'AssignPlayerToTrack';
   d: INECustomEventDataAssignPlayerToTrack;
}

export type ICustomEvent =
   | ICustomEventAnimateTrack
   | ICustomEventAssignPathAnimation
   | ICustomEventAnimateComponent
   | ICustomEventAssignTrackParent
   | ICustomEventAssignPlayerToTrack;

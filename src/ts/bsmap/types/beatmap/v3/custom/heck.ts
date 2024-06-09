import type { Easings } from '../../../easings.ts';
import type { Vector3 } from '../../../vector.ts';
import type { Vector3PointDefinition } from '../../shared/custom/heck.ts';

/** Heck Base Custom Event interface. */
export interface IHeckBase {
   track?: string | string[];
}

/**
 * AssignPathAnimation interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAnimateTrack extends Required<IHeckBase> {
   duration?: number;
   repeat?: number;
   easing?: Easings;
   position?: string | Vector3 | Vector3PointDefinition[];
   rotation?: string | Vector3 | Vector3PointDefinition[];
   localRotation?: string | Vector3 | Vector3PointDefinition[];
   scale?: string | Vector3 | Vector3PointDefinition[];
}

/**
 * AssignPathAnimation interface for Heck Custom Event.
 * @extends Required<IHeckBase>
 */
export interface IHeckCustomEventDataAssignPathAnimation extends Required<IHeckBase> {
   easing?: Easings;
   position?: string | Vector3 | Vector3PointDefinition[];
   rotation?: string | Vector3 | Vector3PointDefinition[];
   localRotation?: string | Vector3 | Vector3PointDefinition[];
   scale?: string | Vector3 | Vector3PointDefinition[];
}

/** Heck Custom Data interface for difficulty custom data. */
export interface IHeckCustomData {
   eventDefinitions?: unknown[];
}

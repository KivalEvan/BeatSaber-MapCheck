import type { Vector3 } from '../../../types/vector.ts';

export interface IChromaEnvironmentPlacement {
   scale?: Vector3;
   position?: Vector3;
   rotation?: Vector3;
   track?: string;
   type?: number;
}

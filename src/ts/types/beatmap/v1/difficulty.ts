import { INote } from './note';
import { IObstacle } from './obstacle';
import { IEvent } from './event';
import { ICustomDifficulty } from './custom/difficulty';

/** Difficulty interface for difficulty file. */
export interface IDifficulty extends ICustomDifficulty {
   _version: '1.5.0';
   _beatsPerMinute: number;
   _beatsPerBar: number;
   _shuffle: number;
   _shufflePeriod: number;
   _noteJumpSpeed: number;
   _noteJumpStartBeatOffset: number;
   _events: IEvent[];
   _notes: INote[];
   _obstacles: IObstacle[];
}

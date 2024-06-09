import type { IArc } from './arc.ts';
import type { IBombNote } from './bombNote.ts';
import type { IChain } from './chain.ts';
import type { IColorNote } from './colorNote.ts';
import type { IItem } from './item.ts';
import type { IObject, IObjectArc, IObjectChain, IObjectLane } from './object.ts';
import type { IObstacle } from './obstacle.ts';
import type { ISpawnRotation } from './spawnRotation.ts';

export interface IDifficulty extends IItem {
   version: '4.0.0';
   colorNotes: IObjectLane[];
   bombNotes: IObjectLane[];
   obstacles: IObjectLane[];
   chains: IObjectChain[];
   arcs: IObjectArc[];
   spawnRotations: IObject[];
   colorNotesData: IColorNote[];
   bombNotesData: IBombNote[];
   obstaclesData: IObstacle[];
   chainsData: IChain[];
   arcsData: IArc[];
   spawnRotationsData: ISpawnRotation[];
}

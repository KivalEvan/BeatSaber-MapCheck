import { IArc } from './arc';
import { IBombNote } from './bombNote';
import { IChain } from './chain';
import { IColorNote } from './colorNote';
import { IItem } from './item';
import { IObject, IObjectArc, IObjectChain, IObjectLane } from './object';
import { IObstacle } from './obstacle';
import { ISpawnRotation } from './spawnRotation';

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

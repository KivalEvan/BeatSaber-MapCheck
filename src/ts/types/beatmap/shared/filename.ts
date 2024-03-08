import { CharacteristicName } from './characteristic';
import { DifficultyName } from './difficulty';

export interface IFileInfo {
   filename: string;
}

export type GenericFilename =
   | `${DifficultyName}${CharacteristicName}.dat`
   | `${CharacteristicName}${DifficultyName}.dat`
   | `${DifficultyName}.dat`
   | 'Lightshow.dat';

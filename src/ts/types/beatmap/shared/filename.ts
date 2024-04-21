import type { CharacteristicName } from './characteristic.ts';
import type { DifficultyName } from './difficulty.ts';

export interface IFileInfo {
   filename: string;
}

// excluded here is official editor way of saving things, otherwise may be saved by 3rd party editor
export type GenericFilename =
   | `${DifficultyName}${CharacteristicName}.dat`
   | `${Exclude<CharacteristicName, 'Lightshow' | 'Lawless'>}${DifficultyName}.dat`
   | `${DifficultyName}.dat`
   | `${Exclude<CharacteristicName, 'Lightshow' | 'Lawless'>}${DifficultyName}.${
        | 'beatmap'
        | 'lightshow'}.dat`
   | `${DifficultyName}.${'beatmap' | 'lightshow'}.dat`
   | 'Common.lightshow.dat'
   | 'Lightshow.dat';

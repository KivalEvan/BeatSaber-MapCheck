import { CharacteristicName } from './characteristic';
import { DifficultyName } from './difficulty';

export type GenericFileName = `${DifficultyName}${CharacteristicName | ''}.dat`;

import { IContributor } from '../../shared/custom/contributor';
import { IEditor } from './editor';
import { IColorScheme } from './colorScheme';
import { IHeckInfoCustomData, IInfoSettingsCustomData } from './heck';
import { IChromaInfoCustomData } from './chroma';
import { LooseAutocomplete } from '../../../utils';
import { ICustomDataBase } from '../../shared/custom/customData';
import { ModRequirements, ModSuggestions } from '../../shared/modCheck';

/**
 * Custom Data interface for info.
 * @extends ICustomDataBase
 */
export interface ICustomDataInfo extends ICustomDataBase {
   _editors?: IEditor;
   _contributors?: IContributor[];
   _customEnvironment?: string;
   _customEnvironmentHash?: string;
}

export interface ICustomDataInfoSet extends ICustomDataBase {
   _characteristicLabel?: string;
   _characteristicIconImageFilename?: string;
}

type IInfoSettings = IInfoSettingsCustomData & IHeckInfoCustomData & IChromaInfoCustomData;

/**
 * Custom Data interface for info difficulty.
 * @extends ICustomDataBase
 * @extends IColorScheme
 * @extends IInfoSettings
 */
export interface ICustomDataInfoDifficulty extends ICustomDataBase, IColorScheme, IInfoSettings {
   _difficultyLabel?: string;
   _editorOffset?: number;
   _editorOldOffset?: number;
   _warnings?: string[];
   _information?: string[];
   _suggestions?: LooseAutocomplete<ModSuggestions>[];
   _requirements?: LooseAutocomplete<ModRequirements>[];
   _tags?: string[];
   _oneSaber?: boolean;
   _showRotationNoteSpawnLines?: boolean;
}

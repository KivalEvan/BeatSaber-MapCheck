import type { IContributor } from '../../shared/custom/contributor.ts';
import type { IEditor } from '../../v2/custom/editor.ts';
import type { IColorScheme } from '../../v2/custom/colorScheme.ts';
import type { IHeckInfoCustomData, IInfoSettingsCustomData } from '../../v2/custom/heck.ts';
import type { IChromaInfoCustomData } from '../../v2/custom/chroma.ts';
import type { LooseAutocomplete } from '../../../utils.ts';
import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type { ModRequirements, ModSuggestions } from '../../shared/modCheck.ts';
import type { CharacteristicName } from '../../shared/characteristic.ts';

/**
 * Custom Data interface for info.
 * @extends ICustomDataBase
 */
export interface ICustomDataInfo extends ICustomDataBase {
   _editors?: IEditor;
   _contributors?: IContributor[];
   _customEnvironment?: string;
   _customEnvironmentHash?: string;
   _characteristics?: ICustomCharacteristic[];
}

export interface ICustomCharacteristic {
   characteristic: CharacteristicName;
   label: string;
   iconPath?: string;
}

type IInfoSettings = IInfoSettingsCustomData & IHeckInfoCustomData & IChromaInfoCustomData;

/**
 * Custom Data interface for info difficulty.
 * @extends ICustomDataBase
 * @extends IColorScheme
 * @extends IInfoSettings
 */
export interface ICustomDataInfoBeatmap extends ICustomDataBase, IColorScheme, IInfoSettings {
   _difficultyLabel?: string;
   _warnings?: string[];
   _information?: string[];
   _suggestions?: LooseAutocomplete<ModSuggestions>[];
   _requirements?: LooseAutocomplete<ModRequirements>[];
   _tags?: string[];
   _oneSaber?: boolean;
   _showRotationNoteSpawnLines?: boolean;
}

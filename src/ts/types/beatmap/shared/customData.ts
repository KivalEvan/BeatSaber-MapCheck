import { IContributor } from './contributor';
import { IEditor } from './editor';
import { IColorScheme } from './colorScheme';
import { IHeckInfoCustomData, IInfoSettingsCustomData } from './heck';
import { IChromaInfoCustomData } from './chroma';

/** Base custom data interface. */
export interface ICustomDataBase {
    [key: string]: any;
}

/** Custom Data interface for info.
 * @extends ICustomDataBase
 */
export interface ICustomDataInfo extends ICustomDataBase {
    _editors?: IEditor;
    _contributors?: IContributor[];
    _customEnvironment?: string;
    _customEnvironmentHash?: string;
}

type IModSettingsIntersection = IInfoSettingsCustomData & IHeckInfoCustomData & IChromaInfoCustomData;
/** Custom Data interface for info difficulty.
 * @extends ICustomDataBase
 * @extends IColorScheme
 * @extends IHeckInfoCustomData
 * @extends IChromaInfoCustomData
 */
export interface ICustomDataInfoDifficulty extends ICustomDataBase, IColorScheme, IModSettingsIntersection {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

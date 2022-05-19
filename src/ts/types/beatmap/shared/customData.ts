import { IContributor } from './contributor';
import { IEditor } from './editor';
import { IColorScheme } from './colorScheme';
import { IHeckInfoCustomData } from './heck';
import { IChromaInfoCustomData } from './chroma';

/** Base custom data interface. */
export interface ICustomDataBase {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
}

/** Custom Data interface for info.
 * ```ts
 * _editors?: Editor,
 * _contributors?: Contributor[],
 * _customEnvironment?: string,
 * _customEnvironmentHash?: string
 * ```
 * @extends ICustomDataBase
 */
export interface ICustomDataInfo extends ICustomDataBase {
    _editors?: IEditor;
    _contributors?: IContributor[];
    _customEnvironment?: string;
    _customEnvironmentHash?: string;
}

/** Custom Data interface for info difficulty.
 * ```ts
 * _difficultyLabel?: string,
 * _editorOffset?: int,
 * _editorOldOffset?: int,
 * _warnings?: string[],
 * _information?: string[],
 * _suggestions?: string[],
 * _requirements?: string[]
 * ```
 * @extends ICustomDataBase
 * @extends IColorScheme
 * @extends IHeckInfoCustomData
 * @extends IChromaInfoCustomData
 */
export interface ICustomDataInfoDifficulty
    extends ICustomDataBase,
        IColorScheme,
        IHeckInfoCustomData,
        IChromaInfoCustomData {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

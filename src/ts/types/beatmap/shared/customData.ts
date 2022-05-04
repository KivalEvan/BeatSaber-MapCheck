import { IContributor } from './contributor';
import { IEditor } from './editor';
import { IColorScheme } from './environment';
import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from '../shared/bpm';
import {
    IHeckCustomData,
    IHeckCustomEventV2,
    IHeckCustomEventV3,
    IHeckInfoCustomData,
} from './heck';
import {
    IChromaCustomData,
    IChromaCustomEventV2,
    IChromaCustomEventV3,
    IChromaNote,
    IChromaObstacle,
    IChromaEnvironmentOld,
} from './chroma';
import {
    INECustomData,
    INECustomEventV2,
    INECustomEventV3,
    INENote,
    INEObstacle,
} from './noodleExtensions';

/** Base custom data interface. */
export interface ICustomDataBase {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
}

export type ICustomEventV2 =
    | IHeckCustomEventV2
    | IChromaCustomEventV2
    | INECustomEventV2;
export type ICustomEventV3 =
    | IHeckCustomEventV3
    | IChromaCustomEventV3
    | INECustomEventV3;

/** Custom Data interface for difficulty file.
 * ```ts
 * _time?: float,
 * _bpmChanges?: BPMChange[];
 * _BPMChanges?: BPMChange[];
 * _bookmarks?: Bookmark[];
 * ```
 * @extends CustomData
 * @extends CCustomData
 * @extends INECustomData
 */
export interface ICustomDataDifficultyV2
    extends ICustomDataBase,
        Omit<IHeckCustomData, '_customEvents'>,
        Omit<IChromaCustomData, '_customEvents'>,
        Omit<INECustomData, '_customEvents'> {
    _customEvents?: ICustomEventV2[];
    _time?: number;
    _bpmChanges?: IBPMChangeOld[];
    _BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export interface ICustomDataDifficultyV3
    extends ICustomDataBase,
        Omit<IHeckCustomData, '_customEvents'>,
        Omit<IChromaCustomData, '_customEvents'>,
        Omit<INECustomData, '_customEvents'> {
    _customEvents?: ICustomEventV3[];
    _time?: number;
    _bpmChanges?: IBPMChangeOld[];
    _BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle;

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
 * @extends IChromaEnvironmentOld
 */
export interface ICustomDataInfoDifficulty
    extends ICustomDataBase,
        IColorScheme,
        IHeckInfoCustomData,
        IChromaEnvironmentOld {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

import { Bookmark } from './bookmark';
import { BPMChange } from './bpm';
import { Contributor } from './contributor';
import { Editor } from './editor';
import { ColorScheme } from './environment';
import { HeckInfoCustomData, HeckCustomData, HeckCustomEvent } from './heck';
import {
    ChromaEnvironmentOld,
    ChromaNote,
    ChromaObstacle,
    ChromaCustomData,
    ChromaCustomEvent,
} from './chroma';
import { NECustomData, NECustomEvent, NENote, NEObstacle } from './noodleExtensions';
import { KeysoundMap, KeysoundNote } from './keysound';

/** Base custom data interface. */
export interface CustomData {
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
 * @extends CustomData
 */
export interface CustomDataInfo extends CustomData, KeysoundMap {
    _editors?: Editor;
    _contributors?: Contributor[];
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
 * @extends CustomData
 * @extends ColorScheme
 * @extends HeckInfoCustomData
 * @extends ChromaEnvironmentOld
 */
export interface CustomDataInfoDifficulty
    extends CustomData,
        ColorScheme,
        HeckInfoCustomData,
        ChromaEnvironmentOld {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

export type CustomEvent = HeckCustomEvent | ChromaCustomEvent | NECustomEvent;

/** Custom Data interface for difficulty file.
 * ```ts
 * _time?: float,
 * _bpmChanges?: BPMChange[];
 * _BPMChanges?: BPMChange[];
 * _bookmarks?: Bookmark[];
 * ```
 * @extends CustomData
 * @extends CCustomData
 * @extends NECustomData
 */
export interface CustomDataDifficulty
    extends CustomData,
        Omit<HeckCustomData, '_customEvents'>,
        Omit<ChromaCustomData, '_customEvents'>,
        Omit<NECustomData, '_customEvents'> {
    _customEvents?: CustomEvent[];
    _time?: number;
    _bpmChanges?: BPMChange[];
    _BPMChanges?: BPMChange[];
    _bookmarks?: Bookmark[];
}

export type CustomDataNote = CustomData & ChromaNote & NENote & KeysoundNote;
export type CustomDataObstacle = CustomData & ChromaObstacle & NEObstacle;

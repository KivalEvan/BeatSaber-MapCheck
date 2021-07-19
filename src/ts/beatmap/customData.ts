import { Bookmark } from './bookmark';
import { BPMChange } from './bpm';
import {
    ChromaEnvironment,
    ChromaEnvironmentOld,
    ChromaEvent,
    ChromaNote,
    ChromaObstacle,
} from './chroma';
import { Contributor } from './contributor';
import { Editor } from './editor';
import { ColorScheme } from './environment';
import { NECustomData, NEEvent, NENote, NEObstacle } from './noodleExtensions';

export interface CustomData {
    [key: string]: any;
}

export interface CustomDataInfo extends CustomData {
    _editors?: Editor;
    _contributors?: Contributor[];
    _customEnvironment?: string;
    _customEnvironmentHash?: string;
}

export interface CustomDataInfoDifficulty extends CustomData, ColorScheme, ChromaEnvironmentOld {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

export interface CustomDataDifficulty extends CustomData, ChromaEnvironment, NECustomData {
    _time?: number;
    _bpmChanges?: BPMChange[];
    _BPMChanges?: BPMChange[];
    _bookmarks?: Bookmark[];
}

export interface CustomDataNote extends CustomData, ChromaNote, NENote {}
export interface CustomDataObstacle extends CustomData, ChromaObstacle, NEObstacle {}
export interface CustomDataEvent extends CustomData, ChromaEvent, NEEvent {}

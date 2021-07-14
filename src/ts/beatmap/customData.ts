import { Contributor } from './contributor';
import { Editor } from './editor';
import { ColorScheme } from './environment';

export interface CustomData {
    [key: string]: any;
}

export interface CustomDataInfo extends CustomData {
    _editors?: Editor;
    _contributors?: Contributor[];
    _customEnvironment?: string;
    _customEnvironmentHash?: string;
}

export interface CustomDataInfoDifficulty extends CustomData, ColorScheme {
    _difficultyLabel?: string;
    _editorOffset?: number;
    _editorOldOffset?: number;
    _warnings?: string[];
    _information?: string[];
    _suggestions?: string[];
    _requirements?: string[];
}

export interface CustomDataNote extends CustomData {}

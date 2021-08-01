import * as beatmap from '../beatmap';

export interface BeatmapSettings {
    _mode: beatmap.characteristic.CharacteristicName;
    _difficulty: beatmap.difficulty.DifficultyName;
    _bpm: beatmap.bpm.BeatPerMinute;
    _njs: beatmap.njs.NoteJumpSpeed;
}

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';
export enum ToolLevelEmoji {
    'info' = '❓',
    'warn' = '❗',
    'error' = '❌',
}

export interface ToolInputOption {
    enabled: boolean;
    [key: string]: boolean | number | number[];
}

export interface ToolInput {
    option: ToolInputOption;
    html?: HTMLElement;
}

export interface ToolOutput {
    result: boolean | string | number | number[] | null;
    html?: HTMLElement | null;
    console?: (...args: any) => void;
}

export type ToolRun = (mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) => void;

export interface Tool {
    name: string;
    description: string;
    type: ToolType;
    order: {
        input: number;
        output: number;
    };
    input: ToolInput;
    output: ToolOutput;
    run: ToolRun;
}

import * as beatmap from '../beatmap';

export interface MapSettings {
    _mode: beatmap.characteristic.CharacteristicName;
    _difficulty: beatmap.difficulty.DifficultyName;
    _bpm: beatmap.bpm.BeatPerMinute;
    _njs: beatmap.njs.NoteJumpSpeed;
}

export type ToolType = 'note' | 'event' | 'obstacle' | 'other';
export type ToolLevel = 'info' | 'warn' | 'error';
export enum ToolLevelEmoji {
    'info' = '❓',
    'warn' = '❗',
    'error' = '❌',
}

export interface ToolInputOption {
    enabled: boolean;
    [key: string]: any;
}
export interface ToolInput {
    option: ToolInputOption;
    html?: HTMLElement;
}

export interface ToolOutputBase {
    result: any;
}
export interface ToolOutputHTML extends ToolOutputBase {
    html: HTMLElement;
    console?: (...args: any) => (string | void) | string;
}
export interface ToolOutputConsole extends ToolOutputBase {
    html?: never;
    console: (...args: any) => (string | void) | string;
}
export type ToolOutput = ToolOutputHTML | ToolOutputConsole;

export type ToolRun = (
    mapSettings: MapSettings,
    mapData: beatmap.map.BeatmapData
) => boolean | number | number[];

export interface Tool {
    name: string;
    description: string;
    type: ToolType;
    level: ToolLevel;
    order: number;
    input: ToolInput;
    output: ToolOutput;
    run: ToolRun;
}

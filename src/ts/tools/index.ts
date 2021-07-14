import BeatPerMinute from '../beatmap/bpm';
import { CharacteristicName } from '../beatmap/characteristic';
import { DifficultyName } from '../beatmap/difficulty';
import { BeatmapData } from '../beatmap/map';
import NoteJumpSpeed from '../beatmap/njs';

export interface MapSettings {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _bpm: BeatPerMinute;
    _njs: NoteJumpSpeed;
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
    mapData: BeatmapData
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

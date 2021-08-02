import * as beatmap from '../beatmap';

export interface BeatmapSettings {
    _mode: beatmap.characteristic.CharacteristicName;
    _difficulty: beatmap.difficulty.DifficultyName;
    _bpm: beatmap.bpm.BeatPerMinute;
    _njs: beatmap.njs.NoteJumpSpeed;
    _audioDuration: number | null;
    _mapDuration: number | null;
}

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';
export enum ToolLevelEmoji {
    'info' = '❓',
    'warn' = '❗',
    'error' = '❌',
}

export interface ToolInputParams {
    [key: string]: boolean | number | number[];
}

export interface ToolInput {
    enabled: boolean;
    params: ToolInputParams;
    html?: HTMLElement;
}

type ToolOutputType = boolean | number | number[];
export interface ToolOutput {
    result: ToolOutputType | { [key: string]: ToolOutputType } | null;
    html?: HTMLElement | null;
    console?: string | null;
}

export type ToolRun = (
    mapSettings: BeatmapSettings,
    mapSet: beatmap.map.BeatmapSetData,
    mapInfo?: beatmap.info.BeatmapInfo
) => void;

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

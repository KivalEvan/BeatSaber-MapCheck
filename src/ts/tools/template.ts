import * as beatmap from '../beatmap';

export interface BeatmapSettings {
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
    [key: string]: boolean | string | number | number[];
}

export interface ToolInput {
    enabled: boolean;
    params: ToolInputParams;
    html?: HTMLElement;
    adjustTime?: (bpm: beatmap.bpm.BeatPerMinute) => void;
}

export interface ToolOutput {
    html?: HTMLElement | null;
}

export type ToolRun = (
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.BeatmapSetData,
    mapInfo?: beatmap.types.InfoData,
    sps?: beatmap.v2.swing.SwingAnalysis[]
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

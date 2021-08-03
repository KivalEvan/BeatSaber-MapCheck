import * as beatmap from '../beatmap';
import { SwingAnalysis } from './swing';

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
    [key: string]: boolean | number | number[];
}

export interface ToolInput {
    enabled: boolean;
    params: ToolInputParams;
    html?: HTMLElement;
    adjustTime?: (bpm: beatmap.bpm.BeatPerMinute) => void;
}

export interface ToolOutput {
    html?: HTMLElement | null;
    console?: any;
}

export type ToolRun = (
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.map.BeatmapSetData,
    mapInfo?: beatmap.info.BeatmapInfo,
    sps?: SwingAnalysis[]
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

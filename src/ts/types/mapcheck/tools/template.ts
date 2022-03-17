import { BeatPerMinute, NoteJumpSpeed } from '../../../beatmap';
import { IInfoData } from '../../beatmap';
import { IBeatmapDataItem } from '../beatmapList';

export interface BeatmapSettings {
    _bpm: BeatPerMinute;
    _njs: NoteJumpSpeed;
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
    adjustTime?: (bpm: BeatPerMinute) => void;
}

export interface ToolOutput {
    html?: HTMLElement | null;
}

export type ToolRun = (
    mapSettings: BeatmapSettings,
    mapData?: IBeatmapDataItem,
    mapInfo?: IInfoData,
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

import { BeatPerMinute } from '../../../beatmap/shared/bpm';
import { NoteJumpSpeed } from '../../../beatmap/shared/njs';
import { IInfo } from '../../beatmap/shared/info';
import { IBeatmapItem } from './beatmapItem';
import { ToolInputOrder, ToolOutputOrder } from './order';

export interface IBeatmapSettings {
    bpm: BeatPerMinute;
    njs: NoteJumpSpeed;
    audioDuration: number | null;
    mapDuration: number | null;
}

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';

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

export interface ToolArgs {
    settings: IBeatmapSettings;
    difficulty?: IBeatmapItem;
    info: IInfo;
}

export type ToolRun = (args: ToolArgs) => void;

export interface Tool {
    name: string;
    description: string;
    type: ToolType;
    order: {
        input: ToolInputOrder;
        output: ToolOutputOrder;
    };
    input: ToolInput;
    output: ToolOutput;
    run: ToolRun;
}

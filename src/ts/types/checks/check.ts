import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { NoteJumpSpeed } from '../../bsmap/beatmap/helpers/njs';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from './beatmapItem';
import { ToolInputOrder, ToolOutputOrder } from './order';

export interface IBeatmapSettings {
   timeProcessor: TimeProcessor;
   njs: NoteJumpSpeed;
   audioDuration: number | null;
   mapDuration: number | null;
}

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';

export interface ToolInput<TParam extends Record<string, unknown>> {
   enabled: boolean;
   params: TParam;
   html?: HTMLElement;
   adjustTime?: (bpm: TimeProcessor) => void;
}

export interface ToolOutput {
   html?: HTMLElement | null;
}

export interface ToolArgs {
   settings: IBeatmapSettings;
   beatmap?: IBeatmapItem;
   info: IWrapInfo;
}

export type ToolRun = (args: ToolArgs) => void;

export interface Tool<TParam extends Record<string, unknown> = Record<string, unknown>> {
   name: string;
   description: string;
   type: ToolType;
   order: {
      input: ToolInputOrder;
      output: ToolOutputOrder;
   };
   input: ToolInput<TParam>;
   output: ToolOutput;
   run: ToolRun;
}

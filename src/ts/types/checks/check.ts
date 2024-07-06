import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from './beatmapItem';
import { ToolInputOrder, ToolOutputOrder } from './order';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';

export interface IToolInput<TParam extends Record<string, unknown>> {
   enabled: boolean;
   params: TParam;
   html?: HTMLElement;
   adjustTime?: (timeProcessor: TimeProcessor) => void;
}

export type OutputType = 'string' | 'number' | 'time' | 'html';
export type OutputSymbol = 'info' | 'warning' | 'error' | 'rank';

export interface IToolOutputBase {
   readonly type: OutputType;
   readonly symbol?: OutputSymbol;
   readonly label: string;
   readonly value?: unknown;
}

export interface IToolOutputString extends IToolOutputBase {
   readonly type: 'string';
   readonly value: string;
}

export interface IToolOutputNumber extends IToolOutputBase {
   readonly type: 'number';
   readonly value: number[];
}

export interface IToolOutputTime extends IToolOutputBase {
   readonly type: 'time';
   readonly value: IWrapBaseObject[];
}

export interface IToolOutputHTML extends IToolOutputBase {
   readonly type: 'html';
   readonly value: HTMLElement[];
}

export type IToolOutput = IToolOutputString | IToolOutputNumber | IToolOutputTime | IToolOutputHTML;

export interface ToolArgs {
   readonly audioDuration: number | null;
   readonly mapDuration: number | null;
   readonly beatmap: IBeatmapItem;
   readonly info: IWrapInfo;
}

export type ToolRun = (args: ToolArgs) => IToolOutput[];

export interface ITool<TParam extends Record<string, unknown> = Record<string, unknown>> {
   readonly name: string;
   readonly description: string;
   readonly type: ToolType;
   readonly order: {
      input: ToolInputOrder;
      output: ToolOutputOrder;
   };
   readonly input: IToolInput<TParam>;
   run: ToolRun;
}

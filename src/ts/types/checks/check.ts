import { TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { IBeatmapItem } from './beatmapItem';
import { ToolInputOrder, ToolOutputOrder } from './order';

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';

// TODO: refactor to delegate HTML to be processed elsewhere
export interface IToolInput<TParam extends Record<string, unknown>> {
   params: TParam & {
      enabled: boolean;
   };
   html?: HTMLElement;
   adjustTime?: (timeProcessor: TimeProcessor) => void;
   update?: () => void;
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
   readonly value: types.wrapper.IWrapBaseObject[];
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
   readonly info: types.wrapper.IWrapInfo;
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

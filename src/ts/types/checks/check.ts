import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { NoteJumpSpeed } from '../../bsmap/beatmap/helpers/njs';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from './beatmapItem';
import { ToolInputOrder, ToolOutputOrder } from './order';
import { IObjectContainer, IObjectContainerBase, ObjectContainerType } from './container';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';

export type ToolType = 'note' | 'event' | 'obstacle' | 'other' | 'general';

export interface IToolInput<TParam extends Record<string, unknown>> {
   enabled: boolean;
   params: TParam;
   html?: HTMLElement;
   adjustTime?: (bpm: TimeProcessor) => void;
}

export type OutputType = 'string' | 'number' | 'time' | 'html';
export type OutputSymbol = 'info' | 'warning' | 'error' | 'rank';

export interface IToolOutputBase {
   type: OutputType;
   symbol?: OutputSymbol;
   label: string;
   value?: unknown;
}

export interface IToolOutputString extends IToolOutputBase {
   type: 'string';
   value: string;
}

export interface IToolOutputNumber extends IToolOutputBase {
   type: 'number';
   value: number[];
}

export interface IToolOutputTime extends IToolOutputBase {
   type: 'time';
   value: IWrapBaseObject[];
}

export interface IToolOutputHTML extends IToolOutputBase {
   type: 'html';
   value: HTMLElement[];
}

export type IToolOutput = IToolOutputString | IToolOutputNumber | IToolOutputTime | IToolOutputHTML;

export interface ToolArgs {
   audioDuration: number | null;
   mapDuration: number | null;
   beatmap: IBeatmapItem;
   info: IWrapInfo;
}

export type ToolRun = (args: ToolArgs) => IToolOutput[];

export interface ITool<TParam extends Record<string, unknown> = Record<string, unknown>> {
   name: string;
   description: string;
   type: ToolType;
   order: {
      input: ToolInputOrder;
      output: ToolOutputOrder;
   };
   input: IToolInput<TParam>;
   run: ToolRun;
}

import { TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { IBeatmapContainer } from '../container';
import { CheckInputOrder, CheckOutputOrder } from './order';

export const enum CheckType {
   NOTE,
   EVENT,
   OBSTACLE,
   OTHER,
   GENERAL,
}
export const enum OutputType {
   STRING,
   NUMBER,
   TIME,
   HTML,
}
export const enum OutputStatus {
   INFO,
   WARNING,
   ERROR,
   RANK,
}

export interface ICheckInput<TParam extends Record<string, unknown>> {
   params: TParam & {
      enabled: boolean;
   };
   ui?: () => HTMLElement;
   adjustTime?: (timeProcessor: TimeProcessor) => void;
   update?: (timeProcessor?: TimeProcessor) => void;
}

export interface ICheckOutputBase {
   readonly status?: OutputStatus;
   readonly label: string;
   readonly type: OutputType;
   readonly value?: unknown;
}

export interface ICheckOutputString extends ICheckOutputBase {
   readonly type: OutputType.STRING;
   readonly value: string;
}

export interface ICheckOutputNumber extends ICheckOutputBase {
   readonly type: OutputType.NUMBER;
   readonly value: number[];
}

export interface ICheckOutputTime extends ICheckOutputBase {
   readonly type: OutputType.TIME;
   readonly value: types.wrapper.IWrapBaseObject[];
}

export interface ICheckOutputHTML extends ICheckOutputBase {
   readonly type: OutputType.HTML;
   readonly value: HTMLElement[];
}

export type ICheckOutput =
   | ICheckOutputString
   | ICheckOutputNumber
   | ICheckOutputTime
   | ICheckOutputHTML;

export interface CheckArgs {
   readonly audioDuration: number | null;
   readonly mapDuration: number | null;
   readonly beatmap: IBeatmapContainer;
   readonly info: types.wrapper.IWrapInfo;
}

export type ICheckRun = (args: CheckArgs) => ICheckOutput[];

export interface ICheck<TParam extends Record<string, unknown> = Record<string, unknown>> {
   readonly name: string;
   readonly description: string;
   readonly type: CheckType;
   readonly order: {
      input: CheckInputOrder;
      output: CheckOutputOrder;
   };
   readonly input: ICheckInput<TParam>;
   run: ICheckRun;
}

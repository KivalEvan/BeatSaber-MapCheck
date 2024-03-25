// deno-lint-ignore-file no-explicit-any
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { Version } from '../shared/version';
import { IFileInfo } from '../shared/filename';
import { IWrapBPMEventAttribute } from './bpmEvent';

export interface IWrapAudioAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItemAttribute<T>,
      IFileInfo {
   version: Version;
   audioChecksum: string;
   sampleCount: number; // int
   frequency: number; // int
   bpmData: IWrapAudioBPM[];
   lufsData: IWrapAudioLUFS[];
}

export interface IWrapAudioBPM {
   startSampleIndex: number; // int
   endSampleIndex: number; // int
   startBeat: number; // float
   endBeat: number; // float
}

export interface IWrapAudioLUFS {
   startSampleIndex: number; // int
   endSampleIndex: number; // int
   lufs: number; // float
}

export interface IWrapAudio<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapAudioAttribute<T> {
   setFilename(filename: string): this;
   setSampleCount(value: number): this;
   setFrequency(value: number): this;

   fromBpmEvents(data: IWrapBPMEventAttribute[], frequency: number, sampleCount?: number): this;
   getBpmEvents(): IWrapBPMEventAttribute[];

   /** Sort beatmap object(s) accordingly. */
   sort(): this;
}

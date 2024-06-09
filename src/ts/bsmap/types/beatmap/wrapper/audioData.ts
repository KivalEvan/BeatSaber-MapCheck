import type { IWrapBaseFileAttribute, IWrapBeatmapFile } from './baseFile.ts';
import type { IWrapBaseItemAttribute } from './baseItem.ts';
import type { IWrapBPMEventAttribute } from './bpmEvent.ts';

export interface IWrapAudioDataAttribute extends IWrapBaseItemAttribute, IWrapBaseFileAttribute {
   audioChecksum: string;
   sampleCount: number; // int
   frequency: number; // int
   bpmData: IWrapAudioDataBPM[];
   lufsData: IWrapAudioDataLUFS[];
}

export interface IWrapAudioDataBPM {
   startSampleIndex: number; // int
   endSampleIndex: number; // int
   startBeat: number; // float
   endBeat: number; // float
}

export interface IWrapAudioDataLUFS {
   startSampleIndex: number; // int
   endSampleIndex: number; // int
   lufs: number; // float
}

export interface IWrapAudioData extends IWrapBeatmapFile, IWrapAudioDataAttribute {
   setFilename(filename: string): this;
   setSampleCount(value: number): this;
   setFrequency(value: number): this;

   fromBpmEvents(data: IWrapBPMEventAttribute[], frequency: number, sampleCount?: number): this;
   getBpmEvents(): IWrapBPMEventAttribute[];
}

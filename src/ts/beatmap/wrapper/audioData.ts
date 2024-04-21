import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import type { Version } from '../../types/beatmap/shared/version.ts';
import type {
   IWrapAudio,
   IWrapAudioBPM,
   IWrapAudioLUFS,
} from '../../types/beatmap/wrapper/audioData.ts';
import type { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent.ts';
import type { LooseAutocomplete } from '../../types/utils.ts';
import { WrapBaseItem } from './baseItem.ts';

export abstract class WrapAudioData<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapAudio<T>
{
   abstract version: Version;
   audioChecksum!: string;
   sampleCount!: number;
   frequency!: number;
   bpmData!: IWrapAudioBPM[];
   lufsData!: IWrapAudioLUFS[];

   abstract filename: string;

   setFilename(filename: LooseAutocomplete<GenericFilename>): this {
      this.filename = filename;
      return this;
   }
   setSampleCount(value: number): this {
      this.sampleCount = value;
      return this;
   }
   setFrequency(value: number): this {
      this.frequency = value;
      return this;
   }

   fromBpmEvents(data: IWrapBPMEventAttribute[], frequency = 44100, sampleCount?: number): this {
      if (!data.length) return this;
      this.frequency = frequency;
      if (sampleCount) this.sampleCount = sampleCount;
      this.bpmData = [];

      for (let i = 0; i < data.length - 1; i++) {
         const currentBpmEvent = data[i];
         const nextBpmEvent = data[i + 1];

         this.bpmData.push({
            startSampleIndex: Math.floor(currentBpmEvent.time * this.frequency),
            endSampleIndex: Math.floor(nextBpmEvent.time * this.frequency),
            startBeat: currentBpmEvent.time,
            endBeat: nextBpmEvent.time,
         });
      }

      const lastBpmEvent = data[data.length - 1];
      const lastStartSampleIndex = Math.floor(lastBpmEvent.time * this.frequency);
      const secondsDiff = (this.sampleCount - lastStartSampleIndex) / this.frequency;
      const jsonBeatsDiff = secondsDiff * (lastBpmEvent.bpm / 60);

      this.bpmData.push({
         startSampleIndex: lastStartSampleIndex,
         endSampleIndex: this.sampleCount,
         startBeat: lastBpmEvent.time,
         endBeat: lastBpmEvent.time + jsonBeatsDiff,
      });
      return this;
   }

   getBpmEvents(): IWrapBPMEventAttribute[] {
      return this.bpmData.map((bd) => {
         const sample = bd.endSampleIndex - bd.startSampleIndex;
         const bpm = ((bd.endBeat - bd.startBeat) / (sample / this.frequency)) * 60;
         return {
            time: bd.startBeat,
            bpm,
            customData: {},
         };
      });
   }

   sort(): this {
      this.bpmData.sort((a, b) => a.startBeat - b.startBeat);
      return this;
   }
}

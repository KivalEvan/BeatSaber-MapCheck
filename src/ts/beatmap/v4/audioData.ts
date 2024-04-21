import { WrapAudioData } from '../wrapper/audioData.ts';
import type { IAudio } from '../../types/beatmap/v4/audioData.ts';
import type { IWrapAudioAttribute } from '../../types/beatmap/wrapper/audioData.ts';
import type { DeepPartial } from '../../types/utils.ts';

export class AudioData extends WrapAudioData<IAudio> {
   readonly version = '4.0.0';
   filename: string = 'Audio.dat';

   constructor(data: DeepPartial<IWrapAudioAttribute<IAudio>> = {}) {
      super();
      this.audioChecksum = data.audioChecksum || '';
      this.sampleCount = data.sampleCount || 44100;
      this.frequency = data.frequency || 0;
      this.bpmData = (data.bpmData || []).map((bd) => ({
         startBeat: bd?.startBeat || 0,
         endBeat: bd?.endBeat || 0,
         startSampleIndex: bd?.startSampleIndex || 0,
         endSampleIndex: bd?.endSampleIndex || 0,
      }));
      this.lufsData = (data.lufsData || []).map((l) => ({
         lufs: l?.lufs || 0,
         startSampleIndex: l?.startSampleIndex || 0,
         endSampleIndex: l?.endSampleIndex || 0,
      }));
   }

   static create(data: DeepPartial<IWrapAudioAttribute<IAudio>> = {}): AudioData {
      return new this(data);
   }

   static fromJSON(data: DeepPartial<IAudio>): AudioData {
      const obj = new this();
      obj.audioChecksum = data.songChecksum || '';
      obj.sampleCount = data.songSampleCount || 44100;
      obj.frequency = data.songFrequency || 0;
      obj.bpmData = (data.bpmData || []).map((bd) => ({
         startBeat: bd?.sb || 0,
         endBeat: bd?.eb || 0,
         startSampleIndex: bd?.si || 0,
         endSampleIndex: bd?.ei || 0,
      }));
      obj.lufsData = (data.lufsData || []).map((l) => ({
         lufs: l?.l || 0,
         startSampleIndex: l?.si || 0,
         endSampleIndex: l?.ei || 0,
      }));
      return obj;
   }

   isValid(): boolean {
      return this.sampleCount > 0 && this.frequency > 0;
   }

   toJSON(): IAudio {
      return {
         version: this.version,
         songChecksum: this.audioChecksum,
         songSampleCount: this.sampleCount,
         songFrequency: this.frequency,
         bpmData: this.bpmData.map((bd) => ({
            sb: bd.startBeat,
            eb: bd.endBeat,
            si: bd.startSampleIndex,
            ei: bd.endSampleIndex,
         })),
         lufsData: this.lufsData.map((l) => ({
            l: l.lufs,
            si: l.startSampleIndex,
            ei: l.endSampleIndex,
         })),
      };
   }
}

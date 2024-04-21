import { WrapAudioData } from '../wrapper/audioData.ts';
import type { IBPMInfo } from '../../types/beatmap/v2/bpmInfo.ts';
import type { IWrapAudioAttribute } from '../../types/beatmap/wrapper/audioData.ts';
import type { DeepPartial } from '../../types/utils.ts';

export class BPMInfo extends WrapAudioData<IBPMInfo> {
   readonly version = '2.0.0';
   filename: string = 'BPMInfo.dat';

   constructor(data: DeepPartial<IWrapAudioAttribute<IBPMInfo>> = {}) {
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

   static create(data: DeepPartial<IWrapAudioAttribute<IBPMInfo>> = {}): BPMInfo {
      return new this(data);
   }

   static fromJSON(data: DeepPartial<IBPMInfo>): BPMInfo {
      const obj = new this();
      obj.sampleCount = data._songSampleCount || 44100;
      obj.frequency = data._songFrequency || 0;
      obj.bpmData = (data._regions || []).map((bd) => ({
         startBeat: bd?._startBeat || 0,
         endBeat: bd?._endBeat || 0,
         startSampleIndex: bd?._startSampleIndex || 0,
         endSampleIndex: bd?._endSampleIndex || 0,
      }));
      return obj;
   }

   isValid(): boolean {
      return this.sampleCount > 0 && this.frequency > 0;
   }

   toJSON(): IBPMInfo {
      return {
         _version: this.version,
         _songSampleCount: this.sampleCount,
         _songFrequency: this.frequency,
         _regions: this.bpmData.map((bd) => ({
            _startBeat: bd.startBeat,
            _endBeat: bd.endBeat,
            _startSampleIndex: bd.startSampleIndex,
            _endSampleIndex: bd.endSampleIndex,
         })),
      };
   }
}

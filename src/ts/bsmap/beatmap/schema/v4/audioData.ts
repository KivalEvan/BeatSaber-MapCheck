import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IAudio } from '../../../types/beatmap/v4/audioData.ts';
import type { IWrapAudioDataAttribute } from '../../../types/beatmap/wrapper/audioData.ts';
import type { DeepPartial } from '../../../types/utils.ts';

const defaultValue = {
   version: '4.0.0',
   songChecksum: '',
   songSampleCount: 0,
   songFrequency: 44100,
   bpmData: [],
   lufsData: [],
} as Required<IAudio>;
export const audioData: ISchemaContainer<IWrapAudioDataAttribute, IAudio> = {
   defaultValue,
   serialize(data: IWrapAudioDataAttribute): IAudio {
      return {
         version: '4.0.0',
         songChecksum: data.audioChecksum,
         songSampleCount: data.sampleCount,
         songFrequency: data.frequency,
         bpmData: data.bpmData.map((bd) => ({
            sb: bd.startBeat,
            eb: bd.endBeat,
            si: bd.startSampleIndex,
            ei: bd.endSampleIndex,
         })),
         lufsData: data.lufsData.map((l) => ({
            l: l.lufs,
            si: l.startSampleIndex,
            ei: l.endSampleIndex,
         })),
      };
   },
   deserialize(data: DeepPartial<IAudio> = {}): DeepPartial<IWrapAudioDataAttribute> {
      return {
         version: 4,
         audioChecksum: data.songChecksum ?? audioData.defaultValue.songChecksum,
         sampleCount: data.songSampleCount ?? audioData.defaultValue.songSampleCount,
         frequency: data.songFrequency ?? audioData.defaultValue.songFrequency,
         bpmData: (data.bpmData ?? audioData.defaultValue.bpmData).map((bd) => ({
            startBeat: bd?.sb || 0,
            endBeat: bd?.eb || 0,
            startSampleIndex: bd?.si || 0,
            endSampleIndex: bd?.ei || 0,
         })),
         lufsData: (data.lufsData ?? audioData.defaultValue.lufsData).map((l) => ({
            lufs: l?.l || 0,
            startSampleIndex: l?.si || 0,
            endSampleIndex: l?.ei || 0,
         })),
      };
   },
};

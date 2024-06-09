import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBPMInfo } from '../../../types/beatmap/v2/bpmInfo.ts';
import type { IWrapAudioDataAttribute } from '../../../types/beatmap/wrapper/audioData.ts';
import type { DeepPartial } from '../../../types/utils.ts';

const defaultValue = {
   _version: '2.0.0',
   _songSampleCount: 44100,
   _songFrequency: 0,
   _regions: [],
} as Required<IBPMInfo>;
export const audioData: ISchemaContainer<IWrapAudioDataAttribute, IBPMInfo> = {
   defaultValue,
   serialize(data: IWrapAudioDataAttribute): IBPMInfo {
      return {
         _version: '2.0.0',
         _songSampleCount: data.sampleCount,
         _songFrequency: data.frequency,
         _regions: data.bpmData.map((bd) => ({
            _startBeat: bd.startBeat,
            _endBeat: bd.endBeat,
            _startSampleIndex: bd.startSampleIndex,
            _endSampleIndex: bd.endSampleIndex,
         })),
      };
   },
   deserialize(data: DeepPartial<IBPMInfo> = {}): DeepPartial<IWrapAudioDataAttribute> {
      return {
         version: 2,
         sampleCount: data._songSampleCount ?? defaultValue._songSampleCount,
         frequency: data._songFrequency ?? defaultValue._songFrequency,
         bpmData: (data._regions ?? defaultValue._regions).map((bd) => ({
            startBeat: bd?._startBeat || 0,
            endBeat: bd?._endBeat || 0,
            startSampleIndex: bd?._startSampleIndex || 0,
            endSampleIndex: bd?._endSampleIndex || 0,
         })),
      };
   },
};

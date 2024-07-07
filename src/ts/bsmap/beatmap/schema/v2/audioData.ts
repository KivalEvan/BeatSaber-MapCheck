import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IBPMInfo } from '../../../types/beatmap/v2/bpmInfo.ts';
import type { IWrapAudioDataAttribute } from '../../../types/beatmap/wrapper/audioData.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const audioData: ISchemaContainer<IWrapAudioDataAttribute, IBPMInfo> = {
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
         sampleCount: data._songSampleCount,
         frequency: data._songFrequency,
         bpmData: data._regions?.map((bd) => ({
            startBeat: bd?._startBeat,
            endBeat: bd?._endBeat,
            startSampleIndex: bd?._startSampleIndex,
            endSampleIndex: bd?._endSampleIndex,
         })),
      };
   },
};

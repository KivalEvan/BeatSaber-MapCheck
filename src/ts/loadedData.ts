import flag from './flag';
import { ILoadedData } from './types/loadedData';

export default new (class LoadedData implements ILoadedData {
   beatmapInfo: ILoadedData['beatmapInfo'] = null;
   beatmaps: ILoadedData['beatmaps'] = [];
   contributors: ILoadedData['contributors'] = [];
   analysis: ILoadedData['analysis'] = null;
   duration: ILoadedData['duration'] = null;

   retrieveSafe(): Required<ILoadedData> {
      if (!this.beatmapInfo) {
         throw new Error('Beatmap info is not loaded.');
      }
      if (!this.analysis) {
         throw new Error('Beatmap analysis is not loaded.');
      }
      if (this.duration === null) {
         throw new Error('Audio is not loaded.');
      }
      if (flag.loading.finished) {
         return {
            beatmapInfo: this.beatmapInfo as NonNullable<typeof this.beatmapInfo>,
            beatmaps: this.beatmaps,
            contributors: this.contributors,
            analysis: this.analysis as NonNullable<typeof this.analysis>,
            duration: this.duration as NonNullable<typeof this.duration>,
         };
      } else {
         throw new Error('Could not retrieve saved data, loading process is not finished.');
      }
   }

   clear() {
      flag.loading.finished = false;
      this.beatmapInfo = null;
      this.beatmaps = [];
      this.contributors = [];
      this.analysis = null;
      this.duration = null;
   }
})();

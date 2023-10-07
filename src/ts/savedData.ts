import flag from './flag';
import { ISavedData } from './types/mapcheck/savedData';

export default new (class SavedData implements ISavedData {
   beatmapInfo: ISavedData['beatmapInfo'] = null;
   beatmapDifficulty: ISavedData['beatmapDifficulty'] = [];
   contributors: ISavedData['contributors'] = [];
   analysis: ISavedData['analysis'] = null;
   duration: ISavedData['duration'] = null;

   retrieveSafe() {
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
            beatmapDifficulty: this.beatmapDifficulty,
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
      this.beatmapDifficulty = [];
      this.contributors = [];
      this.analysis = null;
      this.duration = null;
   }
})();

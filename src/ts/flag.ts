import { IFlag } from './types/mapcheck/flag';

export default new (class Flag implements IFlag {
   loading = {
      info: false,
      difficulty: false,
      analysis: false,
      audio: false,
      coverImage: false,
      contributorImage: false,
      finished: false,
   };

   resetLoad() {
      this.loading.info = false;
      this.loading.difficulty = false;
      this.loading.analysis = false;
      this.loading.audio = false;
      this.loading.coverImage = false;
      this.loading.contributorImage = false;
      this.loading.finished = false;
   }
})();

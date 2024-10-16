import { IFlag } from './types/flag';

export default new (class Flag implements IFlag {
   loading = {
      nested: false,
      info: false,
      difficulty: false,
      analysis: false,
      audio: false,
      coverImage: false,
      contributorImage: false,
      finished: false,
   };

   resetLoad() {
      this.loading.nested = false;
      this.loading.info = false;
      this.loading.difficulty = false;
      this.loading.analysis = false;
      this.loading.audio = false;
      this.loading.coverImage = false;
      this.loading.contributorImage = false;
      this.loading.finished = false;
   }
})();

import flag from './flag';
import { ILoadedData } from './types/loadedData';

export default new (class LoadedData implements ILoadedData {
   beatmapInfo: ILoadedData['beatmapInfo'] = null;
   beatmaps: ILoadedData['beatmaps'] = [];
   contributors: ILoadedData['contributors'] = [];
   analysis: ILoadedData['analysis'] = null;
   duration: ILoadedData['duration'] = null;

   clear() {
      flag.loading.finished = false;
      this.beatmapInfo = null;
      this.beatmaps = [];
      this.contributors = [];
      this.analysis = null;
      this.duration = null;
   }
})();

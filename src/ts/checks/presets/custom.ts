import { deepCopy } from 'bsmap/utils';
import presetDefault from './default';
import type { InputParamsList } from './_type';

const preset: InputParamsList = deepCopy(presetDefault);

(function init(): void {
   if (localStorage == null) {
      return;
   }
   const storage = localStorage.getItem('checks');
   if (storage) {
      const temp = JSON.parse(storage);
      if (!temp) return;
      for (const key in preset) {
         const k = key as keyof InputParamsList;
         if (typeof preset[k] === typeof temp[k]) {
            preset[k] = temp[k];
         }
      }
   }
})();

export default preset;

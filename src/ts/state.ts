import { IStateData, IStateFlag } from './types/state';

export class State {
   static data: IStateData = {
      info: null,
      beatmaps: [],
      contributors: [],
      analysis: null,
      duration: null,
   };

   static flag: IStateFlag = {
      nested: false,
      info: false,
      difficulty: false,
      analysis: false,
      audio: false,
      coverImage: false,
      contributorImage: false,
      finished: false,
   };

   static clear() {
      State.data = {
         info: null,
         beatmaps: [],
         contributors: [],
         analysis: null,
         duration: null,
      };
      for (const k in State.flag) {
         State.flag[k as keyof IStateFlag] = false;
      }
   }
}

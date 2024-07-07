import Settings from '../../settings';
import { round, toMmss } from '../../bsmap/utils/mod';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { ICustomEvent as ICustomEventV2 } from '../../bsmap/types/beatmap/v2/custom/customEvent';
import { ICustomEvent as ICustomEventV3 } from '../../bsmap/types/beatmap/v3/custom/customEvent';
import { htmlTableCustomEvents } from './constants';
import { displayTableRow, hideTableRow } from './helpers';
import { NEDataAbbreviation } from '../../bsmap/extensions/renamer/customData';

export function setCustomEvents(
   arr?: Partial<ICustomEventV2 & ICustomEventV3>[],
   bpm?: TimeProcessor | null,
): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableCustomEvents);
      return;
   }
   const customEv = arr.map((elem, i) => {
      let time = elem.b ?? elem._time ?? 0;
      let rt!: number;
      if (bpm) {
         time = bpm.adjustTime(time);
         rt = bpm.toRealTime(time);
      }
      const keyArr = [];
      const data = elem.d ?? elem._data;
      if (!data) {
         return `Error parsing customEvents[${i}]`;
      }
      for (const key in data) {
         if (
            key == '_duration' ||
            key == '_easing' ||
            key == '_track' ||
            key == 'duration' ||
            key == 'easing' ||
            key == 'track'
         ) {
            continue;
         }
         const k = NEDataAbbreviation[key as keyof typeof NEDataAbbreviation];
         if (data[key as keyof ICustomEventV3['d']] != null) {
            keyArr.push(k);
         }
      }

      const type = elem.t ?? elem._type;
      const track = (elem.d as any)?.track ?? (elem._data as any)?._track;
      return `${round(time, Settings.rounding)}${
         rt ? ' | ' + toMmss(rt) : ''
      } -- ${type} -> [${keyArr.join('')}]${type !== 'AssignTrackParent' ? `(${track})` : ''}`;
   });
   displayTableRow(htmlTableCustomEvents, customEv);
}

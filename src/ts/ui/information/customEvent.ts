import { round, TimeProcessor, toMmss, types } from 'bsmap';
import Settings from '../../settings';
import { htmlTableCustomEvents } from './constants';
import { displayTableRow, hideTableRow } from './helpers';
import { renamer } from 'bsmap/extensions';

export function setCustomEvents(
   arr?: Partial<types.v2.ICustomEvent & types.v3.ICustomEvent>[],
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
         const k = renamer.NEDataAbbreviation[key as keyof typeof renamer.NEDataAbbreviation];
         if (data[key as keyof types.v3.ICustomEvent['d']] != null) {
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

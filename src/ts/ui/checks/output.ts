import { round, secToMmss, secToMmssms } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { Settings } from '../../settings';
import { OutputStatus } from '../../types/checks/check';
import { PrecalculateKey } from '../../types/precalculate';

function addLabel(str: string, status?: OutputStatus): string {
   switch (status) {
      case OutputStatus.RANK:
         str = '<span title="Ranking: for rankability reason."> 🚧 </span>' + str;
         break;
      case OutputStatus.ERROR:
         str =
            '<span title="Error: should be fixed unless you know what you are doing."> ❌ </span>' +
            str;
         break;
      case OutputStatus.WARNING:
         str =
            '<span title="Warning: not necessarily needed to be fixed, worth considering."> ❗ </span>' +
            str;
         break;
      case OutputStatus.INFO:
         str = '<span title="Info: no action necessary, take note."> ⚠️ </span>' + str;
         break;
   }
   return str;
}

export function printResult(label: string, text?: string, status?: OutputStatus) {
   const htmlContainer = document.createElement('div');

   label = addLabel(label, status);

   if (text) {
      htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
   } else {
      htmlContainer.innerHTML = `<b>${label}</b>`;
   }

   return htmlContainer;
}

function deduplicateFilter<T extends types.wrapper.IWrapBaseObject>(obj: T, i: number, ary: T[]) {
   return i === 0 || obj.time !== ary[i - 1].time;
}

export function printResultTime(
   label: string,
   timeAry: types.wrapper.IWrapBaseObject[],
   symbol?: OutputStatus,
) {
   const htmlContainer = document.createElement('div');

   if (Settings.props.deduplicateTime) {
      timeAry = timeAry.filter(deduplicateFilter);
   }

   label = addLabel(label, symbol);
   htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
      .map((n) => {
         switch (Settings.props.beatNumbering) {
            case 'realtime':
               return `<span title="Beat ${round(
                  n.customData[PrecalculateKey.BEAT_TIME],
                  Settings.props.rounding,
               )}">${secToMmss(n.customData[PrecalculateKey.SECOND_TIME])}</span>`;
            case 'realtimems':
               return `<span title="Beat ${round(
                  n.customData[PrecalculateKey.BEAT_TIME],
                  Settings.props.rounding,
               )}">${secToMmssms(n.customData[PrecalculateKey.SECOND_TIME])}</span>`;
            case 'jsontime':
               return `<span title="Time ${secToMmssms(
                  n.customData[PrecalculateKey.SECOND_TIME],
               )}">${round(n.time, Settings.props.rounding)}</span>`;
            case 'beattime':
            default:
               return `<span title="Time ${secToMmssms(
                  n.customData[PrecalculateKey.SECOND_TIME],
               )}">${round(
                  n.customData[PrecalculateKey.BEAT_TIME],
                  Settings.props.rounding,
               )}</span>`;
         }
      })
      .join(', ')}`;

   return htmlContainer;
}

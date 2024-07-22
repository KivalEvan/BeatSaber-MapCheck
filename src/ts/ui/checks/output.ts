import settings from '../../settings';
import { round } from '../../bsmap/utils/math';
import { toMmss, toMmssms } from '../../bsmap/utils/time';
import { OutputSymbol } from '../../types/checks/check';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';

function addLabel(str: string, symbol?: OutputSymbol): string {
   switch (symbol) {
      case 'rank':
         str = '<span title="Ranking: for rankability reason."> 🚧 </span>' + str;
         break;
      case 'error':
         str =
            '<span title="Error: should be fixed unless you know what you are doing."> ❌ </span>' +
            str;
         break;
      case 'warning':
         str =
            '<span title="Warning: not necessarily needed to be fixed, worth considering."> ❗ </span>' +
            str;
         break;
      case 'info':
         str = '<span title="Info: no action necessary, take note."> ⚠️ </span>' + str;
         break;
   }
   return str;
}

export function printResult(label: string, text?: string, symbol?: OutputSymbol) {
   const htmlContainer = document.createElement('div');

   label = addLabel(label, symbol);

   if (text) {
      htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
   } else {
      htmlContainer.innerHTML = `<b>${label}</b>`;
   }

   return htmlContainer;
}

function deduplicateFilter<T extends IWrapBaseObject>(obj: T, i: number, ary: T[]) {
   return i === 0 || obj.time !== ary[i - 1].time;
}

export function printResultTime(label: string, timeAry: IWrapBaseObject[], symbol?: OutputSymbol) {
   const htmlContainer = document.createElement('div');

   if (settings.deduplicateTime) {
      timeAry = timeAry.filter(deduplicateFilter);
   }

   label = addLabel(label, symbol);
   htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
      .map((n) => {
         switch (settings.beatNumbering) {
            case 'realtime':
               return `<span title="Beat ${round(
                  n.customData.__mapcheck_beattime,
                  settings.rounding,
               )}">${toMmss(n.customData.__mapcheck_secondtime)}</span>`;
            case 'realtimems':
               return `<span title="Beat ${round(
                  n.customData.__mapcheck_beattime,
                  settings.rounding,
               )}">${toMmssms(n.customData.__mapcheck_secondtime)}</span>`;
            case 'jsontime':
               return `<span title="Time ${toMmssms(n.customData.__mapcheck_secondtime)}">${round(
                  n.time,
                  settings.rounding,
               )}</span>`;
            case 'beattime':
            default:
               return `<span title="Time ${toMmssms(n.customData.__mapcheck_secondtime)}">${round(
                  n.customData.__mapcheck_beattime,
                  settings.rounding,
               )}</span>`;
         }
      })
      .join(', ')}`;

   return htmlContainer;
}

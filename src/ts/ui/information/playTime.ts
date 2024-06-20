import LoadedData from '../../loadedData';
import { toMmss } from '../../bsmap/utils/time';
import { htmlTablePlayTime } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPlayTime(start?: number, end?: number): void {
   if (start == null || end == null) {
      hideTableRow(htmlTablePlayTime);
      return;
   }
   displayTableRow(
      htmlTablePlayTime,
      `${toMmss(start)} to ${toMmss(end)}${
         LoadedData.duration
            ? ` -- [ ${toMmss(end - start)} / ${toMmss(LoadedData.duration)} ]`
            : ''
      }`,
   );
}

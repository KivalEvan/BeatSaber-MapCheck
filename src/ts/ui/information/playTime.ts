import LoadedData from '../../loadedData';
import { secToMmss } from 'bsmap/utils';
import { htmlTablePlayTime } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPlayTime(start?: number, end?: number): void {
   if (start == null || end == null) {
      hideTableRow(htmlTablePlayTime);
      return;
   }
   displayTableRow(
      htmlTablePlayTime,
      `${secToMmss(start)} to ${secToMmss(end)}${
         LoadedData.duration
            ? ` -- [ ${secToMmss(end - start)} / ${secToMmss(LoadedData.duration)} ]`
            : ''
      }`,
   );
}

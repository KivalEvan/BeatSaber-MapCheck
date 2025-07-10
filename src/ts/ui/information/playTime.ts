import { State } from '../../state';
import { secToMmss } from 'bsmap/utils';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';

export function setPlayTime(start?: number, end?: number): void {
   if (start == null || end == null) {
      hideTableRow(UIInfoHTML.htmlTablePlayTime);
      return;
   }
   displayTableRow(
      UIInfoHTML.htmlTablePlayTime,
      `${secToMmss(start)} to ${secToMmss(end)}${
         State.data.duration
            ? ` -- [ ${secToMmss(end - start)} / ${secToMmss(State.data.duration)} ]`
            : ''
      }`,
   );
}

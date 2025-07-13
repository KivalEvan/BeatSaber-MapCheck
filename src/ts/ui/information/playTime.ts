import { State } from '../../state';
import { secToMmss } from 'bsmap/utils';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';

export function setPlayTime(start?: number, end?: number): void {
   if (!start && !end) {
      hideTableRow(UIInfoHTML.htmlTablePlayTime);
      return;
   }
   start ||= 0;
   end ||= 0;
   displayTableRow(
      UIInfoHTML.htmlTablePlayTime,
      `${secToMmss(start)} to ${secToMmss(end)}${
         State.data.duration
            ? ` -- [ ${secToMmss(end - start)} / ${secToMmss(State.data.duration)} ]`
            : ''
      }`,
   );
}

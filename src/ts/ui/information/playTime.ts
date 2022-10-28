import savedData from '../../savedData';
import { toMMSS } from '../../utils/time';
import { htmlTablePlayTime } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPlayTime(start?: number, end?: number): void {
    if (start == null || end == null) {
        hideTableRow(htmlTablePlayTime);
        return;
    }
    displayTableRow(
        htmlTablePlayTime,
        `${toMMSS(start)} to ${toMMSS(end)}${
            savedData.duration ? ` -- [ ${toMMSS(end - start)} / ${toMMSS(savedData.duration)} ]` : ''
        }`,
    );
}

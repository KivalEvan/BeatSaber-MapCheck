import savedData from '../../savedData';
import { toMmss } from '../../utils/time';
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
            savedData.duration
                ? ` -- [ ${toMmss(end - start)} / ${toMmss(savedData.duration)} ]`
                : ''
        }`,
    );
}

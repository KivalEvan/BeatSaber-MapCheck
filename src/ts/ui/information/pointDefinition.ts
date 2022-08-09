import { IPointDefinition } from '../../types/beatmap/v3/pointDefinition';
import { htmlTablePointDefinitions } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPointDefinitions(arr?: IPointDefinition): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = [];
    for (const elem in arr) {
        if (!arr[elem]) {
            pointDef.push(`Error parsing pointDefinitions[${elem}]`);
        }
        pointDef.push(`${elem} -- ${arr[elem].length} point${arr[elem].length > 1 ? 's' : ''}`);
    }
    displayTableRow(htmlTablePointDefinitions, pointDef);
}

import { IPointDefinition } from '../../types/beatmap/v3/pointDefinition';
import { htmlTablePointDefinitions } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPointDefinitions(obj?: IPointDefinition): void {
    if (obj == null) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = [];
    for (const elem in obj) {
        if (!obj[elem]) {
            pointDef.push(`Error parsing pointDefinitions[${elem}]`);
        }
        pointDef.push(`${elem} -- ${obj[elem].length} point${obj[elem].length > 1 ? 's' : ''}`);
    }
    displayTableRow(htmlTablePointDefinitions, pointDef);
}

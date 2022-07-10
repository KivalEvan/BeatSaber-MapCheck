import { IPointDefinition } from '../../types/beatmap/v3/pointDefinition';
import { htmlTablePointDefinitions } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setPointDefinitions(arr?: IPointDefinition[]): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = arr.map((elem, i) => {
        if (!elem.points) {
            return `Error parsing pointDefinitions[${i}]`;
        }
        return `${elem.name} -- ${elem.points.length} point${elem.points.length > 1 ? 's' : ''}`;
    });
    displayTableRow(htmlTablePointDefinitions, pointDef);
}

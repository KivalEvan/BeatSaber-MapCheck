import { IPointDefinition } from '../../bsmap/types/beatmap/v3/custom/pointDefinition';
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
      const el = obj[elem];
      if (!Array.isArray(el)) {
         pointDef.push(`Error parsing pointDefinitions[${elem}]`);
      }
      pointDef.push(
         `${elem} -- ${(el as number[]).length} point${(el as number[]).length > 1 ? 's' : ''}`,
      );
   }
   displayTableRow(htmlTablePointDefinitions, pointDef);
}

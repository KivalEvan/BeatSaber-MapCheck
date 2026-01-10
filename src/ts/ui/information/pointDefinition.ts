import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';
import { v2, v3 } from 'bsmap';

export function setPointDefinitions(obj?: v2.IPointDefinition | v3.IPointDefinition): void {
   if (obj == null) {
      hideTableRow(UIInfoHTML.htmlTablePointDefinitions);
      return;
   }
   const pointDef = [];
   if (Array.isArray(obj)) {
      for (const elem of obj) {
         if (!elem) {
            pointDef.push('Error parsing pointDefinitions');
         }
         pointDef.push(
            `${elem._name} -- ${elem._points.length} point${elem._points.length > 1 ? 's' : ''}`,
         );
      }
   } else {
      obj = obj as v3.IPointDefinition;
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
   }
   displayTableRow(UIInfoHTML.htmlTablePointDefinitions, pointDef, 'pointDefinitions');
}

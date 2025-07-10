import { renamer } from 'bsmap/extensions';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';
import * as types from 'bsmap/types';

// this implementation looks hideous but whatever
export function setEnvironmentEnhancement(
   arr?: Partial<types.v2.IChromaEnvironment & types.v3.IChromaEnvironment>[],
): void {
   if (arr == null || !arr.length) {
      hideTableRow(UIInfoHTML.htmlTableEnvironmentEnhancement);
      return;
   }
   const envEnhance = arr.map((elem, i) => {
      const keyArr = [];
      if (!elem.id && !elem.geometry && !elem._id && !elem._geometry) {
         return `Error parsing environment[${i}]`;
      }
      for (const key in elem) {
         if (
            key == 'lookupMethod' ||
            key == 'id' ||
            key == 'geometry' ||
            key == '_lookupMethod' ||
            key == '_id' ||
            key == '_geometry'
         ) {
            continue;
         }
         const k =
            renamer.ChromaEnvironmentAbbreviation[
               key as keyof typeof renamer.ChromaEnvironmentAbbreviation
            ];
         if (elem[key as keyof types.v3.IChromaEnvironment] != null) {
            keyArr.push(k);
         }
      }

      const geometry = elem.geometry || elem._geometry;
      const track = elem.track || elem._track;
      const id = elem.id || elem._id;
      return `${geometry ? 'Geometry' : elem.lookupMethod || elem._lookupMethod} [${keyArr.join(
         '',
      )}]${track ? `(${track})` : ''} -> ${
         geometry ? (geometry as any).type || (geometry as any)._type : id
      }`;
   });
   displayTableRow(UIInfoHTML.htmlTableEnvironmentEnhancement, envEnhance, 'environments');
}

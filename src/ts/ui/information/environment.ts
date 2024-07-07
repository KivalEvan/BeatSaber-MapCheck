import { ChromaEnvironmentAbbreviation } from '../../bsmap/extensions/renamer/customData';
import { IChromaEnvironment as IChromaEnvironmentV2 } from '../../bsmap/types/beatmap/v2/custom/chroma';
import { IChromaEnvironment as IChromaEnvironmentV3 } from '../../bsmap/types/beatmap/v3/custom/chroma';
import { htmlTableEnvironmentEnhancement } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

// this implementation looks hideous but whatever
export function setEnvironmentEnhancement(
   arr?: Partial<IChromaEnvironmentV2 & IChromaEnvironmentV3>[],
): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableEnvironmentEnhancement);
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
         const k = ChromaEnvironmentAbbreviation[key as keyof typeof ChromaEnvironmentAbbreviation];
         if (elem[key as keyof IChromaEnvironmentV3] != null) {
            keyArr.push(k);
         }
      }

      const geometry = elem.geometry || elem._geometry;
      const track = elem.track || elem._track;
      const id = elem.id || elem._id;
      return `${geometry ? 'Geometry' : elem.lookupMethod || elem._lookupMethod} [${keyArr.join(
         '',
      )}]${track ? `(${track})` : ''} -> ${geometry ? (geometry as any).type || (geometry as any)._type : id}`;
   });
   displayTableRow(htmlTableEnvironmentEnhancement, envEnhance);
}

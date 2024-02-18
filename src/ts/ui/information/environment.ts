import { ChromaEnvironmentAbbreviation } from '../../analyzers/renamer/customData';
import { IChromaEnvironment } from '../../types/beatmap/v3/custom/chroma';
import { htmlTableEnvironmentEnhancement } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

// this implementation looks hideous but whatever
export function setEnvironmentEnhancement(arr?: IChromaEnvironment[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableEnvironmentEnhancement);
      return;
   }
   const envEnhance = arr.map((elem, i) => {
      const keyArr = [];
      if (!elem.id && !elem.geometry) {
         return `Error parsing environment[${i}]`;
      }
      for (const key in elem) {
         if (key == 'lookupMethod' || key == 'id' || key == 'geometry') {
            continue;
         }
         const k = ChromaEnvironmentAbbreviation[key as keyof typeof ChromaEnvironmentAbbreviation];
         if (elem[key as keyof IChromaEnvironment] != null) {
            keyArr.push(k);
         }
      }
      return `${elem.geometry ? 'Geometry' : elem.lookupMethod} [${keyArr.join(
         '',
      )}]${elem.track ? `(${elem.track})` : ''} -> ${elem.geometry ? elem.geometry.type : elem.id}`;
   });
   displayTableRow(htmlTableEnvironmentEnhancement, envEnhance);
}

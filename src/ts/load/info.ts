import JSZip from 'jszip';
import { getLogger, loadInfo, wrapper } from 'bsmap';

function tag(name: string) {
   return ['load', name];
}

export async function extractInfo(zip: JSZip, path = ''): Promise<wrapper.IWrapInfo> {
   const logger = getLogger();
   const infoFile =
      zip.file(path + 'Info.dat') ||
      zip.file(path + 'info.dat') ||
      zip.file(path + 'Info.json') ||
      zip.file(path + 'info.json');
   if (!infoFile) {
      throw new Error("Couldn't find Info.dat");
   }
   logger?.tInfo(tag('extractInfo'), `loading info`);
   return infoFile
      .async('string')
      .then(JSON.parse)
      .then((x) => {
         return loadInfo(x);
      });
}

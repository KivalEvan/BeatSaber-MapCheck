import { getZipHashURL, getZipIdURL } from './beatsaver';
import UILoading from './ui/loading';
import UIHeader from './ui/header';
import { logger } from 'bsmap';
import { isHex, round } from 'bsmap/utils';
import { sanitizeBeatSaverId, sanitizeUrl } from './utils/web';

function tag(name: string) {
   return ['download', name];
}

export async function downloadMap(url: string): Promise<ArrayBuffer> {
   return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.timeout = 5000;

      let startTime = Date.now();
      xhr.onprogress = (e) => {
         xhr.timeout += Date.now() - startTime;
         UILoading.status(
            'download',
            `Downloading map: ${round(e.loaded / 1024 / 1024, 1)}MB / ${round(
               e.total / 1024 / 1024,
               1,
            )}MB`,
            (e.loaded / e.total) * 100,
         );
      };

      xhr.onload = () => {
         if (xhr.status === 200) {
            resolve(xhr.response);
         }
         if (xhr.status === 404) {
            reject('Error 404: Map/link does not exist');
         }
         if (xhr.status === 403) {
            reject('Error 403: Forbidden');
         }
         reject(`Error ${xhr.status}`);
      };

      xhr.onerror = () => {
         reject('Error downloading');
      };

      xhr.ontimeout = () => {
         reject('Connection timeout');
      };

      xhr.send();
   });
}

export async function downloadFromId(input: string): Promise<ArrayBuffer> {
   // sanitize & validate id
   const id = sanitizeBeatSaverId(input);

   logger.tInfo(tag('downloadFromID'), `fetching download URL from BeatSaver for map ID ${id}`);
   UILoading.status('info', 'Fetching download URL from BeatSaver', 0);
   const url = await getZipIdURL(id);
   logger.tInfo(tag('downloadFromID'), `downloading from BeatSaver for map ID ${id}`);
   UILoading.status('info', 'Requesting download from BeatSaver', 0);
   const res = await downloadMap(url);
   UIHeader.setCoverLink('https://beatsaver.com/maps/' + id, id);
   return res;
}

export async function downloadFromUrl(input: string): Promise<ArrayBuffer> {
   // sanitize & validate url
   const url = sanitizeUrl(input);

   // check if URL is BeatSaver map URL
   if (url.match(/^(https?:\/\/)?(www\.)?beatsaver\.com\/maps\//)) {
      return downloadFromId(
         url.replace(/^https?:\/\/(www\.)?beatsaver\.com\/maps\//, '').match(/[a-fA-F0-9]*/)![0],
      );
   }

   UILoading.status('info', 'Requesting download from link', 0);
   logger.tInfo(tag('downloadFromURL'), `downloading from ${url}`);
   // thanks BSMG for CORS proxy
   let res = await downloadMap('https://cors.bsmg.dev/' + url);
   UIHeader.setCoverLink(url);
   return res;
}

export async function downloadFromHash(input: string): Promise<ArrayBuffer> {
   // sanitize & validate id
   let hash: string;
   if (isHex(input.trim())) {
      hash = input.trim();
   } else {
      throw new Error('invalid hash');
   }

   logger.tInfo(
      tag('downloadFromHash'),
      `fetching download URL from BeatSaver for map hash ${hash}`,
   );
   UILoading.status('info', 'Fetching download URL from BeatSaver', 0);
   const url = await getZipHashURL(hash);
   logger.tInfo(tag('downloadFromHash'), `downloading from BeatSaver for map hash ${hash}`);
   UILoading.status('info', 'Requesting download from BeatSaver', 0);
   const res = await downloadMap(url);
   return res;
}

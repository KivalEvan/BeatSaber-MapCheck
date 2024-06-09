import { MapDetail } from './types/beatsaver';

async function fetchJSON(url: string): Promise<any> {
   return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.timeout = 5000;

      let startTime = Date.now();
      xhr.onprogress = () => {
         xhr.timeout += Date.now() - startTime;
      };

      xhr.onload = () => {
         if (xhr.status === 200) {
            resolve(xhr.response);
         }
         if (xhr.status === 404) {
            reject('Error 404: Map does not exist');
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

export async function getZipIdURL(id: string): Promise<string> {
   const url = `https://api.beatsaver.com/maps/id/${id}`;
   const json = (await fetchJSON(url)) as MapDetail;
   if (json?.versions.length) {
      return json.versions[json.versions.length - 1].downloadURL;
   }
   throw new Error('could not find map download link');
}

export async function getZipHashURL(hash: string): Promise<string> {
   const url = `https://api.beatsaver.com/maps/hash/${hash}`;
   const json = (await fetchJSON(url)) as MapDetail;
   if (json?.versions.length) {
      return json.versions[json.versions.length - 1].downloadURL;
   }
   throw new Error('could not find map download link');
}

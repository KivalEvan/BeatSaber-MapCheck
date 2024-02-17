import UIHeader from './ui/header';
import UILoading from './ui/loading';
import UIInfo from './ui/information';
import UITools from './ui/tools';
import UIStats from './ui/stats';
import UIInput from './ui/input';
import Analyser from './tools/analyzer';
import Settings from './settings';
import flag from './flag';
import SavedData from './savedData';
import { extractDifficulties, extractInfo } from './load';
import { downloadFromHash, downloadFromID, downloadFromURL } from './download';
import { sanitizeBeatSaverID, sanitizeURL } from './utils/web';
import { isHex } from './utils';
import { extractZip } from './extract';
import logger from './logger';
import { LoadType } from './types/mapcheck/main';

function tag() {
   return ['main'];
}

async function getFileInput(type: LoadType): Promise<ArrayBuffer | File> {
   if (type.file) {
      return type.file;
   } else if (type.link) {
      return downloadFromURL(sanitizeURL(decodeURI(type.link)));
   } else if (type.id) {
      return downloadFromID(sanitizeBeatSaverID(decodeURI(type.id)));
   } else if (type.hash && isHex(decodeURI(type.hash).trim())) {
      return downloadFromHash(decodeURI(type.hash).trim());
   } else {
      throw new Error('Could not search for file.');
   }
}

// TODO: break these to smaller functions, and probably slap in async while at it
// TODO: possibly do more accurate & predictive loading bar based on the amount of file available (may be farfetched and likely not be implemented)
export default async (type: LoadType) => {
   try {
      console.time('loading time');
      UIInput.enable(false);
      let file = await getFileInput(type);
      UILoading.status('info', 'Extracting zip', 0);
      UIHeader.switchHeader(false);
      const mapZip = await extractZip(file);

      UIInput.enable(false);
      UILoading.status('info', 'Parsing map info...', 0);
      logger.tInfo(tag(), 'Parsing map info');
      const info = await extractInfo(mapZip);
      SavedData.beatmapInfo = info;
      UIInfo.setInfo(info);

      // load cover image
      UILoading.status('info', 'Loading image...', 10.4375);
      logger.tInfo(tag(), 'Loading cover image');
      let imageFile = mapZip.file(info.coverImageFilename);
      if (Settings.load.imageCover && imageFile) {
         let imgBase64 = await imageFile.async('base64');
         UIHeader.setCoverImage('data:image;base64,' + imgBase64);
         flag.loading.coverImage = true;
      } else {
         logger.tError(tag(), `${info.coverImageFilename} does not exists.`);
      }

      SavedData.contributors = [];
      if (info.customData._contributors) {
         for (const contr of info.customData._contributors) {
            logger.tInfo(tag(), 'Loading contributor image ' + contr._name);
            imageFile = mapZip.file(contr._iconPath);
            let _base64 = null;
            if (Settings.load.imageContributor && imageFile) {
               _base64 = await imageFile.async('base64');
            } else {
               logger.tError(tag(), `${contr._iconPath} does not exists.`);
            }
            SavedData.contributors.push({ ...contr, _base64 });
         }
      }

      // load audio
      UILoading.status('info', 'Loading audio...', 20.875);
      logger.tInfo(tag(), 'Loading audio');
      let audioFile = mapZip.file(info.audio.filename);
      if (Settings.load.audio && audioFile) {
         let loaded = false;
         setTimeout(() => {
            if (!loaded)
               UILoading.status('info', 'Loading audio... (this may take a while)', 20.875);
         }, 10000);
         let arrayBuffer = await audioFile.async('arraybuffer');
         UIHeader.setAudio(arrayBuffer);
         let audioContext = new AudioContext();
         await audioContext
            .decodeAudioData(arrayBuffer)
            .then((buffer) => {
               loaded = true;
               let duration = buffer.duration;
               SavedData.duration = duration;
               UIHeader.setSongDuration(duration);
               flag.loading.audio = true;
            })
            .catch(function (err) {
               UIHeader.setSongDuration();
               logger.tError(tag(), err);
            });
      } else {
         UIHeader.setSongDuration();
         logger.tError(tag(), `${info.audio.filename} does not exist.`);
      }

      // load diff map
      UILoading.status('info', 'Parsing difficulty...', 70);
      SavedData.beatmapDifficulty = await extractDifficulties(info, mapZip);

      UITools.adjustTime();
      UILoading.status('info', 'Adding map difficulty stats...', 80);
      logger.tInfo(tag(), 'Adding map stats');
      UIStats.populate();
      UIInfo.populateContributors(SavedData.contributors);
      let minBPM = info.audio.bpm;
      let maxBPM = info.audio.bpm;
      SavedData.beatmapDifficulty.forEach((d) => {
         const bpm = d.bpm.change.map((b) => b.BPM);
         const bpme = d.data.bpmEvents.map((b) => b.bpm);
         minBPM = Math.min(minBPM, ...bpm, ...bpme);
         maxBPM = Math.max(maxBPM, ...bpm, ...bpme);
      });
      if (minBPM !== maxBPM) {
         UIHeader.setSongBPM(info.audio.bpm, minBPM, maxBPM);
      }

      UILoading.status('info', 'Analysing general...', 85);
      logger.tInfo(tag(), 'Analysing map');
      Analyser.runGeneral();
      UITools.displayOutputGeneral();

      UILoading.status('info', 'Analysing difficulty...', 90);
      Analyser.applyAll();
      UITools.populateSelect(info);
      UITools.displayOutputDifficulty();

      UIInput.enable(true);
      UILoading.status('info', 'Map successfully loaded!');
   } catch (err) {
      UILoading.status('error', err, 100);
      logger.tError(tag(), err);
      SavedData.clear();
      UIInput.enable(true);
      UIHeader.switchHeader(true);
   } finally {
      console.timeEnd('loading time');
   }
};

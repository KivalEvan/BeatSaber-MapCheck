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
import { extractBeatmaps, extractBPMInfo, extractInfo } from './load';
import { downloadFromHash, downloadFromID, downloadFromURL } from './download';
import { sanitizeBeatSaverID, sanitizeURL } from './utils/web';
import { isHex, lerp } from './utils';
import { extractZip } from './extract';
import logger from './logger';
import { LoadType } from './types/mapcheck/main';
import { IBeatmapAudio, IBeatmapItem } from './types/mapcheck';

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

export default async (type: LoadType) => {
   try {
      console.time('loading time');
      UIInput.enable(false);
      let file = await getFileInput(type);
      UILoading.status('info', 'Extracting zip', 0);
      UIHeader.switchHeader(false);
      const beatmapZip = await extractZip(file);

      UIInput.enable(false);
      UILoading.status('info', 'Parsing map info...', 10);
      logger.tInfo(tag(), 'Parsing map info');
      const info = await extractInfo(beatmapZip);
      SavedData.beatmapInfo = info;
      UIInfo.setInfo(info);

      if (info.audio.duration) {
         SavedData.duration = info.audio.duration;
         UIHeader.setSongDuration(info.audio.duration);
      }

      // load audio, image, etc
      let itemDone = 0;
      let maxItem = 0;
      let diffCount = 0;
      const itemSet = new Set([
         'map',
         'cover image',
         'contributors image',
         'audio',
         'audio/BPM data',
      ]);
      function updateStatus() {
         UILoading.status(
            'info',
            `Loading ${[...itemSet].join(', ')}... [${itemDone}/${maxItem - 2}]`,
            lerp(itemDone / maxItem, 15, 80),
         );
      }
      const toPromise = [
         new Promise(async (resolve) => {
            logger.tInfo(tag(), 'Loading cover image');
            const imageFile = beatmapZip.file(info.coverImageFilename);
            if (Settings.load.imageCover && imageFile) {
               let imgBase64 = await imageFile.async('base64');
               UIHeader.setCoverImage('data:image;base64,' + imgBase64);
               flag.loading.coverImage = true;
            } else {
               logger.tError(tag(), `${info.coverImageFilename} does not exists.`);
            }
            itemDone++;
            itemSet.delete('cover image');
            updateStatus();
            resolve(null);
         }),
         new Promise(async (resolve) => {
            SavedData.contributors = [];
            if (info.customData._contributors) {
               for (const contr of info.customData._contributors) {
                  logger.tInfo(tag(), 'Loading contributor image ' + contr._name);
                  const imageFile = beatmapZip.file(contr._iconPath);
                  let _base64 = null;
                  if (Settings.load.imageContributor && imageFile) {
                     _base64 = await imageFile.async('base64');
                  } else {
                     logger.tError(tag(), `${contr._iconPath} does not exists.`);
                  }
                  SavedData.contributors.push({ ...contr, _base64 });
               }
            }
            UIInfo.populateContributors(SavedData.contributors);
            itemDone++;
            itemSet.delete('contributors image');
            updateStatus();
            resolve(null);
         }),
         new Promise(async (resolve) => {
            logger.tInfo(tag(), 'Loading audio');
            let audioFile = beatmapZip.file(info.audio.filename);
            if (Settings.load.audio && audioFile) {
               let loaded = false;
               setTimeout(() => {
                  if (!loaded && !flag.loading.finished) {
                     UILoading.status(
                        'info',
                        'Loading audio... (this may take a while)',
                        lerp(itemDone / maxItem, 15, 80),
                     );
                  }
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
               if (!SavedData.duration) UIHeader.setSongDuration();
               logger.tError(tag(), `${info.audio.filename} does not exist.`);
            }
            itemDone += 3;
            itemSet.delete('Audio');
            updateStatus();
            resolve(null);
         }),
         new Promise<IBeatmapAudio | null>(async (resolve) => {
            const audioInfo = await extractBPMInfo(info, beatmapZip);
            itemDone++;
            itemSet.delete('audio/BPM data');
            if (audioInfo) {
               if (!flag.loading.audio) SavedData.duration = audioInfo.duration;
               UIHeader.setSongDuration(audioInfo.duration);
               updateStatus();
            }
            resolve(audioInfo);
         }),
         ...extractBeatmaps(info, beatmapZip).map(async (d, _, ary) => {
            const res = await d;
            itemDone++;
            diffCount++;
            if (res === null) {
               return null;
            }
            if (ary.length === diffCount) itemSet.delete('map');
            updateStatus();
            return res;
         }),
      ] as const;
      maxItem = toPromise.length + 2;
      updateStatus();
      const promises = await Promise.allSettled(toPromise);
      SavedData.beatmapDifficulty = promises
         .slice(4)
         .map((v) => (v.status === 'fulfilled' ? v.value : null))
         .filter((v) => v) as IBeatmapItem[];

      const audioData = promises[3].status === 'fulfilled' ? promises[3].value : null;
      let minBPM = Math.min(info.audio.bpm, ...(audioData?.bpm ?? []).map((b) => b.bpm));
      let maxBPM = Math.max(info.audio.bpm, ...(audioData?.bpm ?? []).map((b) => b.bpm));
      SavedData.beatmapDifficulty.forEach((d) => {
         if (d.rawVersion === 4) {
            d.bpm.timescale = audioData!.bpm;
         }
         const bpm = d.bpm.change.map((b) => b.BPM);
         const bpme = d.bpm.timescale.map((b) => d.bpm.value / b.scale);
         minBPM = Math.min(minBPM, ...bpm, ...bpme);
         maxBPM = Math.max(maxBPM, ...bpm, ...bpme);
      });
      if (minBPM !== maxBPM) {
         UIHeader.setSongBPM(info.audio.bpm, minBPM, maxBPM);
      }

      UITools.adjustBeatTime();
      UITools.populateSelect(info);

      logger.tInfo(tag(), 'Analysing map');
      UILoading.status('info', 'Analysing general...', 85);
      Analyser.runGeneral();
      UITools.displayOutputGeneral();
      await new Promise((r) => setTimeout(r, 5));

      UILoading.status('info', 'Analysing difficulty...', 90);
      Analyser.applyAll();
      UITools.displayOutputDifficulty();
      await new Promise((r) => setTimeout(r, 5));

      UILoading.status('info', 'Populating stats...', 95);
      logger.tInfo(tag(), 'Populating stats');
      UIStats.populate();
      await new Promise((r) => setTimeout(r, 5));

      UIInput.enable(true);
      UILoading.status('info', 'Successfully loaded!');
   } catch (err) {
      UILoading.status('error', err);
      logger.tError(tag(), err);
      SavedData.clear();
      UIInput.enable(true);
      UIHeader.switchHeader(true);
   } finally {
      console.timeEnd('loading time');
   }
};

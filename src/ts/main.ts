import { UIHeader } from './ui/header.ts';
import { LoadStatus, UILoading } from './ui/loading.ts';
import { UIInfo } from './ui/information/main.ts';
import { UIChecks } from './ui/checks/main.ts';
import { UISelection } from './ui/selection.ts';
import { toggleInputs } from './ui/input.ts';
import Analyser from './checks/main.ts';
import { Settings } from './settings.ts';
import { State } from './state.ts';
import { extractBeatmaps, extractBpmInfo, extractInfo } from './load/index.ts';
import { downloadFromHash, downloadFromId, downloadFromUrl } from './download.ts';
import { sanitizeBeatSaverId, sanitizeUrl, sleep } from './utils/web.ts';
import { logger } from 'bsmap';
import { lerp, round } from 'bsmap/utils';
import { Payload, PayloadType } from './types/main';
import { IBeatmapAudio, IBeatmapContainer } from './types';
import { init } from './init';
import JSZip from 'jszip';
import { UIInfoMetadata } from './ui/information/metadata.ts';

function tag() {
   return ['main'];
}

async function getInputData(payload: Payload): Promise<ArrayBuffer | File> {
   switch (payload.type) {
      case PayloadType.Url:
         return downloadFromUrl(sanitizeUrl(decodeURI(payload.data)));
      case PayloadType.Id:
         return downloadFromId(sanitizeBeatSaverId(decodeURI(payload.data)));
      case PayloadType.Hash:
         return downloadFromHash(decodeURI(payload.data).trim());
      case PayloadType.File:
         return payload.data;
      default:
         throw new Error('Invalid payload.');
   }
}

export async function main(payload: Payload): Promise<void> {
   let start = 0;
   try {
      console.time('loading time');
      start = performance.now();
      toggleInputs(false);

      let rawData = await getInputData(payload);
      UILoading.status(LoadStatus.INFO, 'Extracting zip', 0);
      UIHeader.switchToMetadata();
      const beatmapZip = await JSZip.loadAsync(rawData);

      const entries = beatmapZip
         .filter(
            (relPath) =>
               relPath.endsWith('Info.dat') ||
               relPath.endsWith('info.dat') ||
               relPath.endsWith('Info.json') ||
               relPath.endsWith('info.json'),
         )
         .map((file) => file.name.split('/'))
         .filter((paths) => paths.length <= 2)
         .sort((a, b) => a.length - b.length);
      if (entries.length === 0) {
         throw new Error("Couldn't find Info.dat");
      }
      let path = entries[0].slice(0, -1).join('/');
      if (path) {
         State.flag.nested = true;
         path += '/';
      }

      toggleInputs(false);
      UILoading.status(LoadStatus.INFO, 'Parsing map info...', 10);
      logger.tInfo(tag(), 'Parsing map info');
      const info = await extractInfo(beatmapZip, path);
      State.data.info = info;
      UIInfo.setInfo(info);

      if (info.audio.duration) {
         State.data.duration = info.audio.duration;
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
            LoadStatus.INFO,
            `Loading ${[...itemSet].join(', ')}... [${itemDone}/${maxItem - 2}]`,
            lerp(itemDone / maxItem, 15, 80),
         );
      }
      const toPromise = [
         new Promise(async (resolve) => {
            logger.tInfo(tag(), 'Loading cover image');
            const imageFile = beatmapZip.file(info.coverImageFilename);
            if (Settings.props.load.imageCover && imageFile) {
               let imgBase64 = await imageFile.async('base64');
               UIHeader.setCoverImage('data:image;base64,' + imgBase64);
               State.flag.coverImage = true;
            } else {
               logger.tError(tag(), `${info.coverImageFilename} does not exists.`);
            }
            itemDone++;
            itemSet.delete('cover image');
            updateStatus();
            resolve(null);
         }),
         new Promise(async (resolve) => {
            State.data.contributors = [];
            if (info.customData._contributors) {
               for (const contr of info.customData._contributors) {
                  logger.tInfo(tag(), 'Loading contributor image ' + contr._name);
                  const imageFile = beatmapZip.file(contr._iconPath);
                  let _base64 = null;
                  if (Settings.props.load.imageContributor && imageFile) {
                     _base64 = await imageFile.async('base64');
                  } else {
                     logger.tError(tag(), `${contr._iconPath} does not exists.`);
                  }
                  State.data.contributors.push({ ...contr, _base64 });
               }
            }
            UIInfoMetadata.populateContributors(State.data.contributors);
            itemDone++;
            itemSet.delete('contributors image');
            updateStatus();
            resolve(null);
         }),
         new Promise(async (resolve) => {
            logger.tInfo(tag(), 'Loading audio');
            let audioFile = beatmapZip.file(info.audio.filename);
            if (Settings.props.load.audio && audioFile) {
               let loaded = false;
               setTimeout(() => {
                  if (!loaded && !State.flag.finished) {
                     UILoading.status(
                        LoadStatus.INFO,
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
                     State.data.duration = duration;
                     UIHeader.setSongDuration(duration);
                     State.flag.audio = true;
                  })
                  .catch(function (err) {
                     UIHeader.setSongDuration();
                     logger.tError(tag(), err);
                  });
            } else {
               if (!State.data.duration) UIHeader.setSongDuration();
               logger.tError(tag(), `${info.audio.filename} does not exist.`);
            }
            itemDone += 2;
            itemSet.delete('Audio');
            updateStatus();
            resolve(null);
         }),
         new Promise<IBeatmapAudio | null>(async (resolve) => {
            const audioInfo = await extractBpmInfo(info, beatmapZip, path);
            itemDone++;
            itemSet.delete('audio/BPM data');
            if (audioInfo) {
               if (!State.flag.audio) State.data.duration = audioInfo.duration;
               UIHeader.setSongDuration(audioInfo.duration);
               updateStatus();
            }
            resolve(audioInfo);
         }),
         ...extractBeatmaps(info, beatmapZip, path).map(async (d, _, ary) => {
            const res = d.then((v) => v).catch(console.error);
            itemDone++;
            diffCount++;
            if (ary.length === diffCount) itemSet.delete('map');
            updateStatus();
            return res;
         }),
      ] as const;
      maxItem = toPromise.length + 2;
      updateStatus();
      const promises = await Promise.allSettled(toPromise);
      State.data.beatmaps = promises
         .slice(4)
         .map((v) => (v.status === 'fulfilled' ? v.value : null))
         .filter((v) => v !== null) as IBeatmapContainer[];

      const audioData = promises[3].status === 'fulfilled' ? promises[3].value : null;
      let minBPM = Math.min(info.audio.bpm, ...(audioData?.bpm ?? []).map((b) => b.bpm));
      let maxBPM = Math.max(info.audio.bpm, ...(audioData?.bpm ?? []).map((b) => b.bpm));
      State.data.beatmaps.forEach((d) => {
         if (d.rawVersion === 4) {
            d.timeProcessor.timescale = audioData!.bpm;
         }
         const bpm = d.timeProcessor.change.map((b) => b.BPM);
         const bpme = d.timeProcessor.timescale.map((b) => d.timeProcessor.bpm / b.scale!);
         minBPM = Math.min(minBPM, ...bpm, ...bpme);
         maxBPM = Math.max(maxBPM, ...bpm, ...bpme);
      });
      if (minBPM !== maxBPM) {
         UIHeader.setSongBPM(info.audio.bpm, minBPM, maxBPM);
      }

      UIChecks.adjustBeatTime();
      UISelection.populateSelectCharacteristic(info);

      logger.tInfo(tag(), 'Analysing map');
      UILoading.status(LoadStatus.INFO, 'Analysing general...', 85);
      Analyser.runGeneral();
      UIChecks.displayOutputGeneral();
      await sleep(5);

      UILoading.status(LoadStatus.INFO, 'Analysing difficulty...', 90);
      Analyser.applyAll();
      UIChecks.displayOutputDifficulty();
      await sleep(5);

      let end = performance.now();
      UILoading.status(LoadStatus.INFO, `Completed! (took ${round((end - start) / 1000, 2)}s)`);
   } catch (err) {
      UILoading.status(LoadStatus.ERROR, err);
      logger.tError(tag(), err);
      State.clear();
      UIHeader.switchToIntro();
   } finally {
      toggleInputs(true);
      console.timeEnd('loading time');
   }
}

init();

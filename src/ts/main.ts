import UIHeader from './ui/header';
import UILoading from './ui/loading';
import UIInfo from './ui/information';
import UITools from './ui/tools';
import UIStats from './ui/stats';
import UIInput from './ui/input';
import Analyser from './tools/analyzer';
import Settings from './settings';
import Flag from './flag';
import SavedData from './savedData';
import { loadDifficulty, loadInfo } from './load';
import { downloadFromHash, downloadFromID, downloadFromURL } from './download';
import { sanitizeBeatSaverID, sanitizeURL } from './utils/web';
import { isHex } from './utils';
import { extractZip } from './extract';
import Logger from './logger';
import { LoadType } from './types/mapcheck/main';

const tag = () => {
    return `[main]`;
};

// TODO: break these to smaller functions, and probably slap in async while at it
// TODO: possibly do more accurate & predictive loading bar based on the amount of file available (may be farfetched and likely not be implemented)
export default async (type: LoadType) => {
    try {
        console.time('loading time');
        UIInput.enable(false);
        let file: ArrayBuffer | File;
        if (type.file) {
            file = type.file;
        } else if (type.link) {
            file = await downloadFromURL(sanitizeURL(decodeURI(type.link)));
        } else if (type.id) {
            file = await downloadFromID(sanitizeBeatSaverID(decodeURI(type.id)));
        } else if (type.hash && isHex(decodeURI(type.hash).trim())) {
            file = await downloadFromHash(decodeURI(type.hash).trim());
        } else {
            throw new Error('Could not search for file.');
        }
        UILoading.status('info', 'Extracting zip', 0);
        UIHeader.switchHeader(false);
        const mapZip = await extractZip(file);

        UIInput.enable(false);
        UILoading.status('info', 'Parsing map info...', 0);
        Logger.info(tag(), 'Parsing map info');
        const info = await loadInfo(mapZip);
        SavedData.beatmapInfo = info;
        UIInfo.setInfo(info);

        // load cover image
        UILoading.status('info', 'Loading image...', 10.4375);
        Logger.info(tag(), 'Loading cover image');
        let imageFile = mapZip.file(info._coverImageFilename);
        if (Settings.load.imageCover && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            UIHeader.setCoverImage('data:image;base64,' + imgBase64);
            Flag.loading.coverImage = true;
        } else {
            Logger.error(tag(), `${info._coverImageFilename} does not exists.`);
        }

        SavedData.contributors = [];
        if (info?._customData?._contributors) {
            for (const contr of info._customData._contributors) {
                Logger.info(tag(), 'Loading contributor image ' + contr._name);
                imageFile = mapZip.file(contr._iconPath);
                let _base64 = null;
                if (Settings.load.imageContributor && imageFile) {
                    _base64 = await imageFile.async('base64');
                } else {
                    Logger.error(tag(), `${contr._iconPath} does not exists.`);
                }
                SavedData.contributors.push({ ...contr, _base64 });
            }
        }

        // load audio
        UILoading.status('info', 'Loading audio...', 20.875);
        Logger.info(tag(), 'Loading audio');
        let audioFile = mapZip.file(info._songFilename);
        if (Settings.load.audio && audioFile) {
            let loaded = false;
            setTimeout(() => {
                if (!loaded) UILoading.status('info', 'Loading audio... (this may take a while)', 20.875);
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
                    Flag.loading.audio = true;
                })
                .catch(function (err) {
                    UIHeader.setSongDuration();
                    Logger.error(tag(), err);
                });
        } else {
            UIHeader.setSongDuration();
            Logger.error(tag(), `${info._songFilename} does not exist.`);
        }

        // load diff map
        UILoading.status('info', 'Parsing difficulty...', 70);
        SavedData.beatmapDifficulty = await loadDifficulty(info, mapZip);

        UITools.adjustTime();
        UILoading.status('info', 'Adding map difficulty stats...', 80);
        Logger.info(tag(), 'Adding map stats');
        UIStats.populate();
        UIInfo.populateContributors(SavedData.contributors);

        UILoading.status('info', 'Analysing map...', 85);
        Logger.info(tag(), 'Analysing map');
        Analyser.runGeneral();
        UITools.displayOutputGeneral();

        UILoading.status('info', 'Analysing difficulty...', 90);
        Analyser.applyAll();
        UITools.populateSelect(info);
        UITools.displayOutputDifficulty();

        UIInput.enable(true);
        UILoading.status('info', 'Map successfully loaded!');
        console.timeEnd('loading time');
    } catch (err) {
        UILoading.status('error', err, 100);
        Logger.error(tag(), err);
        SavedData.clear();
        UIInput.enable(true);
        UIHeader.switchHeader(true);
    }
};

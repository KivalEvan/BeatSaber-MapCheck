import uiHeader from './ui/header';
import uiLoading from './ui/loading';
import uiInfo from './ui/information';
import uiTools from './ui/tools';
import uiStats from './ui/stats';
import uiInput from './ui/input';
import * as beatmap from './beatmap';
import * as analyse from './tools/analyse';
import settings from './settings';
import flag from './flag';
import SavedData from './SavedData';
import { loadDifficulty, loadInfo } from './load';
import { downloadFromHash, downloadFromID, downloadFromURL } from './download';
import { sanitizeBeatSaverID, sanitizeURL } from './utils/web';
import { isHex } from './utils';
import { extractZip } from './extract';

interface LoadType {
    link?: string | null;
    id?: string | null;
    hash?: string | null;
    file?: File | null;
}

// TODO: break these to smaller functions, and probably slap in async while at it
// TODO: possibly do more accurate & predictive loading bar based on the amount of file available (may be farfetched and likely not be implemented)
export default async (type: LoadType) => {
    try {
        uiInput.enable(false);
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
        uiLoading.status('info', 'Extracting zip', 0);
        uiHeader.switchHeader(true);
        const mapZip = await extractZip(file);

        uiInput.enable(false);
        uiLoading.status('info', 'Parsing map info...', 0);
        console.log('parsing map info');
        const info = await loadInfo(mapZip);
        SavedData.beatmapInfo = info;

        beatmap.parse.info(info);
        uiInfo.setInfo(info);

        // load cover image
        uiLoading.status('info', 'Loading image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(info._coverImageFilename);
        if (settings.load.imageCover && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            uiHeader.setCoverImage('data:image;base64,' + imgBase64);
            flag.loading.coverImage = true;
        } else {
            console.error(`${info._coverImageFilename} does not exists.`);
        }

        SavedData.contributors = [];
        if (info?._customData?._contributors) {
            for (const contr of info._customData._contributors) {
                console.log('loading contributor image ' + contr._name);
                imageFile = mapZip.file(contr._iconPath);
                let _base64 = null;
                if (settings.load.imageContributor && imageFile) {
                    _base64 = await imageFile.async('base64');
                } else {
                    console.error(`${contr._iconPath} does not exists.`);
                }
                SavedData.contributors.push({ ...contr, _base64 });
            }
        }

        // load audio
        uiLoading.status('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(info._songFilename);
        if (settings.load.audio && audioFile) {
            let loaded = false;
            setTimeout(() => {
                if (!loaded)
                    uiLoading.status(
                        'info',
                        'Loading audio... (this may take a while)',
                        20.875
                    );
            }, 10000);
            let arrayBuffer = await audioFile.async('arraybuffer');
            uiHeader.setAudio(arrayBuffer);
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(arrayBuffer)
                .then((buffer) => {
                    loaded = true;
                    let duration = buffer.duration;
                    SavedData.duration = duration;
                    uiHeader.setSongDuration(duration);
                    flag.loading.audio = true;
                })
                .catch(function (err) {
                    uiHeader.setSongDuration();
                    console.error(err);
                });
        } else {
            uiHeader.setSongDuration();
            console.error(`${info._songFilename} does not exist.`);
        }

        // load diff map
        uiLoading.status('info', 'Parsing difficulty...', 70);
        SavedData.beatmapDifficulty = await loadDifficulty(info, mapZip);

        uiTools.adjustTime();
        uiLoading.status('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        uiStats.populate();
        uiInfo.populateContributors(SavedData.contributors);

        uiLoading.status('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyse.sps();
        analyse.general();
        uiTools.displayOutputGeneral();

        uiLoading.status('info', 'Analysing difficulty...', 90);
        analyse.all();
        uiTools.populateSelect(info);
        uiTools.displayOutputDifficulty();

        uiInput.enable(true);
        uiLoading.status('info', 'Map successfully loaded!');
    } catch (err) {
        uiLoading.status('error', err, 100);
        console.error(err);
        SavedData.clear();
        uiInput.enable(true);
        uiHeader.switchHeader(false);
    }
};

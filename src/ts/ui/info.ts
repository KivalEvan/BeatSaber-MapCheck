// may god help you maintain these
import { round, toMMSS } from '../utils';
import { Contributor } from '../beatmap/contributor';
import { EnvironmentName } from '../beatmap/environment';
import { BeatmapInfo, BeatmapSetDifficulty } from '../beatmap/info';
import { CustomDataInfo } from '../beatmap/customData';
import { Editor, EditorInfo } from '../beatmap/editor';
import savedData from '../savedData';
import { MapData } from '../beatmap';
import { BeatmapData } from '../beatmap/map';
import { ChromaEnvironment } from '../beatmap/chroma';
import { NECustomEventData, NEPointDefinition } from '../beatmap/noodleExtensions';
import { Bookmark } from '../beatmap/bookmark';
import BeatPerMinute from '../beatmap/bpm';

const htmlIntro = document.querySelectorAll<HTMLElement>('.intro');
const htmlMetadata = document.querySelectorAll<HTMLElement>('.metadata');
const htmlCoverLink = document.querySelectorAll<HTMLLinkElement>('.cover__link');
const htmlCoverImage = document.querySelectorAll<HTMLImageElement>('.cover__image');

const htmlMetadataSongName = document.querySelectorAll<HTMLElement>('.metadata__song-name');
const htmlMetadataSongSubname = document.querySelectorAll<HTMLElement>('.metadata__song-subname');
const htmlMetadataSongAuthor = document.querySelectorAll<HTMLElement>('.metadata__song-author');
const htmlMetadataSongBPM = document.querySelectorAll<HTMLElement>('.metadata__song-bpm');
const htmlMetadataSongDuration = document.querySelectorAll<HTMLElement>('.metadata__song-duration');

const htmlInfoLevelAuthor = document.querySelectorAll<HTMLElement>('.info__level-author');
const htmlInfoEnvironment = document.querySelectorAll<HTMLElement>('.info__environment');
const htmlInfoEditors = document.querySelectorAll<HTMLElement>('.info__editors');
const htmlInfoContributors = document.querySelectorAll<HTMLElement>('.info__contributors');
const htmlInfoContributorsSelect = document.querySelector<HTMLSelectElement>(
    '.info__contributors-select'
);
const htmlInfoContributorsImage = document.querySelectorAll<HTMLImageElement>(
    '.info__contributors-image'
);
const htmlInfoContributorsName = document.querySelectorAll<HTMLElement>('.info__contributors-name');
const htmlInfoContributorsRole = document.querySelectorAll<HTMLElement>('.info__contributors-role');

const htmlInfoTimeSpend = document.querySelectorAll<HTMLElement>('.info__time-spend');
const htmlInfoRequirements = document.querySelectorAll<HTMLElement>('.info__requirements');
const htmlInfoSuggestions = document.querySelectorAll<HTMLElement>('.info__suggestions');
const htmlInfoInformation = document.querySelectorAll<HTMLElement>('.info__information');
const htmlInfoWarnings = document.querySelectorAll<HTMLElement>('.info__warnings');
const htmlInfoBookmarks = document.querySelectorAll<HTMLElement>('.info__bookmarks');
const htmlInfoEnvironmentEnhancement = document.querySelectorAll<HTMLElement>(
    '.info__environment-enhancement'
);
const htmlInfoPointDefinitions = document.querySelectorAll<HTMLElement>('.info__point-definitions');
const htmlInfoCustomEvents = document.querySelectorAll<HTMLElement>('.info__custom-events');

htmlInfoContributorsSelect?.addEventListener('change', contributorsSelectHandler);

export const switchHeader = (bool: boolean): void => {
    htmlIntro.forEach((elem) =>
        bool ? elem.classList.add('hidden') : elem.classList.remove('hidden')
    );
    htmlMetadata.forEach((elem) =>
        !bool ? elem.classList.add('hidden') : elem.classList.remove('hidden')
    );
};

export const setCoverImage = (src: string): void => {
    htmlCoverImage.forEach((elem) => (elem.src = src));
};

export const setCoverLink = (url?: string, id?: string): void => {
    if (url == null && id == null) {
        htmlCoverLink.forEach((elem) => {
            elem.textContent = '';
            elem.href = '';
            elem.classList.add('disabled');
        });
        return;
    }
    if (url != null) {
        htmlCoverLink.forEach((elem) => {
            elem.textContent = id ?? 'Download Link';
            elem.href = url;
            elem.classList.remove('disabled');
        });
    }
};

export const setSongName = (str: string): void => {
    htmlMetadataSongName.forEach((elem) => (elem.textContent = str));
};

export const setSongSubname = (str: string): void => {
    htmlMetadataSongSubname.forEach((elem) => (elem.textContent = str));
};

export const setSongAuthor = (str: string): void => {
    htmlMetadataSongAuthor.forEach((elem) => (elem.textContent = str));
};

// TODO: some way to save bpm change
export const setSongBPM = (num: number, minBPM?: number, maxBPM?: number): void => {
    if ((minBPM === null || minBPM === undefined) && typeof maxBPM === 'number') {
        minBPM = Math.min(num, maxBPM);
    }
    if ((maxBPM === null || maxBPM === undefined) && typeof minBPM === 'number') {
        maxBPM = Math.max(num, minBPM);
    }
    let text = round(num, 2).toString() + 'BPM';
    if (minBPM && maxBPM) {
    }
    htmlMetadataSongBPM.forEach((elem) => (elem.textContent = text));
};

export const setSongDuration = (num: number): void => {
    htmlMetadataSongDuration.forEach((elem) => (elem.textContent = toMMSS(num)));
};

export const setLevelAuthor = (str: string): void => {
    htmlInfoLevelAuthor.forEach((elem) => (elem.textContent = 'Mapped by ' + str));
};

export const setEnvironment = (str: string): void => {
    htmlInfoEnvironment.forEach((elem) => {
        elem.textContent =
            (EnvironmentName[str as keyof typeof EnvironmentName] || 'Unknown') + ' Environment';
    });
};

export const setEditors = (obj: Editor | undefined): void => {
    if (!obj || !obj._lastEditedBy) {
        htmlInfoEditors.forEach((elem) => elem.classList.add('hidden'));
        return;
    }
    htmlInfoEditors.forEach((elem) => {
        elem.classList.remove('hidden');
        let text = 'Last edited on ' + obj._lastEditedBy;
        if (obj._lastEditedBy && obj[obj._lastEditedBy]) {
            const mapper = obj[obj._lastEditedBy] as EditorInfo;
            text += ' v' + mapper.version;
        }
        elem.textContent = text;
    });
};

const setContributorsImage = (src: string | undefined): void => {
    htmlInfoContributorsImage.forEach(
        (elem) => (elem.src = 'data:image;base64,' + src || './assets/unknown.jpg')
    );
};

const setContributorsName = (str: string): void => {
    htmlInfoContributorsName.forEach((elem) => (elem.textContent = str));
};

const setContributorsRole = (str: string): void => {
    htmlInfoContributorsRole.forEach((elem) => (elem.textContent = str));
};

export const setContributors = (obj: Contributor): void => {
    setContributorsImage(obj._base64);
    setContributorsName(obj._name);
    setContributorsRole(obj._role);
};

export const populateContributors = (arr: Contributor[] | undefined): void => {
    if (!arr || !arr.length) {
        htmlInfoContributors.forEach((elem) => elem.classList.add('hidden'));
        return;
    }
    htmlInfoContributors.forEach((elem) => elem.classList.remove('hidden'));
    let first = true;
    arr.forEach((el, index) => {
        if (first) {
            first = false;
            setContributors(el);
        }
        const optCont = document.createElement('option');
        optCont.value = index.toString();
        optCont.text = el._name + ' -- ' + el._role;
        htmlInfoContributorsSelect?.add(optCont);
    });
};

const hideTableRow = <T extends NodeListOf<HTMLElement>>(elem: T): void => {
    elem.forEach((el) => {
        const tableElem = el.querySelector('.info__table-element');
        if (tableElem) {
            tableElem.innerHTML = '';
        }
        el.classList.add('hidden');
    });
};

const displayTableRow = <T extends NodeListOf<HTMLElement>>(elem: T, content: string): void => {
    elem.forEach((el) => {
        const tableElem = el.querySelector('.info__table-element');
        if (tableElem) {
            tableElem.innerHTML = content;
        }
        el.classList.remove('hidden');
    });
};

export const setTimeSpend = (num: number | undefined): void => {
    if (num === undefined || num === null) {
        hideTableRow(htmlInfoTimeSpend);
        return;
    }
    const content = toMMSS(num);
    displayTableRow(htmlInfoTimeSpend, content);
};

export const setRequirements = (arr: string[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoRequirements);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlInfoRequirements, content);
};

export const setSuggestions = (arr: string[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoSuggestions);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlInfoSuggestions, content);
};

export const setInformation = (arr: string[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoInformation);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlInfoInformation, content);
};

export const setWarnings = (arr: string[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoWarnings);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlInfoWarnings, content);
};

export const setBookmarks = (arr: Bookmark[] | undefined, bpm?: BeatPerMinute | null): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoBookmarks);
        return;
    }
    const bookmarkText = arr.map((elem) => {
        let time = elem._time;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        return `${elem._time}${rt ? ' | ' + toMMSS(rt) : ''} -- ${elem._name}`;
    });
    const content = bookmarkText.join('<br>');
    displayTableRow(htmlInfoBookmarks, content);
};

export const setEnvironmentEnhancement = (arr: ChromaEnvironment[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoEnvironmentEnhancement);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlInfoEnvironmentEnhancement, content);
};

export const setPointDefinitions = (arr: NEPointDefinition[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoPointDefinitions);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlInfoPointDefinitions, content);
};

export const setCustomEvents = (arr: NECustomEventData[] | undefined): void => {
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlInfoCustomEvents);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlInfoCustomEvents, content);
};

export const setInfo = (mapInfo: BeatmapInfo): void => {
    setSongName(mapInfo._songName);
    setSongSubname(mapInfo._songSubName);
    setSongAuthor(mapInfo._songAuthorName);
    setSongBPM(mapInfo._beatsPerMinute);
    setLevelAuthor(mapInfo._levelAuthorName);
    setEnvironment(mapInfo._environmentName);
    setEditors(mapInfo._customData?._editors);
};

export const setDiffInfoTable = (mapData: MapData): void => {
    if (mapData._info?._customData) {
        setRequirements(mapData._info._customData._requirements);
        setSuggestions(mapData._info._customData._suggestions);
        setInformation(mapData._info._customData._information);
        setWarnings(mapData._info._customData._warnings);
    }
    if (mapData._data?._customData) {
        const bpm = savedData._mapInfo?._beatsPerMinute
            ? new BeatPerMinute(
                  savedData._mapInfo._beatsPerMinute,
                  mapData._data._customData._bpmChanges || mapData._data._customData._BPMChanges
              )
            : null;
        setTimeSpend(mapData._data._customData._time);
        setBookmarks(mapData._data._customData._bookmarks, bpm);
    }
};

function contributorsSelectHandler(ev: Event): void {
    if (!savedData._contributors) {
        return;
    }
    const target = ev.target as HTMLSelectElement;
    setContributors(savedData._contributors[parseInt(target.value)]);
}

export default {
    switchHeader,
    setCoverImage,
    setCoverLink,
    setSongName,
    setSongSubname,
    setSongAuthor,
    setSongBPM,
    setSongDuration,
    setLevelAuthor,
    setEnvironment,
    setEditors,
    setContributors,
    populateContributors,
    setTimeSpend,
    setInfo,
};

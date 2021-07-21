// may god help you maintain these
// TODO: sanitize input before it reach innerHTML, or change the implementation
import * as uiHeader from './header';
import { toMMSS } from '../utils';
import * as beatmap from '../beatmap';
import savedData from '../savedData';

const logPrefix = 'UI Info: ';

const htmlInfoLevelAuthor = document.querySelector<HTMLElement>('.info__level-author');
const htmlInfoEnvironment = document.querySelector<HTMLElement>('.info__environment');
const htmlInfoEditors = document.querySelector<HTMLElement>('.info__editors');
const htmlInfoContributors = document.querySelector<HTMLElement>('.info__contributors');
const htmlInfoContributorsSelect = document.querySelector<HTMLSelectElement>(
    '.info__contributors-select'
);
const htmlInfoContributorsImage = document.querySelector<HTMLImageElement>(
    '.info__contributors-image'
);
const htmlInfoContributorsName = document.querySelector<HTMLElement>('.info__contributors-name');
const htmlInfoContributorsRole = document.querySelector<HTMLElement>('.info__contributors-role');

const htmlTableTimeSpend = document.querySelector<HTMLElement>('.info__time-spend');
const htmlTableRequirements = document.querySelector<HTMLElement>('.info__requirements');
const htmlTableSuggestions = document.querySelector<HTMLElement>('.info__suggestions');
const htmlTableInformation = document.querySelector<HTMLElement>('.info__information');
const htmlTableWarnings = document.querySelector<HTMLElement>('.info__warnings');
const htmlTableBookmarks = document.querySelector<HTMLElement>('.info__bookmarks');
const htmlTableEnvironmentEnhancement = document.querySelector<HTMLElement>(
    '.info__environment-enhancement'
);
const htmlTablePointDefinitions = document.querySelector<HTMLElement>('.info__point-definitions');
const htmlTableCustomEvents = document.querySelector<HTMLElement>('.info__custom-events');

if (!htmlInfoLevelAuthor || !htmlInfoEnvironment || !htmlInfoEditors) {
    console.error(logPrefix + 'info component is missing part');
}
if (!htmlInfoContributors || !htmlInfoContributorsName || !htmlInfoContributorsRole) {
    console.error(logPrefix + 'contributors component is missing part');
}
if (htmlInfoContributorsSelect) {
    htmlInfoContributorsSelect.addEventListener('change', contributorsSelectHandler);
} else {
    console.error(logPrefix + 'contributors select is missing');
}
if (
    !htmlTableTimeSpend ||
    !htmlTableRequirements ||
    !htmlTableSuggestions ||
    !htmlTableInformation ||
    !htmlTableWarnings ||
    !htmlTableBookmarks ||
    !htmlTableEnvironmentEnhancement ||
    !htmlTablePointDefinitions ||
    !htmlTableCustomEvents
) {
    console.error(logPrefix + 'table info component is missing part');
}

export const setLevelAuthor = (str: string): void => {
    if (!htmlInfoLevelAuthor) {
        console.error(logPrefix + 'missing HTML element for level author');
        return;
    }
    htmlInfoLevelAuthor.textContent = 'Mapped by ' + str;
};

export const setEnvironment = (str: string): void => {
    if (!htmlInfoEnvironment) {
        console.error(logPrefix + 'missing HTML element for environment');
        return;
    }
    htmlInfoEnvironment.textContent =
        (beatmap.environment.EnvironmentName[
            str as keyof typeof beatmap.environment.EnvironmentName
        ] || 'Unknown') + ' Environment';
};

export const setEditors = (obj: beatmap.editor.Editor | undefined): void => {
    if (!htmlInfoEditors) {
        console.error(logPrefix + 'missing HTML element for editor');
        return;
    }
    if (!obj || !obj._lastEditedBy) {
        htmlInfoEditors.classList.add('hidden');
        return;
    }
    htmlInfoEditors.classList.remove('hidden');
    const lastEdited = obj._lastEditedBy || 'Undefined';
    let text = 'Last edited on ' + lastEdited;
    if (obj[lastEdited]) {
        const mapper = obj[lastEdited] as beatmap.editor.EditorInfo;
        text += ' v' + mapper.version;
    }
    htmlInfoEditors.textContent = text;
};

const setContributorsImage = (src: string | undefined): void => {
    if (!htmlInfoContributorsImage) {
        console.error(logPrefix + 'missing HTML element for contributor image');
        return;
    }
    htmlInfoContributorsImage.src = src || './assets/unknown.jpg';
};

const setContributorsName = (str: string): void => {
    if (!htmlInfoContributorsName) {
        console.error(logPrefix + 'missing HTML element for contributor name');
        return;
    }
    htmlInfoContributorsName.textContent = str;
};

const setContributorsRole = (str: string): void => {
    if (!htmlInfoContributorsRole) {
        console.error(logPrefix + 'missing HTML element for contributor role');
        return;
    }
    htmlInfoContributorsRole.textContent = str;
};

export const setContributors = (obj: beatmap.contributor.Contributor): void => {
    setContributorsImage('data:image;base64,' + obj._base64);
    setContributorsName(obj._name);
    setContributorsRole(obj._role);
};

export const populateContributors = (arr: beatmap.contributor.Contributor[] | undefined): void => {
    if (!htmlInfoContributors || !htmlInfoContributorsSelect) {
        console.error(logPrefix + 'missing HTML element for contributor');
        return;
    }
    if (htmlInfoContributors && (!arr || !arr.length)) {
        htmlInfoContributors.classList.add('hidden');
        return;
    }
    if (arr) {
        htmlInfoContributors.classList.remove('hidden');
        let first = true;
        arr.forEach((el, index) => {
            if (first) {
                first = false;
                setContributors(el);
            }
            const optCont = document.createElement('option');
            optCont.value = index.toString();
            optCont.text = el._name + ' -- ' + el._role;
            htmlInfoContributorsSelect.add(optCont);
        });
    }
};

const hideTableRow = <T extends HTMLElement>(elem: T): void => {
    const tableElem = elem.querySelector('.info__table-element');
    if (tableElem) {
        tableElem.innerHTML = '';
    }
    elem.classList.add('hidden');
};

const displayTableRow = <T extends HTMLElement>(elem: T, content: string): void => {
    const tableElem = elem.querySelector('.info__table-element');
    if (tableElem) {
        tableElem.innerHTML = content;
    }
    elem.classList.remove('hidden');
};

export const setTimeSpend = (num: number | undefined): void => {
    if (!htmlTableTimeSpend) {
        console.error(logPrefix + 'missing table row for time spend');
        return;
    }
    if (num === undefined || num === null) {
        hideTableRow(htmlTableTimeSpend);
        return;
    }
    const content = toMMSS(num);
    displayTableRow(htmlTableTimeSpend, content);
};

export const setRequirements = (arr: string[] | undefined): void => {
    if (!htmlTableRequirements) {
        console.error(logPrefix + 'missing table row for requirements');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableRequirements);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlTableRequirements, content);
};

export const setSuggestions = (arr: string[] | undefined): void => {
    if (!htmlTableSuggestions) {
        console.error(logPrefix + 'missing table row for suggestions');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableSuggestions);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlTableSuggestions, content);
};

export const setInformation = (arr: string[] | undefined): void => {
    if (!htmlTableInformation) {
        console.error(logPrefix + 'missing table row for information');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableInformation);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableInformation, content);
};

export const setWarnings = (arr: string[] | undefined): void => {
    if (!htmlTableWarnings) {
        console.error(logPrefix + 'missing table row for warnings');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableWarnings);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableWarnings, content);
};

export const setBookmarks = (
    arr: beatmap.bookmark.Bookmark[] | undefined,
    bpm?: beatmap.bpm.BeatPerMinute | null
): void => {
    if (!htmlTableBookmarks) {
        console.error(logPrefix + 'missing table row for bookmarks');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableBookmarks);
        return;
    }
    const bookmarkText = arr.map((elem) => {
        let time = elem._time;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        return `${elem._time}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem._name === '' ? elem._name : '**EMPTY NAME**'
        }`;
    });
    const content = bookmarkText.join('<br>');
    displayTableRow(htmlTableBookmarks, content);
};

export const setEnvironmentEnhancement = (
    arr: beatmap.chroma.ChromaEnvironment[] | undefined
): void => {
    if (!htmlTableEnvironmentEnhancement) {
        console.error(logPrefix + 'missing table row for environment enhancement');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableEnvironmentEnhancement);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableEnvironmentEnhancement, content);
};

export const setPointDefinitions = (
    arr: beatmap.noodleExtensions.NEPointDefinition[] | undefined
): void => {
    if (!htmlTablePointDefinitions) {
        console.error(logPrefix + 'missing table row for point definitions');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTablePointDefinitions, content);
};

export const setCustomEvents = (
    arr: beatmap.noodleExtensions.NECustomEventData[] | undefined
): void => {
    if (!htmlTableCustomEvents) {
        console.error(logPrefix + 'missing table row for custom events');
        return;
    }
    if (arr == undefined || !arr.length) {
        hideTableRow(htmlTableCustomEvents);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableCustomEvents, content);
};

export const setInfo = (mapInfo: beatmap.info.BeatmapInfo): void => {
    uiHeader.setSongName(mapInfo._songName);
    uiHeader.setSongSubname(mapInfo._songSubName);
    uiHeader.setSongAuthor(mapInfo._songAuthorName);
    uiHeader.setSongBPM(mapInfo._beatsPerMinute);
    setLevelAuthor(mapInfo._levelAuthorName);
    setEnvironment(mapInfo._environmentName);
    setEditors(mapInfo._customData?._editors);
};

export const setDiffInfoTable = (mapData: beatmap.map.MapDataSet): void => {
    if (mapData._info?._customData) {
        setRequirements(mapData._info._customData._requirements);
        setSuggestions(mapData._info._customData._suggestions);
        setInformation(mapData._info._customData._information);
        setWarnings(mapData._info._customData._warnings);
    }
    if (mapData._data?._customData) {
        const bpm = savedData._mapInfo?._beatsPerMinute
            ? beatmap.bpm.create(
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

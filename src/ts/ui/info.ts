// may god help you maintain these
// TODO: add custom colours somewhere
import * as uiHeader from './header';
import * as beatmap from '../beatmap';
import { removeOptions, toMMSS } from '../utils';
import savedData from '../savedData';
import sanitizeHtml from 'sanitize-html';

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

export const setLevelAuthor = (str?: string): void => {
    if (!htmlInfoLevelAuthor) {
        console.error(logPrefix + 'missing HTML element for level author');
        return;
    }
    if (!str) {
        htmlInfoLevelAuthor.textContent = '';
        return;
    }
    htmlInfoLevelAuthor.textContent = 'Mapped by ' + str;
};

export const setEnvironment = (str?: beatmap.environment.EnvironmentName): void => {
    if (!htmlInfoEnvironment) {
        console.error(logPrefix + 'missing HTML element for environment');
        return;
    }
    if (!str) {
        htmlInfoEnvironment.textContent = '';
        return;
    }
    htmlInfoEnvironment.textContent =
        (beatmap.environment.EnvironmentRename[str] || 'Unknown') + ' Environment';
};

export const setEditors = (obj?: beatmap.editor.Editor): void => {
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

const setContributorsImage = (src: string | null): void => {
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
    setContributorsImage(obj._base64 ? 'data:image;base64,' + obj._base64 : null);
    setContributorsName(obj._name);
    setContributorsRole(obj._role);
};

export const populateContributors = (arr?: beatmap.contributor.Contributor[]): void => {
    if (!htmlInfoContributors || !htmlInfoContributorsSelect) {
        console.error(logPrefix + 'missing HTML element for contributor');
        return;
    }
    if (htmlInfoContributors && (!arr || !arr.length)) {
        htmlInfoContributors.classList.add('hidden');
        removeOptions(htmlInfoContributorsSelect);
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
        tableElem.innerHTML = sanitizeHtml(content, { allowedTags: ['br'] });
    }
    elem.classList.remove('hidden');
};

export const setTimeSpend = (num?: number): void => {
    if (!htmlTableTimeSpend) {
        console.error(logPrefix + 'missing table row for time spend');
        return;
    }
    if (num == null) {
        hideTableRow(htmlTableTimeSpend);
        return;
    }
    const content = toMMSS(num);
    displayTableRow(htmlTableTimeSpend, content);
};

export const setRequirements = (arr?: string[]): void => {
    if (!htmlTableRequirements) {
        console.error(logPrefix + 'missing table row for requirements');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableRequirements);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlTableRequirements, content);
};

export const setSuggestions = (arr?: string[]): void => {
    if (!htmlTableSuggestions) {
        console.error(logPrefix + 'missing table row for suggestions');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableSuggestions);
        return;
    }
    const content = arr.join(', ');
    displayTableRow(htmlTableSuggestions, content);
};

export const setInformation = (arr?: string[]): void => {
    if (!htmlTableInformation) {
        console.error(logPrefix + 'missing table row for information');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableInformation);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableInformation, content);
};

export const setWarnings = (arr?: string[]): void => {
    if (!htmlTableWarnings) {
        console.error(logPrefix + 'missing table row for warnings');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableWarnings);
        return;
    }
    const content = arr.join('<br>');
    displayTableRow(htmlTableWarnings, content);
};

export const setBookmarks = (
    arr?: beatmap.bookmark.Bookmark[],
    bpm?: beatmap.bpm.BeatPerMinute | null
): void => {
    if (!htmlTableBookmarks) {
        console.error(logPrefix + 'missing table row for bookmarks');
        return;
    }
    if (arr == null || !arr.length) {
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
            elem._name !== '' ? elem._name : '**EMPTY NAME**'
        }`;
    });
    const content = bookmarkText.join('<br>');
    displayTableRow(htmlTableBookmarks, content);
};

// this implementation looks hideous but whatever
export const setEnvironmentEnhancement = (arr?: beatmap.chroma.ChromaEnvironment[]): void => {
    if (!htmlTableEnvironmentEnhancement) {
        console.error(logPrefix + 'missing table row for environment enhancement');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableEnvironmentEnhancement);
        return;
    }
    const envEnhance = arr.map((elem) => {
        let keyArr = [];
        for (const key in elem) {
            if (key == '_lookupMethod' || key == '_id') {
                continue;
            }
            let k =
                beatmap.chroma.ChromaDataEnvAbbr[
                    key as keyof typeof beatmap.chroma.ChromaDataEnvAbbr
                ];
            if (elem[key as keyof beatmap.chroma.ChromaEnvironment] != null) {
                keyArr.push(k);
            }
        }
        return `${elem._lookupMethod} [${keyArr.join('')}]${
            elem._track ? `(${elem._track})` : ''
        } -> ${elem._id}`;
    });
    const content = envEnhance.join('<br>');
    displayTableRow(htmlTableEnvironmentEnhancement, content);
};

export const setPointDefinitions = (arr?: beatmap.noodleExtensions.NEPointDefinition[]): void => {
    if (!htmlTablePointDefinitions) {
        console.error(logPrefix + 'missing table row for point definitions');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = arr.map((elem) => {
        return `${elem._name} -- ${elem._points.length} point${elem._points.length > 1 ? 's' : ''}`;
    });
    const content = pointDef.join('<br>');
    displayTableRow(htmlTablePointDefinitions, content);
};

export const setCustomEvents = (
    arr?: beatmap.noodleExtensions.NECustomEvent[],
    bpm?: beatmap.bpm.BeatPerMinute | null
): void => {
    if (!htmlTableCustomEvents) {
        console.error(logPrefix + 'missing table row for custom events');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableCustomEvents);
        return;
    }
    const customEv = arr.map((elem) => {
        let time = elem._time;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        let keyArr = [];
        for (const key in elem._data) {
            if (key == '_duration' || key == '_easing' || key == '_track') {
                continue;
            }
            let k =
                beatmap.noodleExtensions.NEDataAbbr[
                    key as keyof typeof beatmap.noodleExtensions.NEDataAbbr
                ];
            if (elem._data[key as keyof beatmap.noodleExtensions.NECustomEventData] != null) {
                keyArr.push(k);
            }
        }
        return `${elem._time}${rt ? ' | ' + toMMSS(rt) : ''} -- ${elem._type} -> [${keyArr.join(
            ''
        )}]${elem._data._track ? `(${elem._data._track})` : ''}`;
    });
    const content = customEv.join('<br>');
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

export const setDiffInfoTable = (mapData: beatmap.map.BeatmapSetData): void => {
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
        setEnvironmentEnhancement(mapData._data._customData._environment);
        setPointDefinitions(mapData._data._customData._pointDefinitions);
        setCustomEvents(mapData._data._customData._customEvents, bpm);
    }
};

function contributorsSelectHandler(ev: Event): void {
    if (!savedData._contributors) {
        console.error(logPrefix + 'no saved data for contributors');
        return;
    }
    const target = ev.target as HTMLSelectElement;
    setContributors(savedData._contributors[parseInt(target.value)]);
}

export const reset = (): void => {
    setLevelAuthor();
    setEnvironment();
    setEditors();
    populateContributors();
    setTimeSpend();
    setRequirements();
    setSuggestions();
    setInformation();
    setWarnings();
    setBookmarks();
    setEnvironmentEnhancement();
    setPointDefinitions();
    setCustomEvents();
};

// may god help you maintain these
import * as uiHeader from './header';
import * as beatmap from '../beatmap';
import * as colors from '../colors';
import * as uiPanel from './panel';
import { removeOptions, round, toMMSS, toHHMMSS } from '../utils';
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
const htmlInfoContributorsName = document.querySelector<HTMLElement>(
    '.info__contributors-name'
);
const htmlInfoContributorsRole = document.querySelector<HTMLElement>(
    '.info__contributors-role'
);

const htmlTableVersion = document.querySelector<HTMLElement>('.info__version');
const htmlTableTimeSpend = document.querySelector<HTMLElement>('.info__time-spend');
const htmlTableCustomColor = document.querySelector<HTMLElement>('.info__custom-color');
const htmlTableRequirements =
    document.querySelector<HTMLElement>('.info__requirements');
const htmlTableSuggestions = document.querySelector<HTMLElement>('.info__suggestions');
const htmlTableInformation = document.querySelector<HTMLElement>('.info__information');
const htmlTableWarnings = document.querySelector<HTMLElement>('.info__warnings');
const htmlTableBookmarks = document.querySelector<HTMLElement>('.info__bookmarks');
const htmlTableBPMChanges = document.querySelector<HTMLElement>('.info__bpm-changes');
const htmlTableEnvironmentEnhancement = document.querySelector<HTMLElement>(
    '.info__environment-enhancement'
);
const htmlTablePointDefinitions = document.querySelector<HTMLElement>(
    '.info__point-definitions'
);
const htmlTableCustomEvents =
    document.querySelector<HTMLElement>('.info__custom-events');

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
    !htmlTableVersion ||
    !htmlTableTimeSpend ||
    !htmlTableCustomColor ||
    !htmlTableRequirements ||
    !htmlTableSuggestions ||
    !htmlTableInformation ||
    !htmlTableWarnings ||
    !htmlTableBookmarks ||
    !htmlTableBPMChanges ||
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
    htmlInfoContributorsImage.src = src || './img/unknown.jpg';
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

const displayTableRow = <T extends HTMLElement>(
    elem: T,
    content: string | string[] | HTMLElement[]
): void => {
    const tableElem = elem.querySelector('.info__table-element');
    if (tableElem) {
        while (tableElem.firstChild) {
            tableElem.removeChild(tableElem.firstChild);
        }
        if (typeof content === 'string') {
            tableElem.textContent = content;
        } else {
            content.forEach((c: string | HTMLElement) => {
                if (typeof c === 'string') {
                    let temp = document.createElement('span');
                    temp.textContent = c;
                    tableElem.appendChild(temp);
                    tableElem.appendChild(document.createElement('br'));
                } else {
                    tableElem.appendChild(c);
                    tableElem.appendChild(document.createElement('br'));
                }
            });
            if (tableElem.lastChild) {
                tableElem.removeChild(tableElem.lastChild);
            }
        }
    }
    elem.classList.remove('hidden');
};

export const setVersion = (ver?: string): void => {
    if (!htmlTableVersion) {
        console.error(logPrefix + 'missing table row for time spend');
        return;
    }
    if (ver == null) {
        hideTableRow(htmlTableVersion);
        return;
    }
    displayTableRow(htmlTableVersion, ver);
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
    displayTableRow(htmlTableTimeSpend, toHHMMSS(num));
};

export const setCustomColor = (
    customColor?: beatmap.environment.ColorScheme,
    environment?: beatmap.environment.EnvironmentName
): void => {
    if (!htmlTableCustomColor) {
        console.error(logPrefix + 'missing table row for custom colors');
        return;
    }
    if (
        !customColor ||
        (!customColor._colorLeft &&
            !customColor._colorRight &&
            !customColor._envColorLeft &&
            !customColor._envColorLeftBoost &&
            !customColor._envColorRight &&
            !customColor._envColorRightBoost &&
            !customColor._obstacleColor)
    ) {
        hideTableRow(htmlTableCustomColor);
        return;
    }
    if (!environment) {
        environment = 'DefaultEnvironment';
    }
    let hexColor: { [key: string]: string | null } = {
        _colorLeft:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._colorLeft
            ) || null,
        _colorRight:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._colorRight
            ) || null,
        _envColorLeft:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorLeft
            ) || null,
        _envColorRight:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorRight
            ) || null,
        _envColorLeftBoost:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorLeftBoost
            ) || null,
        _envColorRightBoost:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorRightBoost
            ) || null,
        _obstacleColor:
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._obstacleColor
            ) || null,
    };
    if (customColor._colorLeft) {
        hexColor._colorLeft = colors.rgbaToHex(customColor._colorLeft);
    }
    if (customColor._colorRight) {
        hexColor._colorRight = colors.rgbaToHex(customColor._colorRight);
    }
    if (customColor._envColorLeft) {
        hexColor._envColorLeft = colors.rgbaToHex(customColor._envColorLeft);
    } else if (customColor._colorLeft) {
        hexColor._envColorLeft = colors.rgbaToHex(customColor._colorLeft);
    }
    if (customColor._envColorRight) {
        hexColor._envColorRight = colors.rgbaToHex(customColor._envColorRight);
    } else if (customColor._colorRight) {
        hexColor._envColorRight = colors.rgbaToHex(customColor._colorRight);
    }

    // tricky stuff
    // need to display both boost if one exist
    let envBL!: string | null,
        envBR!: string | null,
        envBoost = false;
    if (customColor._envColorLeftBoost) {
        envBL = colors.rgbaToHex(customColor._envColorLeftBoost);
        envBoost = true;
    } else {
        envBL =
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorLeftBoost
            ) || hexColor._envColorLeft;
    }
    if (customColor._envColorRightBoost) {
        envBR = colors.rgbaToHex(customColor._envColorRightBoost);
        envBoost = true;
    } else {
        envBR =
            colors.rgbaToHex(
                beatmap.environment.colorScheme[
                    beatmap.environment.EnvironmentColor[environment]
                ]?._envColorRightBoost
            ) || hexColor._envColorRight;
    }

    if (envBoost) {
        hexColor._envColorLeftBoost = envBL;
        hexColor._envColorRightBoost = envBR;
    }

    if (customColor._obstacleColor) {
        hexColor._obstacleColor = colors.rgbaToHex(customColor._obstacleColor);
    }

    const panel = uiPanel.create('max', 'none', true);
    for (const key in hexColor) {
        if (!hexColor[key]) {
            continue;
        }
        const container = document.createElement('div');
        const colorContainer = document.createElement('div');
        const textMonoContainer = document.createElement('div');
        const textContainer = document.createElement('div');

        colorContainer.className = 'info__color-dot';
        colorContainer.style.backgroundColor = hexColor[key] || '#000000';

        textMonoContainer.className = 'info__color-text info__color-text--monospace';
        textMonoContainer.textContent = `${hexColor[key]}`;

        textContainer.className = 'info__color-text';
        textContainer.textContent = ` -- ${
            beatmap.environment.ColorSchemeRename[
                key as keyof typeof beatmap.environment.ColorSchemeRename
            ]
        }`;

        container.appendChild(colorContainer);
        container.appendChild(textMonoContainer);
        container.appendChild(textContainer);

        panel.appendChild(container);
    }
    const content: HTMLElement[] = [panel];
    displayTableRow(htmlTableCustomColor, content);
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
    displayTableRow(htmlTableRequirements, arr.join(', '));
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
    displayTableRow(htmlTableSuggestions, arr.join(', '));
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
    displayTableRow(htmlTableInformation, arr);
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
    displayTableRow(htmlTableWarnings, arr);
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
        return `${round(elem._time, 3)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem._name !== '' ? elem._name : '**EMPTY NAME**'
        }`;
    });
    displayTableRow(htmlTableBookmarks, bookmarkText);
};

export const setBPMChanges = (bpm?: beatmap.bpm.BeatPerMinute | null): void => {
    if (!htmlTableBPMChanges) {
        console.error(logPrefix + 'missing table row for bookmarks');
        return;
    }
    if (!bpm || !bpm.change.length) {
        hideTableRow(htmlTableBPMChanges);
        return;
    }
    const bpmcText = bpm.change.map((bpmc) => {
        let time = round(bpmc._newTime, 3);
        let rt = bpm.toRealTime(bpmc._time);
        return `${time} | ${toMMSS(rt)} -- ${bpmc._BPM}`;
    });
    displayTableRow(htmlTableBPMChanges, bpmcText);
};

// this implementation looks hideous but whatever
export const setEnvironmentEnhancement = (
    arr?: beatmap.chroma.ChromaEnvironment[]
): void => {
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
    displayTableRow(htmlTableEnvironmentEnhancement, envEnhance);
};

export const setPointDefinitions = (arr?: beatmap.heck.HeckPointDefinition[]): void => {
    if (!htmlTablePointDefinitions) {
        console.error(logPrefix + 'missing table row for point definitions');
        return;
    }
    if (arr == null || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = arr.map((elem) => {
        return `${elem._name} -- ${elem._points.length} point${
            elem._points.length > 1 ? 's' : ''
        }`;
    });
    displayTableRow(htmlTablePointDefinitions, pointDef);
};

export const setCustomEvents = (
    arr?: beatmap.customData.CustomEvent[],
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
            //@ts-ignore shut up i dont care
            if (elem._data[key] != null) {
                keyArr.push(key);
            }
        }
        return `${round(elem._time, 3)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem._type
        } -> [${keyArr.join('')}]${
            elem._type !== 'AssignTrackParent' ? `(${elem._data._track})` : ''
        }`;
    });
    displayTableRow(htmlTableCustomEvents, customEv);
};

export const setInfo = (mapInfo: beatmap.info.InfoData): void => {
    uiHeader.setSongName(mapInfo._songName);
    uiHeader.setSongSubname(mapInfo._songSubName);
    uiHeader.setSongAuthor(mapInfo._songAuthorName);
    uiHeader.setSongBPM(mapInfo._beatsPerMinute);
    setLevelAuthor(mapInfo._levelAuthorName);
    setEnvironment(mapInfo._environmentName);
    setEditors(mapInfo._customData?._editors);
};

export const setDiffInfoTable = (mapData: beatmap.map.BeatmapSetData): void => {
    setVersion(mapData._data._version);
    if (mapData._info?._customData) {
        setCustomColor(mapData._info._customData);
        setRequirements(mapData._info._customData._requirements);
        setSuggestions(mapData._info._customData._suggestions);
        setInformation(mapData._info._customData._information);
        setWarnings(mapData._info._customData._warnings);
    }
    if (mapData._data?._customData) {
        const bpm = savedData._mapInfo?._beatsPerMinute
            ? beatmap.bpm.create(
                  savedData._mapInfo._beatsPerMinute,
                  mapData._data._customData._bpmChanges ||
                      mapData._data._customData._BPMChanges
              )
            : null;
        setTimeSpend(mapData._data._customData._time);
        setBookmarks(mapData._data._customData._bookmarks, bpm);
        setBPMChanges(bpm);
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
    setVersion();
    setTimeSpend();
    setCustomColor();
    setRequirements();
    setSuggestions();
    setInformation();
    setWarnings();
    setBookmarks();
    setBPMChanges();
    setEnvironmentEnhancement();
    setPointDefinitions();
    setCustomEvents();
};

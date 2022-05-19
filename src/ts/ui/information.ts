// may god help you maintain these
import UIHeader from './header';
import UIPanel from './panel';
import SavedData from '../savedData';
import { removeOptions, round, toMMSS, toHHMMSS, rgbaToHex } from '../utils';
import { IColorScheme, EnvironmentName, IInfoData } from '../types';
import { IContributorB64, IBeatmapItem } from '../types/mapcheck';
import {
    BeatPerMinute,
    ColorScheme,
    ColorSchemeRename,
    EnvironmentRename,
    EnvironmentSchemeName,
} from '../beatmap';
import { IBookmark, IEditor, IEditorInfo } from '../types/beatmap/shared';
import { ChromaDataEnvAbbr, IChromaEnvironment } from '../types/beatmap/v3/chroma';
import { IHeckPointDefinition } from '../types/beatmap/v3/heck';
import { ICustomEvent } from '../types/beatmap/v3/customEvent';

const logPrefix = 'UI Info: ';

const htmlInfoLevelAuthor: HTMLElement = document.querySelector('.info__level-author')!;
const htmlInfoEnvironment: HTMLElement = document.querySelector('.info__environment')!;
const htmlInfoEditors: HTMLElement = document.querySelector('.info__editors')!;
const htmlInfoContributors: HTMLElement =
    document.querySelector('.info__contributors')!;
const htmlInfoContributorsSelect: HTMLSelectElement = document.querySelector(
    '.info__contributors-select'
)!;
const htmlInfoContributorsImage: HTMLImageElement = document.querySelector(
    '.info__contributors-image'
)!;
const htmlInfoContributorsName: HTMLElement = document.querySelector(
    '.info__contributors-name'
)!;
const htmlInfoContributorsRole: HTMLElement = document.querySelector(
    '.info__contributors-role'
)!;

const htmlTableVersion: HTMLElement = document.querySelector('.info__version')!;
const htmlTableTimeSpend: HTMLElement = document.querySelector('.info__time-spend')!;
const htmlTableCustomColor: HTMLElement =
    document.querySelector('.info__custom-color')!;
const htmlTableRequirements: HTMLElement =
    document.querySelector('.info__requirements')!;
const htmlTableSuggestions: HTMLElement = document.querySelector('.info__suggestions')!;
const htmlTableInformation: HTMLElement = document.querySelector('.info__information')!;
const htmlTableWarnings: HTMLElement = document.querySelector('.info__warnings')!;
const htmlTableBookmarks: HTMLElement = document.querySelector('.info__bookmarks')!;
const htmlTableBPMChanges: HTMLElement = document.querySelector('.info__bpm-changes')!;
const htmlTableEnvironmentEnhancement: HTMLElement = document.querySelector(
    '.info__environment-enhancement'
)!;
const htmlTablePointDefinitions: HTMLElement = document.querySelector(
    '.info__point-definitions'
)!;
const htmlTableCustomEvents: HTMLElement =
    document.querySelector('.info__custom-events')!;

if (!htmlInfoLevelAuthor || !htmlInfoEnvironment || !htmlInfoEditors) {
    throw new Error(logPrefix + 'info component is missing part');
}
if (!htmlInfoContributors || !htmlInfoContributorsName || !htmlInfoContributorsRole) {
    throw new Error(logPrefix + 'contributors component is missing part');
}
if (htmlInfoContributorsSelect) {
    htmlInfoContributorsSelect.addEventListener('change', contributorsSelectHandler);
} else {
    throw new Error(logPrefix + 'contributors select is missing');
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
    throw new Error(logPrefix + 'table info component is missing part');
}

const setLevelAuthor = (str?: string): void => {
    if (!str) {
        htmlInfoLevelAuthor.textContent = '';
        return;
    }
    htmlInfoLevelAuthor.textContent = 'Mapped by ' + str;
};

const setEnvironment = (str?: EnvironmentName): void => {
    if (!str) {
        htmlInfoEnvironment.textContent = '';
        return;
    }
    htmlInfoEnvironment.textContent =
        (EnvironmentRename[str] || 'Unknown') + ' Environment';
};

const setEditors = (obj?: IEditor): void => {
    if (!obj || !obj._lastEditedBy) {
        htmlInfoEditors.classList.add('hidden');
        return;
    }
    htmlInfoEditors.classList.remove('hidden');
    const lastEdited = obj._lastEditedBy || 'Undefined';
    let text = 'Last edited on ' + lastEdited;
    if (obj[lastEdited]) {
        const mapper = obj[lastEdited] as IEditorInfo;
        text += ' v' + mapper.version;
    }
    htmlInfoEditors.textContent = text;
};

const setContributorsImage = (src: string | null): void => {
    htmlInfoContributorsImage.src = src || './img/unknown.jpg';
};

const setContributorsName = (str: string): void => {
    htmlInfoContributorsName.textContent = str;
};

const setContributorsRole = (str: string): void => {
    htmlInfoContributorsRole.textContent = str;
};

const setContributors = (obj: IContributorB64): void => {
    setContributorsImage(obj._base64 ? 'data:image;base64,' + obj._base64 : null);
    setContributorsName(obj._name);
    setContributorsRole(obj._role);
};

const populateContributors = (arr?: IContributorB64[]): void => {
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

const setVersion = (ver?: string): void => {
    if (ver == null) {
        hideTableRow(htmlTableVersion);
        return;
    }
    displayTableRow(htmlTableVersion, ver);
};

const setTimeSpend = (num?: number): void => {
    if (num == null) {
        hideTableRow(htmlTableTimeSpend);
        return;
    }
    displayTableRow(htmlTableTimeSpend, toHHMMSS(num));
};

const setCustomColor = (
    customColor?: IColorScheme,
    environment?: EnvironmentName
): void => {
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
            rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._colorLeft) ||
            null,
        _colorRight:
            rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._colorRight) ||
            null,
        _envColorLeft:
            rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeft) ||
            null,
        _envColorRight:
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._envColorRight
            ) || null,
        _envColorLeftBoost:
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeftBoost
            ) || null,
        _envColorRightBoost:
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._envColorRightBoost
            ) || null,
        _obstacleColor:
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._obstacleColor
            ) || null,
    };
    if (customColor._colorLeft) {
        hexColor._colorLeft = rgbaToHex(customColor._colorLeft);
    }
    if (customColor._colorRight) {
        hexColor._colorRight = rgbaToHex(customColor._colorRight);
    }
    if (customColor._envColorLeft) {
        hexColor._envColorLeft = rgbaToHex(customColor._envColorLeft);
    } else if (customColor._colorLeft) {
        hexColor._envColorLeft = rgbaToHex(customColor._colorLeft);
    }
    if (customColor._envColorRight) {
        hexColor._envColorRight = rgbaToHex(customColor._envColorRight);
    } else if (customColor._colorRight) {
        hexColor._envColorRight = rgbaToHex(customColor._colorRight);
    }

    // tricky stuff
    // need to display both boost if one exist
    let envBL!: string | null,
        envBR!: string | null,
        envBoost = false;
    if (customColor._envColorLeftBoost) {
        envBL = rgbaToHex(customColor._envColorLeftBoost);
        envBoost = true;
    } else {
        envBL =
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeftBoost
            ) || hexColor._envColorLeft;
    }
    if (customColor._envColorRightBoost) {
        envBR = rgbaToHex(customColor._envColorRightBoost);
        envBoost = true;
    } else {
        envBR =
            rgbaToHex(
                ColorScheme[EnvironmentSchemeName[environment]]?._envColorRightBoost
            ) || hexColor._envColorRight;
    }

    if (envBoost) {
        hexColor._envColorLeftBoost = envBL;
        hexColor._envColorRightBoost = envBR;
    }

    if (customColor._obstacleColor) {
        hexColor._obstacleColor = rgbaToHex(customColor._obstacleColor);
    }

    const panel = UIPanel.create('max', 'none', true);
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
            ColorSchemeRename[key as keyof typeof ColorSchemeRename]
        }`;

        container.appendChild(colorContainer);
        container.appendChild(textMonoContainer);
        container.appendChild(textContainer);

        panel.appendChild(container);
    }
    const content: HTMLElement[] = [panel];
    displayTableRow(htmlTableCustomColor, content);
};

const setRequirements = (arr?: string[]): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableRequirements);
        return;
    }
    displayTableRow(htmlTableRequirements, arr.join(', '));
};

const setSuggestions = (arr?: string[]): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableSuggestions);
        return;
    }
    displayTableRow(htmlTableSuggestions, arr.join(', '));
};

const setInformation = (arr?: string[]): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableInformation);
        return;
    }
    displayTableRow(htmlTableInformation, arr);
};

const setWarnings = (arr?: string[]): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableWarnings);
        return;
    }
    displayTableRow(htmlTableWarnings, arr);
};

const setBookmarks = (arr?: IBookmark[], bpm?: BeatPerMinute | null): void => {
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
            elem._name != '' ? elem._name : '**EMPTY NAME**'
        }`;
    });
    displayTableRow(htmlTableBookmarks, bookmarkText);
};

const setBPMChanges = (bpm?: BeatPerMinute | null): void => {
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
const setEnvironmentEnhancement = (arr?: IChromaEnvironment[]): void => {
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
            let k = ChromaDataEnvAbbr[key as keyof typeof ChromaDataEnvAbbr];
            if (elem[key as keyof IChromaEnvironment] != null) {
                keyArr.push(k);
            }
        }
        return `${elem.lookupMethod} [${keyArr.join('')}]${
            elem.track ? `(${elem.track})` : ''
        } -> ${elem.id}`;
    });
    displayTableRow(htmlTableEnvironmentEnhancement, envEnhance);
};

const setPointDefinitions = (arr?: IHeckPointDefinition[]): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTablePointDefinitions);
        return;
    }
    const pointDef = arr.map((elem) => {
        return `${elem.name} -- ${elem.points.length} point${
            elem.points.length > 1 ? 's' : ''
        }`;
    });
    displayTableRow(htmlTablePointDefinitions, pointDef);
};

const setCustomEvents = (arr?: ICustomEvent[], bpm?: BeatPerMinute | null): void => {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableCustomEvents);
        return;
    }
    const customEv = arr.map((elem) => {
        let time = elem.b;
        let rt!: number;
        if (bpm) {
            time = bpm.adjustTime(time);
            rt = bpm.toRealTime(time);
        }
        let keyArr = [];
        for (const key in elem.d) {
            if (key == '_duration' || key == '_easing' || key == '_track') {
                continue;
            }
            //@ts-ignore shut up i dont care
            if (elem.d[key] != null) {
                keyArr.push(key);
            }
        }
        return `${round(elem.b, 3)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
            elem.t
        } -> [${keyArr.join('')}]${
            elem.t !== 'AssignTrackParent' ? `(${elem.d.track})` : ''
        }`;
    });
    displayTableRow(htmlTableCustomEvents, customEv);
};

const setInfo = (mapInfo: IInfoData): void => {
    UIHeader.setSongName(mapInfo._songName);
    UIHeader.setSongSubname(mapInfo._songSubName);
    UIHeader.setSongAuthor(mapInfo._songAuthorName);
    UIHeader.setSongBPM(mapInfo._beatsPerMinute);
    setLevelAuthor(mapInfo._levelAuthorName);
    setEnvironment(mapInfo._environmentName);
    setEditors(mapInfo._customData?._editors);
};

const setDiffInfoTable = (mapData: IBeatmapItem): void => {
    if (mapData.rawVersion === 2) {
        setVersion(mapData.rawData._version);
    }
    if (mapData.rawVersion === 3) {
        setVersion(mapData.rawData.version);
    }
    if (mapData.info?._customData) {
        setCustomColor(mapData.info._customData);
        setRequirements(mapData.info._customData._requirements);
        setSuggestions(mapData.info._customData._suggestions);
        setInformation(mapData.info._customData._information);
        setWarnings(mapData.info._customData._warnings);
    }
    if (mapData.data?.customData) {
        const bpm = SavedData.beatmapInfo?._beatsPerMinute
            ? BeatPerMinute.create(
                  SavedData.beatmapInfo._beatsPerMinute,
                  mapData.data.customData._bpmChanges ||
                      mapData.data.customData._BPMChanges ||
                      mapData.data.customData.BPMChanges
              )
            : null;
        setTimeSpend(mapData.data.customData._time ?? mapData.data.customData.time);
        setBookmarks(
            mapData.data.customData._bookmarks ?? mapData.data.customData.bookmarks,
            bpm
        );
        setBPMChanges(bpm);
        setEnvironmentEnhancement(mapData.data.customData.environment);
        setPointDefinitions(
            mapData.data.customData._pointDefinitions ??
                mapData.data.customData.pointDefinitions
        );
        setCustomEvents(
            mapData.data.customData._customEvents ??
                mapData.data.customData.customEvents,
            bpm
        );
    }
};

function contributorsSelectHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    setContributors(SavedData.contributors[parseInt(target.value)]);
}

const reset = (): void => {
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

export default {
    setLevelAuthor,
    setEnvironment,
    setEditors,
    setContributors,
    populateContributors,
    setVersion,
    setTimeSpend,
    setCustomColor,
    setRequirements,
    setSuggestions,
    setInformation,
    setWarnings,
    setBookmarks,
    setBPMChanges,
    setEnvironmentEnhancement,
    setPointDefinitions,
    setCustomEvents,
    setInfo,
    setDiffInfoTable,
    reset,
};

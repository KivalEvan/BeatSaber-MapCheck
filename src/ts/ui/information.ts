// may god help you maintain these
import UIHeader from './header';
import UIPanel from './panel';
import SavedData from '../savedData';
import { removeOptions, round, toMMSS, toHHMMSS, rgbaToHex } from '../utils';
import { IColorScheme, EnvironmentName, IInfoData } from '../types';
import { IContributorB64, IBeatmapItem } from '../types/mapcheck';
import { IEditor, IEditorInfo } from '../types/beatmap/shared/editor';
import {
    BeatPerMinute,
    ColorScheme,
    ColorSchemeRename,
    EnvironmentRename,
    EnvironmentSchemeName,
} from '../beatmap';
import { ChromaDataEnvAbbr, IChromaEnvironment } from '../types/beatmap/v2/chroma';
import { IHeckPointDefinition, ICustomEvent } from '../types/beatmap/v2';
import { IBookmark } from '../types/beatmap/v3/bookmark';

const logPrefix = 'UI Info: ';

export default new (class UIInformation {
    private htmlInfoLevelAuthor: HTMLElement;
    private htmlInfoEnvironment: HTMLElement;
    private htmlInfoEditors: HTMLElement;
    private htmlInfoContributors: HTMLElement;
    private htmlInfoContributorsSelect: HTMLSelectElement;
    private htmlInfoContributorsImage: HTMLImageElement;
    private htmlInfoContributorsName: HTMLElement;
    private htmlInfoContributorsRole: HTMLElement;

    private htmlTableVersion: HTMLElement;
    private htmlTableTimeSpend: HTMLElement;
    private htmlTableCustomColor: HTMLElement;
    private htmlTableRequirements: HTMLElement;
    private htmlTableSuggestions: HTMLElement;
    private htmlTableInformation: HTMLElement;
    private htmlTableWarnings: HTMLElement;
    private htmlTableBookmarks: HTMLElement;
    private htmlTableBPMChanges: HTMLElement;
    private htmlTableEnvironmentEnhancement: HTMLElement;
    private htmlTablePointDefinitions: HTMLElement;
    private htmlTableCustomEvents: HTMLElement;

    constructor() {
        this.htmlInfoLevelAuthor = document.querySelector('.info__level-author')!;
        this.htmlInfoEnvironment = document.querySelector('.info__environment')!;
        this.htmlInfoEditors = document.querySelector('.info__editors')!;
        this.htmlInfoContributors = document.querySelector('.info__contributors')!;
        this.htmlInfoContributorsSelect = document.querySelector(
            '.info__contributors-select'
        )!;
        this.htmlInfoContributorsImage = document.querySelector(
            '.info__contributors-image'
        )!;
        this.htmlInfoContributorsName = document.querySelector(
            '.info__contributors-name'
        )!;
        this.htmlInfoContributorsRole = document.querySelector(
            '.info__contributors-role'
        )!;

        this.htmlTableVersion = document.querySelector('.info__version')!;
        this.htmlTableTimeSpend = document.querySelector('.info__time-spend')!;
        this.htmlTableCustomColor = document.querySelector('.info__custom-color')!;
        this.htmlTableRequirements = document.querySelector('.info__requirements')!;
        this.htmlTableSuggestions = document.querySelector('.info__suggestions')!;
        this.htmlTableInformation = document.querySelector('.info__information')!;
        this.htmlTableWarnings = document.querySelector('.info__warnings')!;
        this.htmlTableBookmarks = document.querySelector('.info__bookmarks')!;
        this.htmlTableBPMChanges = document.querySelector('.info__bpm-changes')!;
        this.htmlTableEnvironmentEnhancement = document.querySelector(
            '.info__environment-enhancement'
        )!;
        this.htmlTablePointDefinitions = document.querySelector(
            '.info__point-definitions'
        )!;
        this.htmlTableCustomEvents = document.querySelector('.info__custom-events')!;

        if (
            !this.htmlInfoLevelAuthor ||
            !this.htmlInfoEnvironment ||
            !this.htmlInfoEditors
        ) {
            throw new Error(logPrefix + 'info component is missing part');
        }
        if (
            !this.htmlInfoContributors ||
            !this.htmlInfoContributorsName ||
            !this.htmlInfoContributorsRole
        ) {
            throw new Error(logPrefix + 'contributors component is missing part');
        }
        if (this.htmlInfoContributorsSelect) {
            this.htmlInfoContributorsSelect.addEventListener(
                'change',
                this.contributorsSelectHandler
            );
        } else {
            throw new Error(logPrefix + 'contributors select is missing');
        }
        if (
            !this.htmlTableVersion ||
            !this.htmlTableTimeSpend ||
            !this.htmlTableCustomColor ||
            !this.htmlTableRequirements ||
            !this.htmlTableSuggestions ||
            !this.htmlTableInformation ||
            !this.htmlTableWarnings ||
            !this.htmlTableBookmarks ||
            !this.htmlTableBPMChanges ||
            !this.htmlTableEnvironmentEnhancement ||
            !this.htmlTablePointDefinitions ||
            !this.htmlTableCustomEvents
        ) {
            throw new Error(logPrefix + 'table info component is missing part');
        }
    }

    setLevelAuthor = (str?: string): void => {
        if (!str) {
            this.htmlInfoLevelAuthor.textContent = '';
            return;
        }
        this.htmlInfoLevelAuthor.textContent = 'Mapped by ' + str;
    };

    setEnvironment = (str?: EnvironmentName): void => {
        if (!str) {
            this.htmlInfoEnvironment.textContent = '';
            return;
        }
        this.htmlInfoEnvironment.textContent =
            (EnvironmentRename[str] || 'Unknown') + ' Environment';
    };

    setEditors = (obj?: IEditor): void => {
        if (!obj || !obj._lastEditedBy) {
            this.htmlInfoEditors.classList.add('hidden');
            return;
        }
        this.htmlInfoEditors.classList.remove('hidden');
        const lastEdited = obj._lastEditedBy || 'Undefined';
        let text = 'Last edited on ' + lastEdited;
        if (obj[lastEdited]) {
            const mapper = obj[lastEdited] as IEditorInfo;
            text += ' v' + mapper.version;
        }
        this.htmlInfoEditors.textContent = text;
    };

    private setContributorsImage = (src: string | null): void => {
        this.htmlInfoContributorsImage.src = src || './img/unknown.jpg';
    };

    private setContributorsName = (str: string): void => {
        this.htmlInfoContributorsName.textContent = str;
    };

    private setContributorsRole = (str: string): void => {
        this.htmlInfoContributorsRole.textContent = str;
    };

    setContributors = (obj: IContributorB64): void => {
        this.setContributorsImage(
            obj._base64 ? 'data:image;base64,' + obj._base64 : null
        );
        this.setContributorsName(obj._name);
        this.setContributorsRole(obj._role);
    };

    populateContributors = (arr?: IContributorB64[]): void => {
        if (this.htmlInfoContributors && (!arr || !arr.length)) {
            this.htmlInfoContributors.classList.add('hidden');
            removeOptions(this.htmlInfoContributorsSelect);
            return;
        }
        if (arr) {
            this.htmlInfoContributors.classList.remove('hidden');
            let first = true;
            arr.forEach((el, index) => {
                if (first) {
                    first = false;
                    this.setContributors(el);
                }
                const optCont = document.createElement('option');
                optCont.value = index.toString();
                optCont.text = el._name + ' -- ' + el._role;
                this.htmlInfoContributorsSelect.add(optCont);
            });
        }
    };

    private hideTableRow = <T extends HTMLElement>(elem: T): void => {
        const tableElem = elem.querySelector('.info__table-element');
        if (tableElem) {
            tableElem.innerHTML = '';
        }
        elem.classList.add('hidden');
    };

    private displayTableRow = <T extends HTMLElement>(
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

    setVersion = (ver?: string): void => {
        if (ver == null) {
            this.hideTableRow(this.htmlTableVersion);
            return;
        }
        this.displayTableRow(this.htmlTableVersion, ver);
    };

    setTimeSpend = (num?: number): void => {
        if (num == null) {
            this.hideTableRow(this.htmlTableTimeSpend);
            return;
        }
        this.displayTableRow(this.htmlTableTimeSpend, toHHMMSS(num));
    };

    setCustomColor = (
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
            this.hideTableRow(this.htmlTableCustomColor);
            return;
        }
        if (!environment) {
            environment = 'DefaultEnvironment';
        }
        let hexColor: { [key: string]: string | null } = {
            _colorLeft:
                rgbaToHex(
                    ColorScheme[EnvironmentSchemeName[environment]]?._colorLeft
                ) || null,
            _colorRight:
                rgbaToHex(
                    ColorScheme[EnvironmentSchemeName[environment]]?._colorRight
                ) || null,
            _envColorLeft:
                rgbaToHex(
                    ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeft
                ) || null,
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

            textMonoContainer.className =
                'info__color-text info__color-text--monospace';
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
        this.displayTableRow(this.htmlTableCustomColor, content);
    };

    setRequirements = (arr?: string[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableRequirements);
            return;
        }
        this.displayTableRow(this.htmlTableRequirements, arr.join(', '));
    };

    setSuggestions = (arr?: string[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableSuggestions);
            return;
        }
        this.displayTableRow(this.htmlTableSuggestions, arr.join(', '));
    };

    setInformation = (arr?: string[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableInformation);
            return;
        }
        this.displayTableRow(this.htmlTableInformation, arr);
    };

    setWarnings = (arr?: string[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableWarnings);
            return;
        }
        this.displayTableRow(this.htmlTableWarnings, arr);
    };

    setBookmarks = (arr?: IBookmark[], bpm?: BeatPerMinute | null): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableBookmarks);
            return;
        }
        const bookmarkText = arr.map((elem) => {
            let time = elem.b;
            let rt!: number;
            if (bpm) {
                time = bpm.adjustTime(time);
                rt = bpm.toRealTime(time);
            }
            return `${round(elem.b, 3)}${rt ? ' | ' + toMMSS(rt) : ''} -- ${
                elem.n !== '' ? elem.b : '**EMPTY NAME**'
            }`;
        });
        this.displayTableRow(this.htmlTableBookmarks, bookmarkText);
    };

    setBPMChanges = (bpm?: BeatPerMinute | null): void => {
        if (!bpm || !bpm.change.length) {
            this.hideTableRow(this.htmlTableBPMChanges);
            return;
        }
        const bpmcText = bpm.change.map((bpmc) => {
            let time = round(bpmc._newTime, 3);
            let rt = bpm.toRealTime(bpmc._time);
            return `${time} | ${toMMSS(rt)} -- ${bpmc._BPM}`;
        });
        this.displayTableRow(this.htmlTableBPMChanges, bpmcText);
    };

    // this implementation looks hideous but whatever
    setEnvironmentEnhancement = (arr?: IChromaEnvironment[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableEnvironmentEnhancement);
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
            return `${elem._lookupMethod} [${keyArr.join('')}]${
                elem._track ? `(${elem._track})` : ''
            } -> ${elem._id}`;
        });
        this.displayTableRow(this.htmlTableEnvironmentEnhancement, envEnhance);
    };

    setPointDefinitions = (arr?: IHeckPointDefinition[]): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTablePointDefinitions);
            return;
        }
        const pointDef = arr.map((elem) => {
            return `${elem._name} -- ${elem._points.length} point${
                elem._points.length > 1 ? 's' : ''
            }`;
        });
        this.displayTableRow(this.htmlTablePointDefinitions, pointDef);
    };

    setCustomEvents = (arr?: ICustomEvent[], bpm?: BeatPerMinute | null): void => {
        if (arr == null || !arr.length) {
            this.hideTableRow(this.htmlTableCustomEvents);
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
        this.displayTableRow(this.htmlTableCustomEvents, customEv);
    };

    setInfo = (mapInfo: IInfoData): void => {
        UIHeader.setSongName(mapInfo._songName);
        UIHeader.setSongSubname(mapInfo._songSubName);
        UIHeader.setSongAuthor(mapInfo._songAuthorName);
        UIHeader.setSongBPM(mapInfo._beatsPerMinute);
        this.setLevelAuthor(mapInfo._levelAuthorName);
        this.setEnvironment(mapInfo._environmentName);
        this.setEditors(mapInfo._customData?._editors);
    };

    setDiffInfoTable = (mapData: IBeatmapItem): void => {
        this.setVersion(mapData.data.version);
        if (mapData.info?._customData) {
            this.setCustomColor(mapData.info._customData);
            this.setRequirements(mapData.info._customData._requirements);
            this.setSuggestions(mapData.info._customData._suggestions);
            this.setInformation(mapData.info._customData._information);
            this.setWarnings(mapData.info._customData._warnings);
        }
        if (mapData.data?.customData) {
            const bpm = SavedData.beatmapInfo?._beatsPerMinute
                ? BeatPerMinute.create(
                      SavedData.beatmapInfo._beatsPerMinute,
                      mapData.data.customData._bpmChanges ||
                          mapData.data.customData._BPMChanges
                  )
                : null;
            this.setTimeSpend(mapData.data.customData._time);
            this.setBookmarks(mapData.data.customData._bookmarks, bpm);
            this.setBPMChanges(bpm);
            this.setEnvironmentEnhancement(mapData.data.customData._environment);
            this.setPointDefinitions(mapData.data.customData._pointDefinitions);
            this.setCustomEvents(mapData.data.customData._customEvents, bpm);
        }
    };

    private contributorsSelectHandler = (ev: Event): void => {
        const target = ev.target as HTMLSelectElement;
        this.setContributors(SavedData.contributors[parseInt(target.value)]);
    };

    reset = (): void => {
        this.setLevelAuthor();
        this.setEnvironment();
        this.setEditors();
        this.populateContributors();
        this.setVersion();
        this.setTimeSpend();
        this.setCustomColor();
        this.setRequirements();
        this.setSuggestions();
        this.setInformation();
        this.setWarnings();
        this.setBookmarks();
        this.setBPMChanges();
        this.setEnvironmentEnhancement();
        this.setPointDefinitions();
        this.setCustomEvents();
    };
})();

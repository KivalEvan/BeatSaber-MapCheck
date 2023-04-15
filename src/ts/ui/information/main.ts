import UIHeader from '../header';
import SavedData from '../../savedData';
import { IInfo } from '../../types/beatmap/shared/info';
import { IBeatmapItem } from '../../types/mapcheck';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import {
    setLevelAuthor,
    setEnvironment,
    setEditors,
    populateContributors,
    setContributors,
} from './info';
import { setBookmarks } from './bookmark';
import { setBPMChanges } from './bpmChange';
import { setCustomColor } from './customColor';
import { setCustomEvents } from './customEvent';
import { setEnvironmentEnhancement } from './environment';
import {
    setVersion,
    setRequirements,
    setSuggestions,
    setInformation,
    setWarnings,
    setTimeSpend,
} from './misc';
import { setPointDefinitions } from './pointDefinition';
import { setTableHeight } from './helpers';
import { setPlayTime } from './playTime';

function setInfo(mapInfo: IInfo): void {
    UIHeader.setSongName(mapInfo._songName);
    UIHeader.setSongSubname(mapInfo._songSubName);
    UIHeader.setSongAuthor(mapInfo._songAuthorName);
    UIHeader.setSongBPM(mapInfo._beatsPerMinute);
    setLevelAuthor(mapInfo._levelAuthorName);
    setEnvironment(mapInfo._environmentName);
    setEditors(mapInfo._customData?._editors);
}

function setDiffInfoTable(mapData: IBeatmapItem): void {
    if (mapData.rawVersion === 2) {
        setVersion(mapData.rawData._version);
    }
    if (mapData.rawVersion === 3) {
        setVersion(mapData.rawData.version);
    }
    if (mapData.info?._customData) {
        setCustomColor(mapData.info._customData);
        setRequirements(mapData.info._customData._requirements as string[]);
        setSuggestions(mapData.info._customData._suggestions as string[]);
        setInformation(mapData.info._customData._information);
        setWarnings(mapData.info._customData._warnings);
    }
    if (mapData.data?.customData) {
        const bpm = SavedData.beatmapInfo?._beatsPerMinute
            ? BeatPerMinute.create(
                  SavedData.beatmapInfo._beatsPerMinute,
                  mapData.data.customData._bpmChanges ||
                      mapData.data.customData._BPMChanges ||
                      mapData.data.customData.BPMChanges,
              )
            : null;
        setTimeSpend(mapData.data.customData._time ?? mapData.data.customData.time);
        setBookmarks(mapData.data.customData._bookmarks ?? mapData.data.customData._bookmarks, bpm);
        setBPMChanges(bpm);
        setEnvironmentEnhancement(mapData.data.customData.environment);
        setPointDefinitions(mapData.data.customData.pointDefinitions);
        setCustomEvents(mapData.data.customData.customEvents, bpm);
    }
    setPlayTime(
        mapData.bpm.toRealTime(mapData.data.getFirstInteractiveTime()),
        mapData.bpm.toRealTime(mapData.data.getLastInteractiveTime()),
    );
}

function reset(): void {
    setLevelAuthor();
    setEnvironment();
    setEditors();
    populateContributors();
    setVersion();
    setPlayTime();
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
}

export {
    setLevelAuthor,
    setEnvironment,
    setEditors,
    setContributors,
    populateContributors,
    setVersion,
    setPlayTime,
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
    setTableHeight,
    reset,
};

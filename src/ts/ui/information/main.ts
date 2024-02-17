import UIHeader from '../header';
import SavedData from '../../savedData';
import { IWrapInfo } from '../../types/beatmap/wrapper/info';
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
   setEnvironmentId,
   setRequirements,
   setSuggestions,
   setInformation,
   setWarnings,
   setTimeSpend,
} from './misc';
import { setPointDefinitions } from './pointDefinition';
import { setTableHeight } from './helpers';
import { setPlayTime } from './playTime';
import { setColorScheme } from './colorScheme';

function setInfo(info: IWrapInfo): void {
   UIHeader.setSongName(info.song.title);
   UIHeader.setSongSubname(info.song.subTitle);
   UIHeader.setSongAuthor(info.song.author);
   UIHeader.setSongBPM(info.audio.bpm);
   setEditors(info.customData._editors);
}

function setDiffInfoTable(info: IWrapInfo, mapData: IBeatmapItem): void {
   setVersion((mapData.rawData as any)._version || (mapData.rawData as any).version || 'Unknown');
   setLevelAuthor(mapData.info.authors.mappers, mapData.info.authors.lighters);
   setEnvironment(info.environmentNames.at(mapData.info.environmentId));
   setEnvironmentId(info.environmentNames.at(mapData.info.environmentId));
   setColorScheme(info.colorSchemes.at(mapData.info.colorSchemeId));
   if (mapData.info.customData) {
      setCustomColor(mapData.info.customData);
      setRequirements(mapData.info.customData._requirements as string[]);
      setSuggestions(mapData.info.customData._suggestions as string[]);
      setInformation(mapData.info.customData._information);
      setWarnings(mapData.info.customData._warnings);
   }
   if (mapData.data?.customData) {
      const bpm = SavedData.beatmapInfo?.audio.bpm
         ? BeatPerMinute.create(
              SavedData.beatmapInfo.audio.bpm,
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
   setEnvironmentId();
   setPlayTime();
   setTimeSpend();
   setColorScheme();
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
   setEnvironmentId,
   setEditors,
   setContributors,
   populateContributors,
   setVersion,
   setPlayTime,
   setTimeSpend,
   setColorScheme,
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

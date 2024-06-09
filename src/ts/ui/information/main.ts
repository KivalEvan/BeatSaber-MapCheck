import UIHeader from '../header';
import LoadedData from '../../loadedData';
import { IWrapInfo } from '../../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from '../../types';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import {
   populateContributors,
   setContributors,
   setEditors,
   setEnvironment,
   setLevelAuthor,
} from './info';
import { setBookmarks } from './bookmark';
import { setBPMChanges } from './bpmChange';
import { setCustomColor } from './customColor';
import { setCustomEvents } from './customEvent';
import { setEnvironmentEnhancement } from './environment';
import {
   setEnvironmentId,
   setInformation,
   setLighters,
   setMappers,
   setRequirements,
   setSuggestions,
   setTimeSpend,
   setVersion,
   setWarnings,
} from './misc';
import { setPointDefinitions } from './pointDefinition';
import { setTableHeight } from './helpers';
import { setPlayTime } from './playTime';
import { setColorScheme } from './colorScheme';
import { EnvironmentAllName } from '../../bsmap/types/beatmap/shared/environment';
import {
   getFirstInteractiveTime,
   getLastInteractiveTime,
} from '../../bsmap/beatmap/helpers/beatmap';

function setInfo(info: IWrapInfo): void {
   UIHeader.setSongName(info.song.title);
   UIHeader.setSongSubname(info.song.subTitle);
   UIHeader.setSongAuthor(info.song.author);
   UIHeader.setSongBPM(info.audio.bpm);
   const mapperSet = new Set<string>();
   const lighterSet = new Set<string>();
   const envSet = new Set<EnvironmentAllName>();
   info.difficulties.forEach((d) => {
      d.authors.mappers.forEach((m) => mapperSet.add(m));
      d.authors.lighters.forEach((l) => lighterSet.add(l));
      envSet.add(info.environmentNames.at(d.environmentId)!);
   });
   setLevelAuthor([...mapperSet], [...lighterSet]);
   setEnvironment([...envSet].filter((e) => e) as EnvironmentAllName[]);
   setEditors(info.customData._editors);
}

function setDiffInfoTable(info: IWrapInfo, mapData: IBeatmapItem): void {
   setVersion((mapData.rawData as any)._version || (mapData.rawData as any).version || 'Unknown');
   setMappers(mapData.settings.authors.mappers);
   setLighters(mapData.settings.authors.lighters);
   setEnvironmentId(info.environmentNames.at(mapData.settings.environmentId));
   setColorScheme(info.colorSchemes.at(mapData.settings.colorSchemeId));
   if (mapData.settings.customData) {
      setCustomColor(mapData.settings.customData);
      setRequirements(mapData.settings.customData._requirements as string[]);
      setSuggestions(mapData.settings.customData._suggestions as string[]);
      setInformation(mapData.settings.customData._information);
      setWarnings(mapData.settings.customData._warnings);
   }
   if (mapData.data?.customData) {
      const bpm = LoadedData.beatmapInfo?.audio.bpm
         ? TimeProcessor.create(
              LoadedData.beatmapInfo.audio.bpm,
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
      mapData.timeProcessor.toRealTime(getFirstInteractiveTime(mapData.data)),
      mapData.timeProcessor.toRealTime(getLastInteractiveTime(mapData.data)),
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
   populateContributors,
   reset,
   setBookmarks,
   setBPMChanges,
   setColorScheme,
   setContributors,
   setCustomColor,
   setCustomEvents,
   setDiffInfoTable,
   setEditors,
   setEnvironmentEnhancement,
   setEnvironmentId,
   setInfo,
   setInformation,
   setLevelAuthor,
   setPlayTime,
   setPointDefinitions,
   setRequirements,
   setSuggestions,
   setTableHeight,
   setTimeSpend,
   setVersion,
   setWarnings,
};

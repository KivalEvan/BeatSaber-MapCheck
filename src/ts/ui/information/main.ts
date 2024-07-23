import UIHeader from '../header';
import { IBeatmapItem } from '../../types';
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
import { getFirstInteractiveTime, getLastInteractiveTime, types } from 'bsmap';

function setInfo(info: types.wrapper.IWrapInfo): void {
   UIHeader.setSongName(info.song.title);
   UIHeader.setSongSubname(info.song.subTitle);
   UIHeader.setSongAuthor(info.song.author);
   UIHeader.setSongBPM(info.audio.bpm);
   const mapperSet = new Set<string>();
   const lighterSet = new Set<string>();
   const envSet = new Set<types.EnvironmentAllName>([
      info.environmentBase.normal!,
      info.environmentBase.allDirections!,
   ]);
   info.difficulties.forEach((d) => {
      d.authors.mappers.forEach((m) => mapperSet.add(m));
      d.authors.lighters.forEach((l) => lighterSet.add(l));
      envSet.add(info.environmentNames.at(d.environmentId)!);
   });
   setLevelAuthor([...mapperSet], [...lighterSet]);
   setEnvironment([...envSet].filter((e) => e) as types.EnvironmentAllName[]);
   setEditors(info.customData._editors);
}

function setDiffInfoTable(info: types.wrapper.IWrapInfo, mapData: IBeatmapItem): void {
   setVersion((mapData.rawData as any)._version || (mapData.rawData as any).version || 'Unknown');
   setMappers(mapData.settings.authors.mappers);
   setLighters(mapData.settings.authors.lighters);
   setEnvironmentId(info.environmentNames.at(mapData.settings.environmentId));
   setColorScheme(info.colorSchemes.at(mapData.settings.colorSchemeId));
   setCustomColor(mapData.settings.customData);
   setRequirements(mapData.settings.customData._requirements as string[]);
   setSuggestions(mapData.settings.customData._suggestions as string[]);
   setInformation(mapData.settings.customData._information);
   setWarnings(mapData.settings.customData._warnings);

   const bpm = mapData.timeProcessor;
   setTimeSpend(
      mapData.data.difficulty.customData.time ?? mapData.data.difficulty.customData._time,
   );
   setBookmarks(
      mapData.data.difficulty.customData.bookmarks ?? mapData.data.difficulty.customData._bookmarks,
      bpm,
   );
   setBPMChanges(bpm);
   setEnvironmentEnhancement(
      mapData.data.difficulty.customData.environment ??
         mapData.data.difficulty.customData._environment,
   );
   setPointDefinitions(
      (mapData.data.difficulty.customData.pointDefinitions as any) ??
         mapData.data.difficulty.customData._pointDefinitions,
   );
   setCustomEvents(
      mapData.data.difficulty.customData.customEvents ??
         mapData.data.difficulty.customData._customEvents,
      bpm,
   );
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
   setMappers();
   setLighters();
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

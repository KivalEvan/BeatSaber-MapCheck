import { UIHeader } from '../header';
import { IBeatmapContainer } from '../../types';
import { UIInfoMetadata } from './metadata';
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
import { setPlayTime } from './playTime';
import { setColorScheme } from './colorScheme';
import { getFirstInteractiveTime, getLastInteractiveTime } from 'bsmap';
import * as types from 'bsmap/types';
import { UIInfoHTML } from './html';
import { State } from '../../state';

export class UIInfo {
   static init(): void {
      UIInfoHTML.init();
      UIInfoMetadata.init();
   }

   static reset(): void {
      UIInfoMetadata.reset();
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

   static setInfo(info: types.wrapper.IWrapInfo): void {
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
      UIInfoMetadata.setLevelAuthor([...mapperSet], [...lighterSet]);
      UIInfoMetadata.setEnvironment([...envSet].filter((e) => e) as types.EnvironmentAllName[]);
      UIInfoMetadata.setEditors(info.customData._editors);
   }

   static setDiffInfoTable(info: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      setVersion(
         (beatmap.rawData as any)._version || (beatmap.rawData as any).version || 'Unknown',
      );
      setMappers(beatmap.info.authors.mappers);
      setLighters(beatmap.info.authors.lighters);
      setEnvironmentId(info.environmentNames.at(beatmap.info.environmentId));
      setColorScheme(info.colorSchemes.at(beatmap.info.colorSchemeId));
      setCustomColor(beatmap.info.customData);
      setRequirements(beatmap.info.customData._requirements as string[]);
      setSuggestions(beatmap.info.customData._suggestions as string[]);
      setInformation(beatmap.info.customData._information);
      setWarnings(beatmap.info.customData._warnings);

      const bpm = beatmap.timeProcessor;
      setTimeSpend(
         beatmap.data.difficulty.customData.time ?? beatmap.data.difficulty.customData._time,
      );
      setBookmarks(
         beatmap.data.difficulty.customData.bookmarks ??
            beatmap.data.difficulty.customData._bookmarks,
         bpm,
      );
      setBPMChanges(bpm);
      setEnvironmentEnhancement(
         beatmap.data.difficulty.customData.environment ??
            beatmap.data.difficulty.customData._environment,
      );
      setPointDefinitions(
         (beatmap.data.difficulty.customData.pointDefinitions as any) ??
            beatmap.data.difficulty.customData._pointDefinitions,
      );
      setCustomEvents(
         beatmap.data.difficulty.customData.customEvents ??
            beatmap.data.difficulty.customData._customEvents,
         bpm,
      );
      setPlayTime(
         beatmap.timeProcessor.toRealTime(getFirstInteractiveTime(beatmap.data)),
         beatmap.timeProcessor.toRealTime(getLastInteractiveTime(beatmap.data)),
      );
   }

   static setBookmarks = setBookmarks;
   static setBPMChanges = setBPMChanges;
   static setColorScheme = setColorScheme;
   static setCustomColor = setCustomColor;
   static setCustomEvents = setCustomEvents;
   static setEnvironmentEnhancement = setEnvironmentEnhancement;
   static setEnvironmentId = setEnvironmentId;
   static setInformation = setInformation;
   static setPlayTime = setPlayTime;
   static setPointDefinitions = setPointDefinitions;
   static setRequirements = setRequirements;
   static setSuggestions = setSuggestions;
   static setTimeSpend = setTimeSpend;
   static setVersion = setVersion;
   static setWarnings = setWarnings;
}

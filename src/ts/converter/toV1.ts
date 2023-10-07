import logger from '../logger';
import { Difficulty as V1Difficulty } from '../beatmap/v1/difficulty';
import { Difficulty as V2Difficulty } from '../beatmap/v2/difficulty';
import { Difficulty as V3Difficulty } from '../beatmap/v3/difficulty';
import { Note } from '../beatmap/v1/note';
import { Event } from '../beatmap/v1/event';
import { Obstacle } from '../beatmap/v1/obstacle';
import { IWrapDifficulty } from '../types/beatmap/wrapper/difficulty';
import { IWrapInfo, IWrapInfoDifficulty } from '../types/beatmap/wrapper/info';
import { Info as V1Info } from '../beatmap/v1/info';
import { shallowCopy } from '../utils/misc';

function tag(name: string): string[] {
   return ['convert', name];
}

/**
 * Feeling nostalgic?
 * ```ts
 * const converted = convert.toV1(data);
 * ```
 *
 * **WARNING:** Guess you should know this legacy version does not have modern features.
 */
export function toV1Difficulty(
   data: IWrapDifficulty,
   info: IWrapInfo,
   infoDifficulty: IWrapInfoDifficulty,
): V1Difficulty {
   if (data instanceof V1Difficulty) {
      return data;
   }

   logger.tWarn(tag('toV1Difficulty'), 'Converting beatmap to v1 may lose certain data!');
   const template = new V1Difficulty();
   template.filename = data.filename;

   template.beatsPerMinute = info.beatsPerMinute;
   template.shuffle = info.shuffle;
   template.shufflePeriod = info.shufflePeriod;
   template.noteJumpSpeed = infoDifficulty.njs;
   template.noteJumpStartBeatOffset = infoDifficulty.njsOffset;

   if (data instanceof V2Difficulty) {
      template.time = data.customData._time ?? 0;
      template.BPMChanges = data.customData._bpmChanges ?? [];
      template.bookmarks = data.customData._bookmarks ?? [];
   }

   if (data instanceof V3Difficulty) {
      template.time = data.customData.time ?? 0;
      template.BPMChanges =
         data.customData.BPMChanges?.map((bpmc) => {
            return {
               _time: bpmc.b,
               _bpm: bpmc.m,
               _beatsPerBar: bpmc.p,
               _metronomeOffset: bpmc.o,
            };
         }) ?? [];
      template.bookmarks =
         data.customData.bookmarks?.map((b) => {
            return { _time: b.b, _name: b.n };
         }) ?? [];
   }

   template.colorNotes = data.colorNotes.map((obj) => new Note(obj));
   template.obstacles = data.obstacles.map((obj) => new Obstacle(obj));
   template.basicEvents = data.basicEvents.map((obj) => new Event(obj));

   return template;
}

export function toV1Info(data: IWrapInfo): V1Info {
   if (data instanceof V1Info) {
      return data;
   }

   const template = new V1Info();

   template.songName = data.songName;
   template.songSubName = data.songSubName;
   template.songAuthorName = data.songAuthorName;
   template.beatsPerMinute = data.beatsPerMinute;
   template.previewStartTime = data.previewStartTime;
   template.previewDuration = data.previewDuration;
   template.coverImageFilename = data.coverImageFilename;
   template.environmentName = data.environmentName;
   data.listMap().forEach(([mode, m]) => {
      template.addMap(
         {
            difficulty: m.difficulty,
            difficultyRank: m.rank as 1,
            audioPath: data.songFilename,
            jsonPath: m.filename,
            characteristic: mode,
            offset: m.customData?._editorOffset,
            oldOffset: m.customData?._editorOldOffset,
            chromaToggle: 'Off',
            customColors: !!(
               m.customData?._colorLeft ||
               m.customData?._colorRight ||
               m.customData?._envColorLeft ||
               m.customData?._envColorRight ||
               m.customData?._obstacleColor
            ),
            difficultyLabel: m.customData?._difficultyLabel,
            colorLeft: shallowCopy(m.customData._colorLeft),
            colorRight: shallowCopy(m.customData._colorRight),
            envColorLeft: shallowCopy(m.customData._envColorLeft),
            envColorRight: shallowCopy(m.customData._envColorRight),
            obstacleColor: shallowCopy(m.customData._obstacleColor),
         },
         mode,
      );
   });
   template.oneSaber = !!data.difficultySets.find((m) => m.characteristic === 'OneSaber')
      ?.difficulties.length;
   template.contributors = data.customData?._contributors;
   template.customEnvironment = data.customData?._customEnvironment;
   template.customEnvironmentHash = data.customData?._customEnvironmentHash;

   return template;
}

import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { DifficultyName } from '../../types/beatmap/shared/difficulty';
import {
   Environment360Name,
   EnvironmentAllName,
   EnvironmentName,
   EnvironmentV3Name,
} from '../../types/beatmap/shared/environment';
import { GenericFileName } from '../../types/beatmap/shared/filename';
import { Version } from '../../types/beatmap/shared/version';
import {
   IWrapInfo,
   IWrapInfoColorScheme,
   IWrapInfoColorSchemeData,
   IWrapInfoDifficulty,
   IWrapInfoDifficultyAttribute,
   IWrapInfoSet,
} from '../../types/beatmap/wrapper/info';
import { LooseAutocomplete } from '../../types/utils';
import { WrapBaseItem } from './baseItem';

/** Difficulty beatmap class object. */
export abstract class WrapInfo<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapInfo<T>
{
   private _filename = 'Info.dat';

   abstract version: Version;
   abstract songName: string;
   abstract songSubName: string;
   abstract songAuthorName: string;
   abstract levelAuthorName: string;
   abstract beatsPerMinute: number;
   abstract shuffle: number;
   abstract shufflePeriod: number;
   abstract previewStartTime: number;
   abstract previewDuration: number;
   abstract songFilename: string;
   abstract coverImageFilename: string;
   abstract environmentName: EnvironmentName | EnvironmentV3Name;
   abstract allDirectionsEnvironmentName: Environment360Name;
   abstract songTimeOffset: number;
   abstract environmentNames: EnvironmentAllName[];
   abstract colorSchemes: IWrapInfoColorScheme[];
   abstract difficultySets: IWrapInfoSet[];

   clone<U extends this>(): U {
      return super.clone().setFileName(this.filename) as U;
   }

   set filename(name: LooseAutocomplete<'Info.dat' | 'info.dat'>) {
      this._filename = name.trim();
   }
   get filename(): string {
      return this._filename;
   }

   setFileName(filename: LooseAutocomplete<'Info.dat' | 'info.dat'>) {
      this.filename = filename;
      return this;
   }

   abstract addMap(data: Partial<IWrapInfoDifficultyAttribute>): this;

   listMap(): [CharacteristicName, IWrapInfoDifficulty][] {
      return this.difficultySets.reduce(
         (sets: [CharacteristicName, IWrapInfoDifficulty][], diffSet) =>
            sets.concat(
               diffSet.difficulties.map(
                  (d) => [diffSet.characteristic, d] as [CharacteristicName, IWrapInfoDifficulty],
               ),
            ),
         [],
      );
   }
}

export abstract class WrapInfoSet<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapInfoSet<T>
{
   abstract characteristic: CharacteristicName;
   abstract difficulties: IWrapInfoDifficulty[];
}

export abstract class WrapInfoDifficulty<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapInfoDifficulty<T>
{
   abstract readonly characteristic?: CharacteristicName;
   abstract difficulty: DifficultyName;
   abstract rank: number;
   abstract filename: LooseAutocomplete<GenericFileName>;
   abstract njs: number;
   abstract njsOffset: number;
   abstract colorSchemeId: number;
   abstract environmentId: number;

   abstract copyColorScheme(colorScheme: IWrapInfoColorSchemeData): this;
   abstract copyColorScheme(id: number, info: IWrapInfo): this;
}

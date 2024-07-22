import type {
   Environment360Name,
   EnvironmentAllName,
   EnvironmentV3Name,
} from '../../types/beatmap/shared/environment.ts';

export function is360Environment(
   environment: EnvironmentAllName,
): environment is Environment360Name {
   return environment === 'GlassDesertEnvironment' || environment === 'MultiplayerEnvironment';
}

export function isV3Environment(environment: EnvironmentAllName): environment is EnvironmentV3Name {
   return (
      environment === 'WeaveEnvironment' ||
      environment === 'PyroEnvironment' ||
      environment === 'EDMEnvironment' ||
      environment === 'TheSecondEnvironment' ||
      environment === 'LizzoEnvironment' ||
      environment === 'TheWeekndEnvironment' ||
      environment === 'RockMixtapeEnvironment' ||
      environment === 'Dragons2Environment' ||
      environment === 'Panic2Environment' ||
      environment === 'QueenEnvironment' ||
      environment === 'LinkinPark2Environment' ||
      environment === 'TheRollingStonesEnvironment' ||
      environment === 'LatticeEnvironment' ||
      environment === 'DaftPunkEnvironment' ||
      environment === 'HipHopEnvironment' ||
      environment === 'ColliderEnvironment'
   );
}

/** List of available v2 environment in base game. */
export type EnvironmentName =
   | 'DefaultEnvironment'
   | 'OriginsEnvironment'
   | 'TriangleEnvironment'
   | 'NiceEnvironment'
   | 'BigMirrorEnvironment'
   | 'DragonsEnvironment'
   | 'KDAEnvironment'
   | 'MonstercatEnvironment'
   | 'CrabRaveEnvironment'
   | 'PanicEnvironment'
   | 'RocketEnvironment'
   | 'GreenDayEnvironment'
   | 'GreenDayGrenadeEnvironment'
   | 'TimbalandEnvironment'
   | 'FitBeatEnvironment'
   | 'LinkinParkEnvironment'
   | 'BTSEnvironment'
   | 'KaleidoscopeEnvironment'
   | 'InterscopeEnvironment'
   | 'SkrillexEnvironment'
   | 'BillieEnvironment'
   | 'HalloweenEnvironment'
   | 'GagaEnvironment';

/** List of available v3 environment in base game. */
export type EnvironmentV3Name =
   | 'WeaveEnvironment'
   | 'PyroEnvironment'
   | 'EDMEnvironment'
   | 'TheSecondEnvironment'
   | 'LizzoEnvironment'
   | 'TheWeekndEnvironment'
   | 'RockMixtapeEnvironment'
   | 'Dragons2Environment'
   | 'Panic2Environment'
   | 'QueenEnvironment'
   | 'LinkinPark2Environment'
   | 'TheRollingStonesEnvironment'
   | 'LatticeEnvironment'
   | 'DaftPunkEnvironment';

/** List of available 360 environment in base game. */
export type Environment360Name = 'GlassDesertEnvironment' | 'MultiplayerEnvironment';

/** List of all available environment in base game. */
export type EnvironmentAllName = EnvironmentName | EnvironmentV3Name | Environment360Name;

import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';

/** Environment rename to human readable. */
export const EnvironmentRename: {
   readonly [key in EnvironmentAllName]: string;
} = {
   DefaultEnvironment: 'The First',
   OriginsEnvironment: 'Origins',
   TriangleEnvironment: 'Triangle',
   NiceEnvironment: 'Nice',
   BigMirrorEnvironment: 'Big Mirror',
   DragonsEnvironment: 'Dragons',
   KDAEnvironment: 'K/DA',
   MonstercatEnvironment: 'Monstercat',
   CrabRaveEnvironment: 'Crab Rave',
   PanicEnvironment: 'Panic',
   RocketEnvironment: 'Rocket',
   GreenDayEnvironment: 'Green Day',
   GreenDayGrenadeEnvironment: 'Green Day Grenade',
   TimbalandEnvironment: 'Timbaland',
   FitBeatEnvironment: 'FitBeat',
   LinkinParkEnvironment: 'Linkin Park',
   BTSEnvironment: 'BTS',
   KaleidoscopeEnvironment: 'Kaleidoscope',
   InterscopeEnvironment: 'Interscope',
   SkrillexEnvironment: 'Skrillex',
   BillieEnvironment: 'Billie',
   HalloweenEnvironment: 'Spooky',
   GagaEnvironment: 'Gaga',
   WeaveEnvironment: 'Weave',
   PyroEnvironment: 'Pyro',
   EDMEnvironment: 'EDM',
   TheSecondEnvironment: 'The Second',
   LizzoEnvironment: 'Lizzo',
   TheWeekndEnvironment: 'The Weeknd',
   RockMixtapeEnvironment: 'Rock Mixtape',
   Dragons2Environment: 'Dragons 2.0',
   Panic2Environment: 'Panic 2.0',
   QueenEnvironment: 'Queen',
   LinkinPark2Environment: 'Linkin Park 2.0',
   TheRollingStonesEnvironment: 'The Rolling Stones',
   LatticeEnvironment: 'Lattice',
   DaftPunkEnvironment: 'Daft Punk',
   HipHopEnvironment: 'Hip Hop Mixtape',
   ColliderEnvironment: 'Collider',
   GlassDesertEnvironment: 'Glass Desert',
   MultiplayerEnvironment: 'Origins',
} as const;

/** List of available event type in environment. */
export const EventList: {
   [key in EnvironmentAllName]: readonly [readonly number[], readonly number[]];
} = {
   DefaultEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   OriginsEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   TriangleEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   NiceEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   BigMirrorEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   DragonsEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   KDAEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   MonstercatEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   CrabRaveEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   PanicEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   RocketEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   GreenDayEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   GreenDayGrenadeEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   TimbalandEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   FitBeatEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   LinkinParkEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   BTSEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   KaleidoscopeEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   InterscopeEnvironment: [[0, 1, 2, 3, 4, 6, 7, 8, 9, 12, 13, 16, 17], []],
   SkrillexEnvironment: [[0, 1, 2, 3, 4, 6, 7, 8, 9, 12, 13], []],
   BillieEnvironment: [[0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13], []],
   HalloweenEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   GagaEnvironment: [[0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17], []],
   GlassDesertEnvironment: [[0, 1, 2, 3, 4, 8, 9, 12, 13], []],
   MultiplayerEnvironment: [[4], []],
   WeaveEnvironment: [[], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
   PyroEnvironment: [
      [0, 1, 2, 3, 4, 6, 40],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
   ],
   EDMEnvironment: [
      [0, 1, 4],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
   ],
   TheSecondEnvironment: [
      [0, 1, 2, 3, 4, 9],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
   ],
   LizzoEnvironment: [
      [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 16, 17],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
   ],
   TheWeekndEnvironment: [
      [0, 1, 6],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 29,
         30, 31, 32, 33, 34, 35, 36, 37, 38, 40,
      ],
   ],
   RockMixtapeEnvironment: [
      [3, 4, 6],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
      ],
   ],
   Dragons2Environment: [
      [0, 1, 2, 3, 4, 6],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
   ],
   Panic2Environment: [
      [3],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
   ],
   QueenEnvironment: [
      [6, 40],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
   ],
   LinkinPark2Environment: [
      [3, 40, 41],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
   ],
   TheRollingStonesEnvironment: [
      [6, 40],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
      ],
   ],
   LatticeEnvironment: [
      [6],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, 26, 27, 28, 29, 30,
      ],
   ],
   DaftPunkEnvironment: [
      [6, 40, 41, 42, 43],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
         48, 49, 50, 51, 52, 53, 54, 55,
      ],
   ],
   HipHopEnvironment: [
      [6],
      [
         0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
         27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      ],
   ],
   ColliderEnvironment: [
      [6],
      [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
         25, 26, 27,
      ],
   ],
} as const;

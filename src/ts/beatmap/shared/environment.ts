import { EnvironmentAllName } from '../../types/beatmap/shared/environment';

/** Environment rename to human readable. */
export const EnvironmentRename: Readonly<Record<EnvironmentAllName, string>> = {
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
    GlassDesertEnvironment: 'Glass Desert',
};

export const eventTypeRename = (
    type: number,
    environment?: EnvironmentAllName
): string => {
    switch (type) {
        case 0:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Water 4';
                case 'PyroEnvironment':
                    return 'Video Alpha';
                case 'EDMEnvironment':
                    return 'Lane Lights Bottom';
                default:
                    return 'Back Lasers';
            }
        case 1:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Water 1';
                case 'PyroEnvironment':
                    return 'Logo';
                case 'EDMEnvironment':
                    return 'Lane Lights Top';
                default:
                    return 'Ring Lights';
            }
        case 2:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Left Sun Ray';
                case 'PyroEnvironment':
                    return 'Left Projectors';
                default:
                    return 'Left Lasers';
            }
        case 3:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Right Sun Ray';
                case 'PyroEnvironment':
                    return 'Right Projectors';
                default:
                    return 'Right Lasers';
            }
        case 4:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Sun';
                case 'PyroEnvironment':
                    return 'Platform';
                case 'EDMEnvironment':
                    return 'Player Space & Spectrogram';
                default:
                    return 'Center Lights';
            }
        case 5:
            return 'Light Color Boost';
        case 6:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Water 2';
                case 'PyroEnvironment':
                    return 'Ambient';
                default:
                    return 'Extra Left Lights';
            }
        case 7:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Water 3';
                default:
                    return 'Extra Right Lights';
            }
        case 8:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Rain Toggle';
                default:
                    return 'Ring Rotation';
            }
        case 9:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Laser Align Toggle';
                default:
                    return 'Ring Zoom';
            }
        case 10:
            switch (environment) {
                default:
                    return 'Extra Left Lasers';
            }
        case 11:
            switch (environment) {
                default:
                    return 'Extra Right Lasers';
            }
        case 12:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Left Sun Ray Rotation';
                default:
                    return 'Left Laser Rotation';
            }
        case 13:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Right Sun Ray Rotation';
                default:
                    return 'Right Laser Rotation';
            }
        case 14:
            return 'Early Lane Rotation';
        case 15:
            return 'Late Lane Rotation';
        case 16:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Left Laser Rotation';
                default:
                    return 'Utility Event 1';
            }
        case 17:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Right Laser Rotation';
                default:
                    return 'Utility Event 2';
            }
        case 18:
            switch (environment) {
                default:
                    return 'Utility Event 3';
            }
        case 19:
            switch (environment) {
                default:
                    return 'Utility Event 4';
            }
        case 40:
            switch (environment) {
                case 'PyroEnvironment':
                    return 'Video Projection';
                default:
                    return 'BTS Event 1';
            }
        case 41:
            switch (environment) {
                default:
                    return 'BTS Event 2';
            }
        case 42:
            switch (environment) {
                default:
                    return 'BTS Event 3';
            }
        case 43:
            switch (environment) {
                default:
                    return 'BTS Event 4';
            }
        default:
            return 'Unknown';
    }
};

export const eventGroupRename = (
    id: number,
    environment?: EnvironmentAllName
): string => {
    switch (environment) {
        case 'WeaveEnvironment': {
            switch (id) {
                case 0:
                    return 'Outer Square Bottom Left Laser';
                case 1:
                    return 'Outer Square Bottom Right Laser';
                case 2:
                    return 'Outer Square Top Left Laser';
                case 3:
                    return 'Outer Square Top Right Laser';
                case 4:
                    return 'Inner Square Bottom Left Laser';
                case 5:
                    return 'Inner Square Bottom Right Laser';
                case 6:
                    return 'Inner Square Top Left Laser';
                case 7:
                    return 'Inner Square Top Right Laser';
                case 8:
                    return 'Side Square Bottom Left Laser';
                case 9:
                    return 'Side Square Bottom Right Laser';
                case 10:
                    return 'Side Square Top Left Laser';
                case 11:
                    return 'Side Square Top Right Laser';
                case 12:
                    return 'Distant Square Top Laser';
                case 13:
                    return 'Distant Square Bottom Laser';
                case 14:
                    return 'Distant Square Left Laser';
                case 15:
                    return 'Distant Square Right Laser';
                default:
                    return 'Unknown';
            }
        }
        case 'PyroEnvironment': {
            switch (id) {
                case 0:
                    return 'Left Stage Light';
                case 1:
                    return 'Right Stage Light';
                case 2:
                    return 'Top Left Laser';
                case 3:
                    return 'Top Right Laser';
                case 4:
                    return 'Top Middle Laser';
                case 5:
                    return 'Top Light';
                case 6:
                    return 'Left Light Tower';
                case 7:
                    return 'Right Light Tower';
                case 8:
                    return 'Stage Left Laser';
                case 9:
                    return 'Stage Right Laser';
                case 10:
                    return 'Stage Far Left Laser';
                case 11:
                    return 'Stage Far Right Laser';
                case 12:
                    return 'Left Flame';
                case 13:
                    return 'Right Flame';
                default:
                    return 'Unknown';
            }
        }
        case 'EDMEnvironment': {
            switch (id) {
                case 0:
                    return 'Large Circle Light';
                case 1:
                    return 'Large Circle Light 2';
                case 2:
                    return 'Laser Circle Light';
                case 3:
                    return 'Laser Circle Light 2';
                case 4:
                    return 'Left Vertical Laser';
                case 5:
                    return 'Right Vertical Laser 2';
                case 6:
                    return 'Left Horizontal Laser';
                case 7:
                    return 'Left Horizontal Laser 2';
                case 8:
                    return 'Right Horizontal Laser';
                case 9:
                    return 'Right Horizontal Laser 2';
                case 10:
                    return 'Left Horizontal Laser 3';
                case 11:
                    return 'Right Horizontal Laser 3';
                case 12:
                    return 'Unidentifed';
                case 13:
                    return 'Unidentifed';
                case 14:
                    return 'Unidentifed';
                case 15:
                    return 'Unidentifed';
                case 16:
                    return 'Unidentifed';
                case 17:
                    return 'Unidentifed';
                default:
                    return 'Unknown';
            }
        }
        default:
            return 'Unknown';
    }
};

/** List of available event type in environment. */
export const EventList: Readonly<Record<EnvironmentAllName, [number[], number[]]>> = {
    DefaultEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    OriginsEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    TriangleEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    NiceEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    BigMirrorEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    DragonsEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    KDAEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    MonstercatEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    CrabRaveEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    PanicEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    RocketEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    GreenDayEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    GreenDayGrenadeEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    TimbalandEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    FitBeatEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    LinkinParkEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    BTSEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    KaleidoscopeEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    InterscopeEnvironment: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 16, 17], []],
    SkrillexEnvironment: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13], []],
    BillieEnvironment: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17], []],
    HalloweenEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    GagaEnvironment: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17], []],
    GlassDesertEnvironment: [[0, 1, 2, 3, 4, 5, 8, 9, 12, 13], []],
    WeaveEnvironment: [[], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
    PyroEnvironment: [
        [0, 1, 2, 3, 4, 6],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    ],
    EDMEnvironment: [
        [0, 1, 4],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    ],
};

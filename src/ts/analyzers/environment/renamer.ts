import { EnvironmentAllName } from '../../types/beatmap/shared/environment';

export function eventTypeRename(type: number, environment?: EnvironmentAllName): string {
    switch (type) {
        case 0:
            switch (environment) {
                case 'LinkinParkEnvironment':
                    return 'Lane Light';
                case 'BTSEnvironment':
                    return 'Door Light';
                case 'KaleidoscopeEnvironment':
                    return 'Spike Tip Lights';
                case 'InterscopeEnvironment':
                    return 'Gate 1';
                case 'SkrillexEnvironment':
                case 'TheSecondEnvironment':
                    return 'Logo';
                case 'BillieEnvironment':
                    return 'Water 4';
                case 'HalloweenEnvironment':
                    return 'Sky Lasers';
                case 'GagaEnvironment':
                    return 'Aurora 1';
                case 'PyroEnvironment':
                    return 'Video Alpha';
                case 'EDMEnvironment':
                    return 'Lane Lights Bottom';
                default:
                    return 'Back Lasers';
            }
        /* fall through */
        case 1:
            switch (environment) {
                case 'LinkinParkEnvironment':
                    return 'Ceiling Lights';
                case 'BTSEnvironment':
                    return 'Vertical Pillar Lights';
                case 'KaleidoscopeEnvironment':
                    return 'Spike Mid Lights';
                case 'InterscopeEnvironment':
                    return 'Gate 2';
                case 'SkrillexEnvironment':
                    return 'Top Lanes and 1st Ring Set';
                case 'BillieEnvironment':
                    return 'Water 1';
                case 'HalloweenEnvironment':
                    return 'Moon';
                case 'GagaEnvironment':
                    return 'Aurora 2';
                case 'PyroEnvironment':
                    return 'Logo';
                case 'EDMEnvironment':
                    return 'Lane Lights Top';
                case 'TheSecondEnvironment':
                    return 'Runway';
                default:
                    return 'Ring Lights';
            }
        case 2:
            switch (environment) {
                case 'BTSEnvironment':
                    return 'Door Light';
                case 'KaleidoscopeEnvironment':
                    return 'Spike Left Lights';
                case 'InterscopeEnvironment':
                    return 'Gate 3';
                case 'BillieEnvironment':
                    return 'Left Sun Beams';
                case 'GagaEnvironment':
                    return 'Tower 1';
                case 'PyroEnvironment':
                    return 'Left Projectors';
                case 'TheSecondEnvironment':
                    return 'Left Flags';
                default:
                    return 'Left Lasers';
            }
        case 3:
            switch (environment) {
                case 'KaleidoscopeEnvironment':
                    return 'Spike Right Lights';
                case 'InterscopeEnvironment':
                    return 'Gate 4';
                case 'BillieEnvironment':
                    return 'Right Sun Beams';
                case 'GagaEnvironment':
                    return 'Tower 2';
                case 'PyroEnvironment':
                    return 'Right Projectors';
                case 'TheSecondEnvironment':
                    return 'Right Flags';
                default:
                    return 'Right Lasers';
            }
        case 4:
            switch (environment) {
                case 'KaleidoscopeEnvironment':
                    return 'Distant Lasers and Spike Top Lights';
                case 'InterscopeEnvironment':
                    return 'Gate 5';
                case 'SkrillexEnvironment':
                    return 'Bottom Lanes and 2nd Ring Set';
                case 'BillieEnvironment':
                    return 'Sun';
                case 'HalloweenEnvironment':
                    return 'Lane + Castle Interior';
                case 'GagaEnvironment':
                    return 'Logo';
                case 'PyroEnvironment':
                    return 'Platform';
                case 'EDMEnvironment':
                    return 'Player Space & Spectrogram';
                case 'TheSecondEnvironment':
                    return 'Buildings';
                default:
                    return 'Center Lights';
            }
        case 5:
            return 'Boost Colors';
        case 6:
            switch (environment) {
                case 'InterscopeEnvironment':
                    return 'Extra 1';
                case 'SkrillexEnvironment':
                    return 'Left Panel';
                case 'BillieEnvironment':
                    return 'Water 2';
                case 'GagaEnvironment':
                    return 'Tower 3';
                case 'PyroEnvironment':
                    return 'Ambient';
                default:
                    return 'Extra Left Lights';
            }
        case 7:
            switch (environment) {
                case 'InterscopeEnvironment':
                    return 'Extra 2';
                case 'SkrillexEnvironment':
                    return 'Right Panel';
                case 'BillieEnvironment':
                    return 'Water 3';
                case 'GagaEnvironment':
                    return 'Tower 4';
                default:
                    return 'Extra Right Lights';
            }
        case 8:
            switch (environment) {
                case 'LinkinParkEnvironment':
                    return 'Laser Mode';
                case 'BTSEnvironment':
                    return 'Distant Tower Spin';
                case 'BillieEnvironment':
                    return 'Toggle Rain';
                default:
                    return 'Ring Rotation';
            }
        case 9:
            switch (environment) {
                case 'BTSEnvironment':
                    return 'Raise/Lower Pillars';
                case 'BillieEnvironment':
                    return 'Sunbeam Mode';
                default:
                    return 'Ring Zoom';
            }
        case 10:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Left Bottom Lasers';
                case 'GagaEnvironment':
                    return 'Tower 5';
                default:
                    return 'Extra Left Lasers';
            }
        case 11:
            switch (environment) {
                case 'BillieEnvironment':
                    return 'Right Bottom Lasers';
                case 'GagaEnvironment':
                    return 'Tower 6';
                default:
                    return 'Extra Right Lasers';
            }
        case 12:
            switch (environment) {
                case 'SkrillexEnvironment':
                    return 'Left Laser & Panel Speed';
                case 'GagaEnvironment':
                    return 'Tower 1 Height';
                case 'BillieEnvironment':
                    return 'Left Sun Beams Speed';
                default:
                    return 'Left Laser Speed';
            }
        case 13:
            switch (environment) {
                case 'SkrillexEnvironment':
                    return 'Right Laser & Panel Speed';
                case 'GagaEnvironment':
                    return 'Tower 2 Height';
                case 'BillieEnvironment':
                    return 'Right Sun Beams Speed';
                default:
                    return 'Right Laser Speed';
            }
        case 14:
            return 'Early Lane Rotation';
        case 15:
            return 'Late Lane Rotation';
        case 16:
            switch (environment) {
                case 'GagaEnvironment':
                    return 'Tower 3 Height';
                default:
                    return 'Utility Event 1';
            }
        case 17:
            switch (environment) {
                case 'GagaEnvironment':
                    return 'Tower 4 Height';
                default:
                    return 'Utility Event 2';
            }
        case 18:
            switch (environment) {
                case 'GagaEnvironment':
                    return 'Tower 5 Height';
                default:
                    return 'Utility Event 3';
            }
        case 19:
            switch (environment) {
                case 'GagaEnvironment':
                    return 'Tower 6 Height';
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
}

export function eventGroupRename(id: number, environment?: EnvironmentAllName): string {
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
            }
        }
        /* fall through */
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
            }
        }
        /* fall through */
        case 'EDMEnvironment': {
            switch (id) {
                case 0:
                    return 'Top Circle';
                case 1:
                    return 'Close Circle';
                case 2:
                    return 'Distant Circle';
                case 3:
                    return 'Distant Circle 2';
                case 4:
                    return 'Left Single Source Circle';
                case 5:
                    return 'Right Single Source Circle';
                case 6:
                    return 'Left Laser (Up)';
                case 7:
                    return 'Left Laser (Out)';
                case 8:
                    return 'Right Laser (Up)';
                case 9:
                    return 'Right Laser (Out)';
                case 10:
                    return 'Left Laser (Down)';
                case 11:
                    return 'Right Laser (Down)';
                case 12:
                    return 'Left Laser (Down) / Top Circle Rotation';
                case 13:
                    return 'Right Laser (Up) / Close Circle Rotation';
                case 14:
                    return 'Distant Circle Rotation';
                case 15:
                    return 'Distant Circle 2 Rotation';
                case 16:
                    return 'Left Single Source Circle Rotation';
                case 17:
                    return 'Right Single Source Circle Rotation';
            }
        }
        /* fall through */
        case 'TheSecondEnvironment': {
            switch (id) {
                case 0:
                    return 'Bing Rings';
                case 1:
                    return 'Small Rings';
                case 2:
                    return 'Runway Left';
                case 3:
                    return 'Runway Right';
                case 4:
                    return 'Spotlight Left';
                case 5:
                    return 'Spotlight Right';
                case 6:
                    return 'Top Lasers Left Bottom';
                case 7:
                    return 'Top Lasers Right Bottom';
                case 8:
                    return 'Top Lasers Left Top';
                case 9:
                    return 'Top Lasers Right Top';
                case 10:
                    return 'Bottom Lasers Left Bottom';
                case 11:
                    return 'Bottom Lasers Right Bottom';
                case 12:
                    return 'Bottom Lasers Left Top';
                case 13:
                    return 'Bottom Lasers Right Top';
            }
        }
        /* fall through */
        default:
            return 'Unknown';
    }
}

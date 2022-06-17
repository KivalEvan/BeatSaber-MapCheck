import { EnvironmentAllName } from '../../types/beatmap/shared/environment';

export function eventTypeRename(type: number, environment?: EnvironmentAllName): string {
    // environment specific
    switch (environment) {
        case 'LinkinParkEnvironment':
            switch (type) {
                case 0:
                    return 'Lane Light';
                case 1:
                    return 'Ceiling Lights';
                case 8:
                    return 'Laser Mode';
                default:
            }
            break;
        case 'BTSEnvironment':
            switch (type) {
                case 0:
                    return 'Door Light';
                case 1:
                    return 'Vertical Pillar Lights';
                case 8:
                    return 'Distant Tower Spin';
                case 9:
                    return 'Raise/Lower Pillars';
                case 40:
                    return 'BTS Event 1';
                case 41:
                    return 'BTS Event 2';
                case 42:
                    return 'BTS Event 3';
                case 43:
                    return 'BTS Event 4';
                default:
            }
            break;
        case 'KaleidoscopeEnvironment':
            switch (type) {
                case 0:
                    return 'Spike Tip Lights';
                case 1:
                    return 'Spike Mid Lights';
                case 2:
                    return 'Spike Left Lights';
                case 3:
                    return 'Spike Right Lights';
                case 4:
                    return 'Distant Lasers and Spike Top Lights';
            }
            break;
        case 'InterscopeEnvironment':
            switch (type) {
                case 0:
                    return 'Gate 1';
                case 1:
                    return 'Gate 2';
                case 2:
                    return 'Gate 3';
                case 3:
                    return 'Gate 4';
                case 4:
                    return 'Gate 5';
                case 6:
                    return 'Extra 1';
                case 7:
                    return 'Extra 2';
                default:
            }
            break;
        case 'SkrillexEnvironment':
            switch (type) {
                case 0:
                    return 'Logo';
                case 1:
                    return 'Top Lanes and 1st Ring Set';
                case 4:
                    return 'Bottom Lanes and 2nd Ring Set';
                case 6:
                    return 'Left Panel';
                case 7:
                    return 'Right Panel';
                case 12:
                    return 'Left Laser & Panel Speed';
                case 13:
                    return 'Right Laser & Panel Speed';
                default:
            }
            break;
        case 'BillieEnvironment':
            switch (type) {
                case 0:
                    return 'Water 4';
                case 1:
                    return 'Water 1';
                case 2:
                    return 'Left Sun Beams';
                case 3:
                    return 'Right Sun Beams';
                case 4:
                    return 'Sun';
                case 6:
                    return 'Water 2';
                case 7:
                    return 'Water 3';
                case 8:
                    return 'Toggle Rain';
                case 9:
                    return 'Sunbeam Mode';
                case 10:
                    return 'Left Bottom Lasers';
                case 11:
                    return 'Right Bottom Lasers';
                case 12:
                    return 'Left Sun Beams Speed';
                case 13:
                    return 'Right Sun Beams Speed';
                default:
            }
            break;
        case 'HalloweenEnvironment':
            switch (type) {
                case 0:
                    return 'Sky Lasers';
                case 1:
                    return 'Moon';
                case 4:
                    return 'Lane + Castle Interior';
                default:
            }
            break;
        case 'GagaEnvironment':
            switch (type) {
                case 0:
                    return 'Aurora 1';
                case 1:
                    return 'Aurora 2';
                case 2:
                    return 'Tower 1';
                case 3:
                    return 'Tower 2';
                case 4:
                    return 'Logo';
                case 6:
                    return 'Tower 3';
                case 7:
                    return 'Tower 4';
                case 10:
                    return 'Tower 5';
                case 11:
                    return 'Tower 6';
                case 14:
                    return 'Tower 1 Height';
                case 15:
                    return 'Tower 2 Height';
                case 16:
                    return 'Tower 3 Height';
                case 17:
                    return 'Tower 4 Height';
                case 18:
                    return 'Tower 5 Height';
                case 19:
                    return 'Tower 6 Height';
                default:
            }
            break;
        case 'WeaveEnvironment':
            switch (type) {
                case 4:
                    return 'Player Space';
                default:
            }
            break;
        case 'PyroEnvironment':
            switch (type) {
                case 0:
                    return 'Video Alpha';
                case 1:
                    return 'Logo';
                case 2:
                    return 'Left Projectors';
                case 3:
                    return 'Right Projectors';
                case 4:
                    return 'Platform';
                case 6:
                    return 'Ambient';
                case 40:
                    return 'Video Projection';
                default:
            }
            break;
        case 'EDMEnvironment':
            switch (type) {
                case 0:
                    return 'Lane Lights Bottom';
                case 1:
                    return 'Lane Lights Top';
                case 4:
                    return 'Player Space & Spectrogram';
                default:
            }
            break;
        case 'TheSecondEnvironment':
            switch (type) {
                case 0:
                    return 'Logo';
                case 1:
                    return 'Runway';
                case 2:
                    return 'Left Flags';
                case 3:
                    return 'Right Flags';
                case 4:
                    return 'Buildings';
                default:
            }
            break;
        default:
    }
    // generic
    switch (type) {
        case 0:
            return 'Back Lasers';
        case 1:
            return 'Ring Lights';
        case 2:
            return 'Left Lasers';
        case 3:
            return 'Right Lasers';
        case 4:
            return 'Center Lights';
        case 5:
            return 'Boost Colors';
        case 6:
            return 'Extra Left Lights';
        case 7:
            return 'Extra Right Lights';
        case 8:
            return 'Ring Rotation';
        case 9:
            return 'Ring Zoom';
        case 10:
            return 'Extra Left Lasers';
        case 11:
            return 'Extra Right Lasers';
        case 12:
            return 'Left Laser Speed';
        case 13:
            return 'Right Laser Speed';
        case 14:
            return 'Early Lane Rotation';
        case 15:
            return 'Late Lane Rotation';
        case 16:
            return 'Utility Event 1';
        case 17:
            return 'Utility Event 2';
        case 18:
            return 'Utility Event 3';
        case 19:
            return 'Utility Event 4';

        default:
            return 'Unknown';
    }
}

import { EnvironmentAllName } from '../../types/beatmap/shared/environment';

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
                default:
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
                default:
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
                default:
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
                default:
            }
        }
        /* fall through */
        default:
            return 'Unknown';
    }
}

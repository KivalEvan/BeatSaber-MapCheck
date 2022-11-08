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
                    return 'Left Laser (Down) / Top Circle';
                case 13:
                    return 'Right Laser (Up) / Close Circle';
                case 14:
                    return 'Distant Circle';
                case 15:
                    return 'Distant Circle 2';
                case 16:
                    return 'Left Single Source Circle';
                case 17:
                    return 'Right Single Source Circle';
                default:
            }
        }
        /* fall through */
        case 'TheSecondEnvironment': {
            switch (id) {
                case 0:
                    return 'Big Rings';
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
        case 'LizzoEnvironment': {
            switch (id) {
                case 0:
                    return 'Main Floor';
                case 1:
                    return 'Rainbow Arcs Inner';
                case 2:
                    return 'Rainbow Arcs 2';
                case 3:
                    return 'Rainbow Arcs 3';
                case 4:
                    return 'Rainbow Arcs 4';
                case 5:
                    return 'Rainbow Arcs Outer';
                case 6:
                    return 'Rainbow Rings Left';
                case 7:
                    return 'Rainbow Rings Right';
                case 8:
                    return 'Rainbow Rings Lasers Left';
                case 9:
                    return 'Rainbow Rings Lasers Right';
                case 10:
                    return 'Main Top Lasers';
                case 11:
                    return 'Environment Stands Left';
                case 12:
                    return 'Environment Stands Right';
                case 13:
                    return 'Environment Clouds Left';
                case 14:
                    return 'Environment Clouds Right';
                case 15:
                    return 'Main Left Lasers';
                case 16:
                    return 'Main Right Lasers';
                case 17:
                    return 'Environment Stand Lasers Left';
                case 18:
                    return 'Environment Stand Lasers Right';
                case 19:
                    return 'Rainbow Arcs Laser';
                default:
            }
        }
        /* fall through */
        case 'TheWeekndEnvironment': {
            switch (id) {
                case 0:
                    return 'Lamps Poles Left';
                case 1:
                    return 'Lamps Poles Right';
                case 2:
                    return 'Lamps Rings Left';
                case 3:
                    return 'Lamps Rings Right';
                case 4:
                    return 'Environment Arrows';
                case 5:
                    return 'Environment Side Lasers Left';
                case 6:
                    return 'Environment Side Lasers Right';
                case 7:
                    return 'Environment Runway Lane';
                case 8:
                    return 'Environment Center Ring';
                case 9:
                    return 'Environment Center Ring Lasers';
                case 10:
                    return 'Windows Left 1 Front';
                case 11:
                    return 'Windows Left 1 Side';
                case 12:
                    return 'Windows Left 2 Side';
                case 13:
                    return 'Windows Left 3 Front';
                case 14:
                    return 'Windows Left 3 Side';
                case 15:
                    return 'Windows Right 1 Front';
                case 16:
                    return 'Windows Right 1 Side';
                case 17:
                    return 'Windows Right 2 Side';
                case 18:
                    return 'Windows Right 3 Front';
                case 19:
                    return 'Windows Right 3 Side';
                case 20:
                    return 'Buildings Left';
                case 21:
                    return 'Buildings Right';
                case 22:
                    return 'Buildings Roof Left';
                case 23:
                    return 'Buildings Roof Right';
                case 29:
                    return 'Lamp Rings Left 1';
                case 30:
                    return 'Lamp Rings Left 2';
                case 31:
                    return 'Lamp Rings Left 3';
                case 32:
                    return 'Lamp Rings Left 4';
                case 33:
                    return 'Lamp Rings Right 1';
                case 34:
                    return 'Lamp Rings Right 2';
                case 35:
                    return 'Lamp Rings Right 3';
                case 36:
                    return 'Lamp Rings Right 4';
                case 38:
                    return 'Buildings Background Left';
                case 39:
                    return 'Buildings Background Right';
                case 40:
                    return 'Buildings Side Buildings';
                default:
            }
        }
        /* fall through */
        default:
            return 'Unknown';
    }
}

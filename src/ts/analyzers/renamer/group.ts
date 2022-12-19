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
                    return 'Stage Left Platform';
                case 1:
                    return 'Stage Right Platform';
                case 2:
                    return 'Top Stage Left Laser';
                case 3:
                    return 'Top Stage Right Laser';
                case 4:
                    return 'Top Stage Middle Laser';
                case 5:
                    return 'Top Stage Light';
                case 6:
                    return 'Side Panels Left Tower';
                case 7:
                    return 'Side Panels Right Tower';
                case 8:
                    return 'Stage Left Laser';
                case 9:
                    return 'Stage Right Laser';
                case 10:
                    return 'Side Panels Left Laser';
                case 11:
                    return 'Side Panels Right Laser';
                case 12:
                    return 'Fire Left';
                case 13:
                    return 'Fire Right';
                default:
            }
        }
        /* fall through */
        case 'EDMEnvironment': {
            switch (id) {
                case 0:
                    return 'Circles Top';
                case 1:
                    return 'Circles Close';
                case 2:
                    return 'Circles Distant';
                case 3:
                    return 'Circles Distant 2';
                case 4:
                    return 'Single Source Circles Left';
                case 5:
                    return 'Single Source Circles Right';
                case 6:
                    return 'Single Source Lasers Left (Up)';
                case 7:
                    return 'Single Source Lasers Left (Out)';
                case 8:
                    return 'Single Source Lasers Right (Up)';
                case 9:
                    return 'Single Source Lasers Right (Out)';
                case 10:
                    return 'Single Source Lasers Left (Down)';
                case 11:
                    return 'Single Source Lasers Right (Down)';
                case 12:
                    return 'Single Source Lasers Left (Down) / Circle Rotations Top';
                case 13:
                    return 'Single Source Lasers Right (Up) / Circle Rotations Close';
                case 14:
                    return 'Circle Rotations Distant';
                case 15:
                    return 'Circle Rotations Distant 2';
                case 16:
                    return 'Circle Rotations Single Source Left';
                case 17:
                    return 'Circle Rotations Single Source Right';
                default:
            }
        }
        /* fall through */
        case 'TheSecondEnvironment': {
            switch (id) {
                case 0:
                    return 'Rings Big';
                case 1:
                    return 'Rings Small';
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
                case 37:
                    return 'Buildings Background Left';
                case 38:
                    return 'Buildings Background Right';
                case 40:
                    return 'Buildings Side Buildings';
                default:
            }
        }
        /* fall through */
        case 'RockMixtapeEnvironment': {
            switch (id) {
                case 0:
                    return 'Lasers Far Left';
                case 1:
                    return 'Lasers Far Right';
                case 2:
                    return 'Mountain 1';
                case 3:
                    return 'Mountain 2';
                case 4:
                    return 'Mountain 3';
                case 5:
                    return 'Mountain 4';
                case 6:
                    return 'Mountain 5';
                case 7:
                    return 'Mountain 6';
                case 8:
                    return 'Mountain 7';
                case 9:
                    return 'Mountain 8';
                case 10:
                    return 'Mountain 9';
                case 11:
                    return 'Mountain 10';
                case 12:
                    return 'Mountain 11';
                case 13:
                    return 'Mountain 12';
                case 14:
                    return 'Face Eyes';
                case 15:
                    return 'Runway Frets';
                case 16:
                    return 'Runway Strings';
                case 17:
                    return 'Runway Tunnel';
                case 18:
                    return 'Lasers Side Left';
                case 19:
                    return 'Lasers Side Right';
                case 20:
                    return 'Lasers Side Left Rotation';
                case 21:
                    return 'Lasers Side Right Rotation';
                case 22:
                    return 'Face Left';
                case 23:
                    return 'Face Right';
                case 24:
                    return 'Spikes Left';
                case 25:
                    return 'Spikes Left Movement';
                case 26:
                    return 'Spikes Right';
                case 27:
                    return 'Spikes Right Movement';
                case 28:
                    return 'Runway Dots';
                case 29:
                    return 'Face Movement';
                case 30:
                    return 'Runway Equilizer';
                case 31:
                    return 'Screens Left 1';
                case 32:
                    return 'Screens Left 2';
                case 33:
                    return 'Screens Right 1';
                case 34:
                    return 'Screens Right 2';
                case 35:
                    return 'Screens Left Movement';
                case 36:
                    return 'Screens Right Movement';
                case 37:
                    return 'Lasers Side Z Translation';
                default:
            }
        }
        /* fall through */
        default:
            return 'Unknown';
    }
}

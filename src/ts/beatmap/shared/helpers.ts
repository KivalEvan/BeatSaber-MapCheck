import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IInfo } from '../../types/beatmap/shared/info';
import { LANE_SIZE } from './constants';

/** Convert grid lane size unit to unity unit */
export function gridToUnityUnit(value: number) {
    return value * LANE_SIZE;
}

/** Convert unity unit to grid lane size unit */
export function unityToGridUnit(value: number) {
    return value / LANE_SIZE;
}

export function currentEnvironment(
    info: IInfo,
    characteristic?: CharacteristicName,
): EnvironmentAllName {
    if (characteristic === '360Degree' || characteristic === '90Degree') {
        return info._allDirectionsEnvironmentName;
    }
    return info._environmentName;
}

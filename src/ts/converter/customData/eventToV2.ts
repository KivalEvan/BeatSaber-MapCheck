import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { deepCopy } from '../../utils/misc';
import { IEvent } from '../../types/beatmap/v2/event';
import { renameKey } from './_helpers';

export default function (
    customData?: IBasicEvent['customData'],
): NonNullable<IEvent['_customData']> {
    if (!customData) {
        return {};
    }
    const cd = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {};
    }

    renameKey(cd, 'color', '_color');
    renameKey(cd, 'lightID', '_lightID');
    renameKey(cd, 'easing', '_easing');
    renameKey(cd, 'lerpType', '_lerpType');
    renameKey(cd, 'nameFilter', '_nameFilter');
    renameKey(cd, 'rotation', '_rotation');
    renameKey(cd, 'step', '_step');
    renameKey(cd, 'prop', '_prop');
    renameKey(cd, 'speed', '_speed');
    renameKey(cd, 'direction', '_direction');
    renameKey(cd, 'lockRotation', '_lockPosition');
    renameKey(cd, 'speed', '_preciseSpeed');

    return cd;
}

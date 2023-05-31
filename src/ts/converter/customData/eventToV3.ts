import { IEvent } from '../../types/beatmap/v2/event';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { deepCopy } from '../../utils/misc';
import { renameKey } from './_helpers';

export default function (
    customData?: IEvent['_customData'],
): NonNullable<IBasicEvent['customData']> {
    if (!customData) {
        return {};
    }
    const cd = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {};
    }

    renameKey(cd, '_color', 'color');
    renameKey(cd, '_lightID', 'lightID');
    renameKey(cd, '_easing', 'easing');
    renameKey(cd, '_lerpType', 'lerpType');
    renameKey(cd, '_nameFilter', 'nameFilter');
    renameKey(cd, '_rotation', 'rotation');
    renameKey(cd, '_step', 'step');
    renameKey(cd, '_prop', 'prop');
    renameKey(cd, '_direction', 'direction');
    renameKey(cd, '_lockPosition', 'lockRotation');

    // special case
    const speed = cd._preciseSpeed ?? cd._speed;
    cd.speed ??= speed;
    delete cd._speed;
    delete cd._preciseSpeed;

    delete cd._propID;
    delete cd._lightGradient;
    delete cd._reset;
    delete cd._counterSpin;
    delete cd._stepMult;
    delete cd._propMult;
    delete cd._speedMult;

    return cd;
}

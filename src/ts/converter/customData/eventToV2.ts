import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { deepCopy } from '../../utils/misc';
import { IEvent } from '../../types/beatmap/v2/event';

export default function (customData?: IBasicEvent['customData']): NonNullable<IEvent['_customData']> {
    if (!customData) {
        return {};
    }
    const cd = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {};
    }

    cd._color ??= cd.color;
    cd._lightID ??= cd.lightID;
    cd._easing ??= cd.easing;
    cd._lerpType ??= cd.lerpType;
    cd._nameFilter ??= cd.nameFilter;
    cd._rotation ??= cd.rotation;
    cd._step ??= cd.step;
    cd._prop ??= cd.prop;
    cd._speed ??= cd.speed;
    cd._direction ??= cd.direction;
    cd._lockPosition ??= cd.lockRotation;
    cd._preciseSpeed ??= cd.speed;

    // delete converted customData
    delete cd.color;
    delete cd.lightID;
    delete cd.easing;
    delete cd.lerpType;
    delete cd.nameFilter;
    delete cd.rotation;
    delete cd.step;
    delete cd.prop;
    delete cd.speed;
    delete cd.direction;
    delete cd.lockRotation;

    return cd;
}

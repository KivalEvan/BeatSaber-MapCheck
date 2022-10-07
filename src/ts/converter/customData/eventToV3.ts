import { IEvent } from '../../types/beatmap/v2/event';
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { deepCopy } from '../../utils/misc';

export default function (customData?: IEvent['_customData']): NonNullable<IBasicEvent['customData']> {
    if (!customData) {
        return {};
    }
    const cd = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {};
    }

    const speed = cd._preciseSpeed ?? cd._speed;
    cd.color ??= cd._color;
    cd.lightID ??= cd._lightID;
    cd.easing ??= cd._easing;
    cd.lerpType ??= cd._lerpType;
    cd.nameFilter ??= cd._nameFilter;
    cd.rotation ??= cd._rotation;
    cd.step ??= cd._step;
    cd.prop ??= cd._prop;
    cd.speed ??= speed;
    cd.direction ??= cd._direction;
    cd.lockRotation ??= cd._lockPosition;

    // delete converted customData and deprecated feature
    delete cd._color;
    delete cd._lightID;
    delete cd._easing;
    delete cd._lerpType;
    delete cd._propID;
    delete cd._lightGradient;
    delete cd._nameFilter;
    delete cd._rotation;
    delete cd._step;
    delete cd._prop;
    delete cd._speed;
    delete cd._preciseSpeed;
    delete cd._direction;
    delete cd._reset;
    delete cd._counterSpin;
    delete cd._stepMult;
    delete cd._propMult;
    delete cd._speedMult;
    delete cd._lockPosition;

    return cd;
}

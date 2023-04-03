import { ICustomDataBase } from '../../types/beatmap/shared/custom/customData';
import { ICustomDataNote, ICustomDataObstacle } from '../../types/beatmap/v3/custom/customData';
import { deepCopy } from '../../utils/misc';

export default function <T extends ICustomDataBase>(
    customData?: ICustomDataNote & ICustomDataObstacle,
): T {
    if (!customData) {
        return {} as T;
    }
    const cd: ICustomDataBase = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {} as T;
    }

    // notes & obstacles
    cd._color ??= cd.color;
    cd._position ??= cd.coordinates;
    cd._disableNoteGravity ??= cd.disableNoteGravity;
    cd._disableNoteLook ??= cd.disableNoteLook;
    cd._flip ??= cd.flip;
    cd._localRotation ??= cd.localRotation;
    cd._noteJumpMovementSpeed ??= cd.noteJumpMovementSpeed;
    cd._noteJumpStartBeatOffset ??= cd.noteJumpStartBeatOffset;
    cd._disableSpawnEffect ??= typeof cd.spawnEffect === 'boolean' ? !cd.spawnEffect : undefined;
    cd._scale ??= cd.size;
    cd._track ??= cd.track;
    cd._interactable ??= typeof cd.uninteractable === 'boolean' ? !cd.uninteractable : undefined;
    cd._rotation ??= cd.worldRotation;
    if (cd.animation) {
        cd._animation ??= {
            _color: cd.animation.color,
            _definitePosition: cd.animation.definitePosition,
            _dissolve: cd.animation.dissolve,
            _dissolveArrow: cd.animation.dissolveArrow,
            _interactable: cd.animation.interactable,
            _localRotation: cd.animation.localRotation,
            _position: cd.animation.offsetPosition,
            _rotation: cd.animation.offsetRotation,
            _scale: cd.animation.scale,
            _time: cd.animation.time,
        };
    }

    // delete converted customData
    delete cd.color;
    delete cd.coordinates;
    delete cd.disableNoteGravity;
    delete cd.disableNoteLook;
    delete cd.flip;
    delete cd.localRotation;
    delete cd.noteJumpMovementSpeed;
    delete cd.noteJumpStartBeatOffset;
    delete cd.spawnEffect;
    delete cd.size;
    delete cd.track;
    delete cd.uninteractable;
    delete cd.worldRotation;
    delete cd.animation;

    return cd as T;
}

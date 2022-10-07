import { ICustomDataBase } from '../../types/beatmap/shared/customData';
import { ICustomDataNote, ICustomDataObstacle } from '../../types/beatmap/v2/customData';
import { deepCopy } from '../../utils/misc';

export default function <T extends ICustomDataBase>(customData?: ICustomDataNote & ICustomDataObstacle): T {
    if (!customData) {
        return {} as T;
    }
    const cd: ICustomDataBase = deepCopy(customData);
    if (!Object.keys(cd).length) {
        return {} as T;
    }

    // notes & obstacles
    cd.color ??= cd._color;
    cd.coordinates ??= cd._position;
    cd.disableNoteGravity ??= cd._disableNoteGravity;
    cd.disableNoteLook ??= cd._disableNoteLook;
    cd.flip ??= cd._flip;
    cd.localRotation ??= cd._localRotation;
    cd.noteJumpMovementSpeed ??= cd._noteJumpMovementSpeed;
    cd.noteJumpStartBeatOffset ??= cd._noteJumpStartBeatOffset;
    cd.spawnEffect ??= typeof cd._disableSpawnEffect === 'boolean' ? !cd._disableSpawnEffect : undefined;
    cd.size ??= cd._scale;
    cd.track ??= cd._track;
    cd.uninteractable ??= typeof cd._interactable === 'boolean' ? !cd._interactable : undefined;
    cd.worldRotation ??= cd._rotation;
    if (cd._animation) {
        cd.animation ??= {
            color: cd._animation._color,
            definitePosition: cd._animation._definitePosition,
            dissolve: cd._animation._dissolve,
            dissolveArrow: cd._animation._dissolveArrow,
            interactable: cd._animation._interactable,
            localRotation: cd._animation._localRotation,
            offsetPosition: cd._animation._position,
            offsetRotation: cd._animation._rotation,
            scale: cd._animation._scale,
            time: cd._animation._time,
        };
    }

    // delete converted customData and deprecated feature
    delete cd._color;
    delete cd._position;
    delete cd._disableNoteGravity;
    delete cd._disableNoteLook;
    delete cd._flip;
    delete cd._cutDirection;
    delete cd._localRotation;
    delete cd._noteJumpMovementSpeed;
    delete cd._noteJumpStartBeatOffset;
    delete cd._disableSpawnEffect;
    delete cd._scale;
    delete cd._track;
    delete cd._interactable;
    delete cd._rotation;
    delete cd._animation;

    return cd as T;
}

import UIPanel from '../helpers/panel';
import { RgbaToHex } from '../../utils';
import { IColorScheme } from '../../types/beatmap/shared/colorScheme';
import { EnvironmentName } from '../../types/beatmap/shared/environment';
import {
    ColorScheme,
    ColorSchemeRename,
    EnvironmentSchemeName,
} from '../../beatmap/shared/colorScheme';
import { htmlTableCustomColor } from './constants';
import { displayTableRow, hideTableRow } from './helpers';
import { IColor } from '../../types/colors';

export function setCustomColor(customColor?: IColorScheme, environment?: EnvironmentName): void {
    if (
        !customColor ||
        (!customColor._colorLeft &&
            !customColor._colorRight &&
            !customColor._envColorLeft &&
            !customColor._envColorLeftBoost &&
            !customColor._envColorRight &&
            !customColor._envColorRightBoost &&
            !customColor._envColorWhite &&
            !customColor._envColorWhiteBoost &&
            !customColor._obstacleColor)
    ) {
        hideTableRow(htmlTableCustomColor);
        return;
    }
    if (!environment) {
        environment = 'DefaultEnvironment';
    }
    const existColor: { [key: string]: Omit<IColor, 'a'> | null } = {
        _colorLeft: ColorScheme[EnvironmentSchemeName[environment]]?._colorLeft || null,
        _colorRight: ColorScheme[EnvironmentSchemeName[environment]]?._colorRight || null,
        _envColorLeft: ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeft || null,
        _envColorRight: ColorScheme[EnvironmentSchemeName[environment]]?._envColorRight || null,
        _envColorWhite: null,
        _envColorLeftBoost:
            ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeftBoost || null,
        _envColorRightBoost:
            ColorScheme[EnvironmentSchemeName[environment]]?._envColorRightBoost || null,
        _envColorWhiteBoost: null,
        _obstacleColor: ColorScheme[EnvironmentSchemeName[environment]]?._obstacleColor || null,
    };
    const hexColor: { [key: string]: string | null } = {
        _colorLeft: existColor._colorLeft ? RgbaToHex(existColor._colorLeft) : null,
        _colorRight: existColor._colorRight ? RgbaToHex(existColor._colorRight) : null,
        _envColorLeft: existColor._envColorLeft ? RgbaToHex(existColor._envColorLeft) : null,
        _envColorRight: existColor._envColorRight ? RgbaToHex(existColor._envColorRight) : null,
        _envColorWhite: null,
        _envColorLeftBoost: existColor._envColorLeftBoost
            ? RgbaToHex(existColor._envColorLeftBoost)
            : null,
        _envColorRightBoost: existColor._envColorRightBoost
            ? RgbaToHex(existColor._envColorRightBoost)
            : null,
        _envColorWhiteBoost: null,
        _obstacleColor: existColor._obstacleColor ? RgbaToHex(existColor._obstacleColor) : null,
    };
    const hasComponent: { [key: string]: boolean } = {
        noteColor: !!(customColor._colorLeft || customColor._colorRight || false),
        eventColor: !!(customColor._envColorLeft || customColor._envColorRight || false),
        eventBoostColor: !!(
            customColor._envColorLeftBoost ||
            customColor._envColorRightBoost ||
            false
        ),
        obstacleColor: !!(customColor._obstacleColor || false),
    };

    if (customColor._colorLeft) {
        hexColor._colorLeft = RgbaToHex(customColor._colorLeft);
    }
    if (customColor._colorRight) {
        hexColor._colorRight = RgbaToHex(customColor._colorRight);
    }
    if (customColor._envColorLeft) {
        hexColor._envColorLeft = RgbaToHex(customColor._envColorLeft);
    } else if (customColor._colorLeft) {
        hexColor._envColorLeft = RgbaToHex(customColor._colorLeft);
    }
    if (customColor._envColorRight) {
        hexColor._envColorRight = RgbaToHex(customColor._envColorRight);
    } else if (customColor._colorRight) {
        hexColor._envColorRight = RgbaToHex(customColor._colorRight);
    }

    // tricky stuff
    // need to display both boost if one exist
    let envBL!: string | null,
        envBR!: string | null,
        envBoost = false;
    if (customColor._envColorLeftBoost) {
        envBL = RgbaToHex(customColor._envColorLeftBoost);
        envBoost = true;
    } else {
        envBL = existColor._envColorLeftBoost
            ? RgbaToHex(existColor._envColorLeftBoost)
            : hexColor._envColorLeft;
    }
    if (customColor._envColorRightBoost) {
        envBR = RgbaToHex(customColor._envColorRightBoost);
        envBoost = true;
    } else {
        envBR = existColor._envColorRightBoost
            ? RgbaToHex(existColor._envColorRightBoost)
            : hexColor._envColorRight;
    }

    if (customColor._envColorWhite) {
        hexColor._envColorWhite = RgbaToHex(customColor._envColorWhite);
    }
    if (customColor._envColorWhiteBoost) {
        hexColor._envColorWhiteBoost = RgbaToHex(customColor._envColorWhiteBoost);
    }

    if (envBoost) {
        hexColor._envColorLeftBoost = envBL;
        hexColor._envColorRightBoost = envBR;
    }

    if (customColor._obstacleColor) {
        hexColor._obstacleColor = RgbaToHex(customColor._obstacleColor);
    }

    if (!hasComponent.noteColor) {
        hexColor._colorLeft = null;
        hexColor._colorRight = null;
    }
    if (!hasComponent.eventColor) {
        hexColor._envColorLeft = null;
        hexColor._envColorRight = null;
    }
    if (hasComponent.noteColor && !hasComponent.eventColor) {
        hexColor._envColorLeft = hexColor._colorLeft;
        hexColor._envColorRight = hexColor._colorRight;
    }
    if (!hasComponent.obstacleColor) {
        hexColor._obstacleColor = null;
    }

    const panel = UIPanel.create('max', 'none', true);
    for (const key in hexColor) {
        if (!hexColor[key]) {
            continue;
        }
        const container = document.createElement('div');
        const colorContainer = document.createElement('div');
        const textMonoContainer = document.createElement('div');
        const textContainer = document.createElement('div');

        colorContainer.className = 'info__color-dot';
        colorContainer.style.backgroundColor = hexColor[key] || '#000000';

        textMonoContainer.className = 'info__color-text info__color-text--monospace';
        textMonoContainer.textContent = `${hexColor[key]}`;

        textContainer.className = 'info__color-text';
        textContainer.textContent = ` -- ${
            ColorSchemeRename[key as keyof typeof ColorSchemeRename]
        }`;

        container.appendChild(colorContainer);
        container.appendChild(textMonoContainer);
        container.appendChild(textContainer);

        panel.appendChild(container);
    }
    displayTableRow(htmlTableCustomColor, [panel]);
}

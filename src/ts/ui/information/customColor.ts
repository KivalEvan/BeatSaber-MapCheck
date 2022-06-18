import UIPanel from '../helpers/panel';
import { rgbaToHex } from '../../utils';
import { IColorScheme, EnvironmentName } from '../../types/beatmap/shared';
import { ColorScheme, ColorSchemeRename, EnvironmentSchemeName } from '../../beatmap/shared';
import { htmlTableCustomColor } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setCustomColor(customColor?: IColorScheme, environment?: EnvironmentName): void {
    if (
        !customColor ||
        (!customColor._colorLeft &&
            !customColor._colorRight &&
            !customColor._envColorLeft &&
            !customColor._envColorLeftBoost &&
            !customColor._envColorRight &&
            !customColor._envColorRightBoost &&
            !customColor._obstacleColor)
    ) {
        hideTableRow(htmlTableCustomColor);
        return;
    }
    if (!environment) {
        environment = 'DefaultEnvironment';
    }
    const hexColor: { [key: string]: string | null } = {
        _colorLeft: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._colorLeft) || null,
        _colorRight: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._colorRight) || null,
        _envColorLeft: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeft) || null,
        _envColorRight: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorRight) || null,
        _envColorLeftBoost: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeftBoost) || null,
        _envColorRightBoost: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorRightBoost) || null,
        _obstacleColor: rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._obstacleColor) || null,
    };
    if (customColor._colorLeft) {
        hexColor._colorLeft = rgbaToHex(customColor._colorLeft);
    }
    if (customColor._colorRight) {
        hexColor._colorRight = rgbaToHex(customColor._colorRight);
    }
    if (customColor._envColorLeft) {
        hexColor._envColorLeft = rgbaToHex(customColor._envColorLeft);
    } else if (customColor._colorLeft) {
        hexColor._envColorLeft = rgbaToHex(customColor._colorLeft);
    }
    if (customColor._envColorRight) {
        hexColor._envColorRight = rgbaToHex(customColor._envColorRight);
    } else if (customColor._colorRight) {
        hexColor._envColorRight = rgbaToHex(customColor._colorRight);
    }

    // tricky stuff
    // need to display both boost if one exist
    let envBL!: string | null,
        envBR!: string | null,
        envBoost = false;
    if (customColor._envColorLeftBoost) {
        envBL = rgbaToHex(customColor._envColorLeftBoost);
        envBoost = true;
    } else {
        envBL =
            rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorLeftBoost) || hexColor._envColorLeft;
    }
    if (customColor._envColorRightBoost) {
        envBR = rgbaToHex(customColor._envColorRightBoost);
        envBoost = true;
    } else {
        envBR =
            rgbaToHex(ColorScheme[EnvironmentSchemeName[environment]]?._envColorRightBoost) || hexColor._envColorRight;
    }

    if (envBoost) {
        hexColor._envColorLeftBoost = envBL;
        hexColor._envColorRightBoost = envBR;
    }

    if (customColor._obstacleColor) {
        hexColor._obstacleColor = rgbaToHex(customColor._obstacleColor);
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
        textContainer.textContent = ` -- ${ColorSchemeRename[key as keyof typeof ColorSchemeRename]}`;

        container.appendChild(colorContainer);
        container.appendChild(textMonoContainer);
        container.appendChild(textContainer);

        panel.appendChild(container);
    }
    const content: HTMLElement[] = [panel];
    displayTableRow(htmlTableCustomColor, content);
}

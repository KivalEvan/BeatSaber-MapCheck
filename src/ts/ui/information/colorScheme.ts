import { ColorSchemeRename } from 'bsmap';
import { colorToHex } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { htmlTableColorScheme } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setColorScheme(colorSch?: types.wrapper.IWrapInfoColorScheme): void {
   if (
      !colorSch ||
      (!colorSch.saberLeftColor &&
         !colorSch.saberRightColor &&
         !colorSch.environment0Color &&
         !colorSch.environment0ColorBoost &&
         !colorSch.environment1Color &&
         !colorSch.environment1ColorBoost &&
         !colorSch.environmentWColor &&
         !colorSch.environmentWColorBoost &&
         !colorSch.obstaclesColor)
   ) {
      hideTableRow(htmlTableColorScheme);
      return;
   }

   const hexColor: { [key: string]: string | null } = {};

   hexColor.saberLeftColor = colorToHex(colorSch.saberLeftColor);
   hexColor.saberRightColor = colorToHex(colorSch.saberRightColor);
   hexColor.environment0Color = colorToHex(colorSch.environment0Color);
   hexColor.environment1Color = colorToHex(colorSch.environment1Color);
   hexColor.environment0ColorBoost = colorToHex(colorSch.environment0ColorBoost);
   hexColor.environment1ColorBoost = colorToHex(colorSch.environment1ColorBoost);
   hexColor.obstaclesColor = colorToHex(colorSch.obstaclesColor);

   if (colorSch.environmentWColor) {
      hexColor.environmentWColor = colorToHex(colorSch.environmentWColor);
   }
   if (colorSch.environmentWColorBoost) {
      hexColor.environmentWColorBoost = colorToHex(colorSch.environmentWColorBoost);
   }

   const content: HTMLElement[] = [];
   for (const key in hexColor) {
      if (!hexColor[key]) {
         continue;
      }
      const container = document.createElement('div');
      const colorContainer = document.createElement('div');
      const textMonoContainer = document.createElement('div');
      const textContainer = document.createElement('div');

      container.className = 'info__color';

      colorContainer.className = 'info__color-dot';
      colorContainer.style.backgroundColor = hexColor[key] || '#000000';

      textMonoContainer.className = 'info__color-text info__color-text--monospace';
      textMonoContainer.textContent = `${hexColor[key]}`;

      textContainer.className = 'info__color-text';
      textContainer.textContent = ` -- ${ColorSchemeRename[key as keyof typeof ColorSchemeRename]}`;

      container.appendChild(colorContainer);
      container.appendChild(textMonoContainer);
      container.appendChild(textContainer);

      content.push(container);
   }
   displayTableRow(htmlTableColorScheme, content);
}

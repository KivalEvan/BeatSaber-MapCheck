import UIPanel from '../helpers/panel';
import { colorToHex } from '../../utils';
import { CustomColorRename } from '../../beatmap/shared/colorScheme';
import { htmlTableColorScheme } from './constants';
import { displayTableRow, hideTableRow } from './helpers';
import { IWrapInfoColorScheme } from '../../types/beatmap/wrapper/info';

export function setColorScheme(colorSch?: IWrapInfoColorScheme): void {
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
      textContainer.textContent = ` -- ${CustomColorRename[key as keyof typeof CustomColorRename]}`;

      container.appendChild(colorContainer);
      container.appendChild(textMonoContainer);
      container.appendChild(textContainer);

      panel.appendChild(container);
   }
   displayTableRow(htmlTableColorScheme, [panel]);
}

import * as types from 'bsmap/types';

type BackgroundColorType = types.DifficultyName | 'none';
const BackgroundColor: Record<BackgroundColorType, string> = {
   none: '',
   'Expert+': 'accordion__label--bg-expertplus',
   ExpertPlus: 'accordion__label--bg-expertplus',
   Expert: 'accordion__label--bg-expert',
   Hard: 'accordion__label--bg-hard',
   Normal: 'accordion__label--bg-normal',
   Easy: 'accordion__label--bg-easy',
};

export class UIAccordion {
   static create(
      id: string,
      title: string,
      bg: BackgroundColorType,
      isFlex: boolean = false,
   ): HTMLElement {
      const accBase = document.createElement('div');
      accBase.className = 'accordion';

      const accButton = document.createElement('input');
      accButton.className = 'accordion__button';
      accButton.id = id;
      accButton.setAttribute('type', 'checkbox');

      const accLabel = document.createElement('label');
      accLabel.className = 'accordion__label unselectable';
      accLabel.htmlFor = id;
      accLabel.textContent = title;
      if (bg) {
         accLabel.classList.add(BackgroundColor[bg]);
      }

      const accCollapsible = document.createElement('div');
      accCollapsible.className = isFlex ? 'accordion__collapsible-flex' : 'accordion__collapsible';
      accCollapsible.id = id + '-content';

      accBase.appendChild(accButton);
      accBase.appendChild(accLabel);
      accBase.appendChild(accCollapsible);

      return accBase;
   }
}

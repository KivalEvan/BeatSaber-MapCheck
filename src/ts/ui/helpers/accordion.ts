import { UIBackgroundColorType, UIBackgroundColor } from '../../types/mapcheck/ui/accordion';

const prefix = 'accordion__';
const htmlAccordion: NodeListOf<HTMLInputElement> =
   document.querySelectorAll<HTMLInputElement>('.accordion__button');

export default {
   create: function (
      id: string,
      title: string,
      bg: UIBackgroundColorType,
      isFlex: boolean = false,
   ): HTMLElement {
      const accBase = document.createElement('div');
      accBase.className = 'accordion';

      const accButton = document.createElement('input');
      accButton.className = prefix + 'button';
      accButton.id = id;
      accButton.setAttribute('type', 'checkbox');

      const accLabel = document.createElement('label');
      accLabel.className = prefix + 'label unselectable';
      accLabel.htmlFor = id;
      accLabel.textContent = title;
      if (bg) {
         accLabel.classList.add(UIBackgroundColor[bg]);
      }

      const accCollapsible = document.createElement('div');
      accCollapsible.className = isFlex ? prefix + 'collapsible-flex' : prefix + 'collapsible';
      accCollapsible.id = id + '-content';

      accBase.appendChild(accButton);
      accBase.appendChild(accLabel);
      accBase.appendChild(accCollapsible);

      return accBase;
   },

   // FIXME: htmlAccordion should be redefined as create exist, but that doesn't matter because there's no use case for it as of yet
   show: function (id: string, check: boolean): void {
      htmlAccordion.forEach((elem) => {
         if (elem.id.endsWith(id)) {
            elem.checked = check;
         }
      });
   },
};

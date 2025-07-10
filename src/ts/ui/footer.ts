// i could just rename this to watermark but it only exist in sticky footer so...
// in the meantime, idk if i should slap these watermark on both the header and footer
// otherwise i dont need the queryselectorall
import { version, author } from '../../../package.json';

export class UIFooter {
   static #htmlWatermark: NodeListOf<HTMLElement>;
   static #htmlVersion: NodeListOf<HTMLElement>;

   static init(): void {
      UIFooter.#htmlWatermark = document.querySelectorAll<HTMLElement>('.link__watermark');
      UIFooter.#htmlVersion = document.querySelectorAll<HTMLElement>('.link__version');

      UIFooter.setVersion(author);
      UIFooter.setVersion(version);
   }

   static setWatermark(str: string): void {
      UIFooter.#htmlWatermark.forEach((elem) => {
         elem.textContent = (UIFooter.#isBirthday() ? 'Happy Birthday, ' : '') + str;
         if (UIFooter.#isBirthday()) {
            elem.title = `Happy ${
               new Date().getFullYear() - new Date('1999-06-10').getFullYear()
            } Birthday, 10th June`;
         }
      });
   }

   static setVersion(str: string): void {
      UIFooter.#htmlVersion.forEach((elem) => (elem.textContent = str));
   }

   static #isBirthday(): boolean {
      const date = new Date();
      return date.getMonth() == 5 && date.getDate() == 10;
   }
}

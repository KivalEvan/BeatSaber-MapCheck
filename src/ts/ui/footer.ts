// i could just rename this to watermark but it only exist in sticky footer so...
// in the meantime, idk if i should slap these watermark on both the header and footer
// otherwise i dont need the queryselectorall
const htmlWatermark: NodeListOf<HTMLElement> =
   document.querySelectorAll<HTMLElement>('.link__watermark');
const htmlVersion: NodeListOf<HTMLElement> =
   document.querySelectorAll<HTMLElement>('.link__version');

function isBirthday() {
   const date = new Date();
   return date.getMonth() == 5 && date.getDate() == 10;
}

export default {
   setWatermark: (str: string): void => {
      htmlWatermark.forEach((elem) => {
         elem.textContent = (isBirthday() ? 'Happy Birthday, ' : '') + str;
         if (isBirthday()) {
            elem.title = `Happy ${
               new Date().getFullYear() - new Date('1999-06-10').getFullYear()
            } Birthday, 10th June`;
         }
      });
   },
   setVersion: (str: string): void => {
      htmlVersion.forEach((elem) => (elem.textContent = str));
   },
};

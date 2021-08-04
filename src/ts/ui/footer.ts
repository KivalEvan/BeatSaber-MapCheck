// i could just rename this to watermark.ts but it only exist in sticky footer so...
// in the meantime, idk if i should slap these watermark on both the header and footer
// otherwise i dont need the queryselectorall
const logPrefix = 'UI Footer: ';

const htmlWatermark = document.querySelectorAll<HTMLElement>('.link__watermark');
const htmlVersion = document.querySelectorAll<HTMLElement>('.link__version');

if (!htmlWatermark.length || !htmlVersion.length) {
    console.error(logPrefix + 'missing part');
}

export const setWatermark = (str: string): void => {
    htmlWatermark.forEach((elem) => (elem.textContent = str));
};

export const setVersion = (str: string): void => {
    htmlVersion.forEach((elem) => (elem.textContent = str));
};

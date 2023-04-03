// i could just rename this to watermark but it only exist in sticky footer so...
// in the meantime, idk if i should slap these watermark on both the header and footer
// otherwise i dont need the queryselectorall
const logPrefix = 'UI Footer: ';

const htmlWatermark: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>('.link__watermark');
const htmlVersion: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>('.link__version');

if (!htmlWatermark.length || !htmlVersion.length) {
    console.error(logPrefix + 'missing part');
}

export default {
    setWatermark: (str: string): void => {
        htmlWatermark.forEach((elem) => (elem.textContent = str));
    },
    setVersion: (str: string): void => {
        htmlVersion.forEach((elem) => (elem.textContent = str));
    },
};

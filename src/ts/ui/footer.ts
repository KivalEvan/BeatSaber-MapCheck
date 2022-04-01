// i could just rename this to watermark.ts but it only exist in sticky footer so...
// in the meantime, idk if i should slap these watermark on both the header and footer
// otherwise i dont need the queryselectorall
const logPrefix = 'UI Footer: ';

export default new (class UIFooter {
    private htmlWatermark: NodeListOf<HTMLElement>;
    private htmlVersion: NodeListOf<HTMLElement>;

    constructor() {
        this.htmlWatermark = document.querySelectorAll<HTMLElement>('.link__watermark');
        this.htmlVersion = document.querySelectorAll<HTMLElement>('.link__version');

        if (!this.htmlWatermark.length || !this.htmlVersion.length) {
            console.error(logPrefix + 'missing part');
        }
    }

    setWatermark = (str: string): void => {
        this.htmlWatermark.forEach((elem) => (elem.textContent = str));
    };

    setVersion = (str: string): void => {
        this.htmlVersion.forEach((elem) => (elem.textContent = str));
    };
})();

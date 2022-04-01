import main from '../main';
import uiLoading from './loading';

const logPrefix = 'UI Intro: ';

export default new (class UIIntro {
    private htmlInputURL: HTMLInputElement;
    private htmlInputID: HTMLInputElement;
    private htmlInputHash: HTMLInputElement;
    private htmlInputSearchButton: HTMLInputElement;
    private htmlInputFile: HTMLInputElement;
    private htmlInputFileZone: HTMLInputElement;

    constructor() {
        this.htmlInputURL = document.querySelector('.input__intro-url')!;
        this.htmlInputID = document.querySelector('.input__intro-id')!;
        this.htmlInputHash = document.querySelector('.input__intro-hash')!;
        this.htmlInputSearchButton = document.querySelector('.input__search-button')!;
        this.htmlInputFile = document.querySelector('.input__file')!;
        this.htmlInputFileZone = document.querySelector('.input__file-zone')!;

        if (this.htmlInputURL) {
            this.htmlInputURL.addEventListener('keydown', this.introInputTextHandler);
        } else {
            throw new Error(logPrefix + 'URL input is missing');
        }
        if (this.htmlInputID) {
            this.htmlInputID.addEventListener('keydown', this.introInputTextHandler);
        } else {
            throw new Error(logPrefix + 'ID input is missing');
        }
        if (this.htmlInputHash) {
            this.htmlInputHash.addEventListener('keydown', this.introInputTextHandler);
        } else {
            throw new Error(logPrefix + 'Hash input is missing');
        }
        if (this.htmlInputSearchButton) {
            this.htmlInputSearchButton.addEventListener(
                'click',
                this.introButtonTextHandler
            );
        } else {
            throw new Error(logPrefix + 'search button is missing');
        }
        if (this.htmlInputFile) {
            this.htmlInputFile.addEventListener('change', this.inputFileHandler);
        } else {
            throw new Error(logPrefix + 'file input is missing');
        }
        if (this.htmlInputFileZone) {
            this.htmlInputFileZone.addEventListener('drop', this.inputFileDropHandler);
            this.htmlInputFileZone.addEventListener('dragover', this.dragOverHandler);
        } else {
            throw new Error(logPrefix + 'file drop zone is missing');
        }
    }

    private introInputTextHandler(ev: KeyboardEvent): void {
        const target = ev.target as HTMLInputElement;
        if (ev.key === 'Enter' && target.value !== '') {
            if (target.classList.contains('input__intro-url')) {
                main({ link: target.value });
            }
            if (target.classList.contains('input__intro-id')) {
                main({ id: target.value });
            }
            if (target.classList.contains('input__intro-hash')) {
                main({ hash: target.value });
            }
        }
    }

    private introButtonTextHandler(ev: Event): void {
        if (this.htmlInputURL && this.htmlInputURL.value !== '') {
            main({ link: this.htmlInputURL.value });
            return;
        }
        if (this.htmlInputID && this.htmlInputID.value !== '') {
            main({ id: this.htmlInputID.value });
            return;
        }
        if (this.htmlInputHash && this.htmlInputHash.value !== '') {
            main({ hash: this.htmlInputHash.value });
            return;
        }
    }

    // TODO: maybe break up into individual function
    private inputFileHandler(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        uiLoading.status('info', 'Reading file input', 0);
        const file = target.files ? target.files[0] : null;
        try {
            if (file == null) {
                uiLoading.status('info', 'No file input', 0);
                throw new Error('No file input');
            }
            if (
                file &&
                (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')
            ) {
                const fr = new FileReader();
                fr.readAsArrayBuffer(file);
                fr.addEventListener('load', () => {
                    main({ file });
                });
            } else {
                throw new Error('Unsupported file format, please enter zip file');
            }
        } catch (err) {
            uiLoading.status('error', err, 0);
            console.error(err);
        }
    }

    private inputFileDropHandler(ev: DragEvent): void {
        ev.preventDefault();
        ev.stopPropagation();
        try {
            if (ev.dataTransfer == null) {
                throw new Error('No file input');
            }
            if (ev.dataTransfer.items) {
                if (ev.dataTransfer.items[0].kind === 'file') {
                    let file = ev.dataTransfer.items[0].getAsFile() as File;
                    if (
                        file &&
                        (file.name.substr(-4) === '.zip' ||
                            file.name.substr(-4) === '.bsl')
                    ) {
                        const fr = new FileReader();
                        fr.readAsArrayBuffer(file);
                        fr.addEventListener('load', () => {
                            main({ file });
                        });
                    } else {
                        throw new Error(
                            'Unsupported file format, please enter zip file'
                        );
                    }
                }
            }
        } catch (err) {
            uiLoading.status('error', err, 0);
            console.error(err);
        }
    }

    private dragOverHandler(ev: Event): void {
        ev.preventDefault();
        ev.stopPropagation();
    }
})();

import * as ui from './ui';
import main from './main';

export default (() => {
    ui.init();

    const url = new URL(location.href);
    const link = url.searchParams.get('url');
    const id = url.searchParams.get('id');
    const hash = url.searchParams.get('hash');

    main({ link, id, hash });
})();

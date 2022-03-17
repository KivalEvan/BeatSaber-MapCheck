import { IContributor } from '../beatmap/shared/contributor';

export interface IContributorB64 extends IContributor {
    _base64?: string;
}

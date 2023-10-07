import { IContributor } from '../beatmap/shared/custom/contributor';

export interface IContributorB64 extends IContributor {
   _base64: string | null;
}

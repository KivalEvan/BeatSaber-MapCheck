import type { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import type { IWrapBeatmapAttribute } from '../../types/beatmap/wrapper/beatmap.ts';
import type { IWrapChainAttribute } from '../../types/beatmap/wrapper/chain.ts';
import { lerp, normalize } from '../../utils/math.ts';

export const enum ScoreType {
   NONE,
   NORMAL,
   ARC_HEAD,
   ARC_TAIL,
   CHAIN_HEAD,
   CHAIN_ELEMENT,
}

export const ScoreValue: { readonly [key in ScoreType]: number } = {
   [ScoreType.NONE]: 0,
   [ScoreType.NORMAL]: 115,
   [ScoreType.ARC_HEAD]: 115,
   [ScoreType.ARC_TAIL]: 115,
   [ScoreType.CHAIN_HEAD]: 85,
   [ScoreType.CHAIN_ELEMENT]: 20,
};

export function calculateScore(beatmap: IWrapBeatmapAttribute): number {
   let total = 0;
   let multiplier = 1;
   const elements = generateScoreElement(beatmap);
   for (let i = 0; i < elements.length; i++) {
      if (multiplier < 8 && i === -3 + multiplier * 4) {
         multiplier *= 2;
      }
      total += ScoreValue[elements[i].type] * multiplier;
   }
   return total;
}

function generateScoreElement(beatmap: IWrapBeatmapAttribute) {
   return [createNoteElement(beatmap), createChainElement(beatmap.difficulty.chains)]
      .flat()
      .sort((a, b) => a.time - b.time);
}

// for now I only care about arc head/tail and chain head, arc takes priority
// FIXME: use epsilon dammit
function createNoteElement(beatmap: IWrapBeatmapAttribute) {
   const mapArcHead = new Map<number, IWrapArcAttribute[]>();
   const mapArcTail = new Map<number, IWrapArcAttribute[]>();
   const mapChainHead = new Map<number, IWrapChainAttribute[]>();

   for (let i = 0; i < beatmap.difficulty.arcs.length; i++) {
      const arc = beatmap.difficulty.arcs[i];
      if (!mapArcHead.has(arc.time)) {
         mapArcHead.set(arc.time, []);
      }
      if (!mapArcTail.has(arc.tailTime)) {
         mapArcTail.set(arc.tailTime, []);
      }
      mapArcHead.get(arc.time)!.push(arc);
      mapArcTail.get(arc.tailTime)!.push(arc);
   }

   for (let i = 0; i < beatmap.difficulty.chains.length; i++) {
      const chain = beatmap.difficulty.chains[i];
      if (!mapChainHead.has(chain.time)) {
         mapChainHead.set(chain.time, []);
      }
      mapChainHead.get(chain.time)!.push(chain);
   }

   return beatmap.difficulty.colorNotes.map((n) => {
      const hasArc =
         mapArcHead
            .get(n.time)
            ?.some((a) => a.color === n.color && a.tailPosX === n.posX && a.tailPosY === n.posY) ||
         mapArcTail
            .get(n.time)
            ?.some((a) => a.color === n.color && a.tailPosX === n.posX && a.tailPosY === n.posY);
      if (hasArc) {
         return {
            type: ScoreType.ARC_HEAD,
            time: n.time,
         } as const;
      }

      const hasChain = mapChainHead
         .get(n.time)
         ?.some((c) => c.color === n.color && c.posX === n.posX && c.posY === n.posY);
      if (hasChain) {
         return {
            type: ScoreType.CHAIN_HEAD,
            time: n.time,
         } as const;
      }

      return {
         type: ScoreType.NORMAL,
         time: n.time,
      } as const;
   });
}

function createChainElement(chains: IWrapChainAttribute[]) {
   return chains.flatMap((c) => {
      if (c.sliceCount > 1) {
         return Array(c.sliceCount - 1).map((_, i) => {
            return {
               type: ScoreType.CHAIN_ELEMENT,
               time: lerp(normalize(i + 1, 0, c.sliceCount), c.time, c.tailTime),
            } as const;
         });
      }
      return [];
   });
}

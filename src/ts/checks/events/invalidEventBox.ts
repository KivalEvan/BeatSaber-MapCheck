import { EventList, IndexFilterType } from 'bsmap';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Invalid Event Box';
const description = 'Check for valid event box group usage.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'event',
   order: {
      input: ToolInputOrder.EVENTS_INVALID_EVENT_BOX,
      output: ToolOutputOrder.EVENTS_INVALID_EVENT_BOX,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   run,
};

const envFilterID: {
   [key in types.EnvironmentV3Name]?: Record<number, number>;
} = {
   EDMEnvironment: {
      0: 24,
      1: 24,
      2: 24,
      3: 24,
      4: 24,
      5: 24,
      6: 10,
      7: 10,
      8: 10,
      9: 10,
      10: 10,
      11: 10,
      12: 10,
      13: 10,
      14: 1,
      15: 1,
      16: 1,
      17: 1,
   },
   LizzoEnvironment: {
      0: 40,
      1: 16,
      2: 16,
      3: 16,
      4: 16,
      5: 16,
      6: 1,
      7: 1,
      8: 12,
      9: 12,
      10: 12,
      11: 6,
      12: 6,
      13: 14,
      14: 14,
      15: 4,
      16: 4,
      17: 3,
      18: 3,
      19: 14,
   },
   PyroEnvironment: {
      0: 3,
      1: 3,
      2: 5,
      3: 5,
      4: 3,
      5: 12,
      6: 48,
      7: 48,
      8: 4,
      9: 4,
      10: 3,
      11: 3,
      12: 10,
      13: 10,
   },
   TheSecondEnvironment: {
      0: 15,
      1: 24,
      2: 12,
      3: 12,
      4: 12,
      5: 12,
      6: 4,
      7: 4,
      8: 4,
      9: 4,
      10: 4,
      11: 4,
      12: 4,
      13: 4,
   },
   TheWeekndEnvironment: {
      0: 4,
      1: 4,
      2: 4,
      3: 4,
      4: 8,
      5: 4,
      6: 4,
      7: 12,
      8: 1,
      9: 6,
      10: 25,
      11: 25,
      12: 25,
      13: 25,
      14: 25,
      15: 25,
      16: 25,
      17: 25,
      18: 25,
      19: 25,
      20: 3,
      21: 3,
      22: 8,
      23: 8,
      29: 3,
      30: 3,
      31: 3,
      32: 3,
      33: 3,
      34: 3,
      35: 3,
      36: 3,
      37: 6,
      38: 6,
      40: 2,
   },
   RockMixtapeEnvironment: {
      0: 5,
      1: 5,
      2: 10,
      3: 10,
      4: 10,
      5: 10,
      6: 10,
      7: 10,
      8: 10,
      9: 10,
      10: 10,
      11: 10,
      12: 10,
      13: 10,
      14: 3,
      15: 10,
      16: 5,
      17: 5,
      18: 24,
      19: 24,
      20: 12,
      21: 12,
      22: 8,
      23: 8,
      24: 36,
      25: 3,
      26: 36,
      27: 3,
      28: 5,
      29: 2,
      30: 16,
      31: 4,
      32: 4,
      33: 4,
      34: 4,
      35: 2,
      36: 2,
      37: 2,
   },
   WeaveEnvironment: {
      0: 8,
      1: 8,
      2: 8,
      3: 8,
      4: 8,
      5: 8,
      6: 8,
      7: 8,
      8: 8,
      9: 8,
      10: 8,
      11: 8,
      12: 12,
      13: 12,
      14: 8,
      15: 8,
   },
   Dragons2Environment: {
      0: 24,
      1: 96,
      2: 35,
      3: 15,
      4: 8,
      5: 12,
      6: 12,
      7: 5,
      8: 5,
      9: 5,
      10: 5,
      11: 5,
      12: 5,
   },
   Panic2Environment: {
      0: 7,
      1: 7,
      2: 7,
      3: 7,
      4: 8,
      5: 8,
      6: 24,
      7: 24,
      8: 24,
      9: 6,
      10: 6,
      11: 6,
      12: 6,
      13: 14,
      14: 14,
      15: 2,
      16: 28,
      17: 28,
      18: 1,
      19: 1,
      20: 12,
      21: 1,
      22: 12,
      23: 1,
   },
};

// FIXME: EDMEnvironment special case 12 and 13 filter is 1 for rotation
function check(map: types.wrapper.IWrapLightshow, environment: types.EnvironmentAllName) {
   const defectID: types.wrapper.IWrapEventBoxGroup[] = [];
   const defectFilter: types.wrapper.IWrapEventBoxGroup[] = [];

   if (!envFilterID[environment as types.EnvironmentV3Name]) {
      return { defectID: [], defectFilter: [] };
   }
   const envV3 = environment as types.EnvironmentV3Name;
   const eventListEBG = EventList[envV3][1];

   const ebg = [
      ...map.lightColorEventBoxGroups,
      ...map.lightRotationEventBoxGroups,
      ...map.lightTranslationEventBoxGroups,
   ];
   for (const g of ebg) {
      if (!eventListEBG.includes(g.id)) {
         defectID.push(g);
      }
      for (const eb of g.boxes) {
         const filter = eb.filter;
         if (filter.type === IndexFilterType.STEP_AND_OFFSET) {
            if (filter.p0 > envFilterID[envV3]![g.id]) {
               defectFilter.push(g);
            }
         }
      }
   }

   return {
      defectID: defectID,
      defectFilter: defectFilter,
   };
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args.beatmap.data, args.beatmap.environment);

   const results: IToolOutput[] = [];
   if (result.defectID.length) {
      results.push({
         type: 'time',
         label: 'Invalid event box group ID',
         value: result.defectID,
         symbol: 'error',
      });
   }
   if (result.defectFilter.length) {
      results.push({
         type: 'time',
         label: 'Invalid event box filter',
         value: result.defectFilter,
         symbol: 'error',
      });
   }

   return results;
}

export default tool;

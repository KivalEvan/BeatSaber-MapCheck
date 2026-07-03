import {
   EnvironmentName,
   EnvironmentV3Name,
   IndexFilterType,
   GroupTrackDefinitions,
   wrapper,
} from 'bsmap';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

const name = 'Invalid Event Box';
const description = 'Check for valid event box group usage.';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck = {
   name,
   description,
   type: CheckType.EVENT,
   order: {
      input: CheckInputOrder.EVENTS_INVALID_EVENT_BOX,
      output: CheckOutputOrder.EVENTS_INVALID_EVENT_BOX,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(map: wrapper.IWrapLightshow, environment: EnvironmentName) {
   const defectID: wrapper.IWrapEventBoxGroup[] = [];
   const defectFilter: wrapper.IWrapEventBoxGroup[] = [];

   if (!GroupTrackDefinitions[environment as EnvironmentV3Name]) {
      return { defectID: [], defectFilter: [] };
   }
   const envV3 = environment as EnvironmentV3Name;
   const eventListEBG = Object.keys(GroupTrackDefinitions[envV3]).map(Number);

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
            const trackDef = GroupTrackDefinitions[envV3]![g.id];
            const maxFilter =
               (g.id === 12 || g.id === 13) && !trackDef ? 1 : (trackDef?.count ?? Infinity);
            if (filter.p0 > maxFilter) {
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

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args.beatmap.data.lightshow, args.beatmap.environment);

   const results: ICheckOutput[] = [];
   if (result.defectID.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid event box group ID',
         type: OutputType.TIME,
         value: result.defectID,
      });
   }
   if (result.defectFilter.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid event box filter',
         type: OutputType.TIME,
         value: result.defectFilter,
      });
   }

   return results;
}

export default tool;

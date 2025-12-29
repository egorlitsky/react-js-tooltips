import { tooltipStore } from './tooltipStore';

export const useTooltipStore = <T,>(
  selector: (state: ReturnType<typeof tooltipStore.getState>) => T,
) => {
  return tooltipStore(selector);
};

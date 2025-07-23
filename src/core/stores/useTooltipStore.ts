import { useStore } from 'react-stores';
import { tooltipStore } from '../stores/tooltipStore';

export const useTooltipStore = () => {
  return useStore(tooltipStore);
};

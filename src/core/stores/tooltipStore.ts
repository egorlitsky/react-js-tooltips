import { create } from 'zustand';
import { ITooltipInner } from '../../types/types';

export interface TooltipStoreState {
  tooltips: ITooltipInner[];
  awaitingTooltips: Omit<ITooltipInner, 'id'>[];
}

interface TooltipStoreActions {
  setState: (state: Partial<TooltipStoreState>) => void;
  resetState: () => void;
}

type TooltipStore = TooltipStoreState & TooltipStoreActions;

const initialState: TooltipStoreState = {
  tooltips: [], // currently displayed tooltips
  awaitingTooltips: [], // target is visible, but tooltip is not displayed
};

export const tooltipStore = create<TooltipStore>(
  (set) => ({
    ...initialState,
    setState: (partialState: Partial<TooltipStoreState>) =>
      set((state: TooltipStore) => ({ ...state, ...partialState })),
    resetState: () =>
      set((state: TooltipStore) => ({
        ...initialState,
        setState: state.setState,
        resetState: state.resetState,
      })),
  }),
);

import { Store } from "react-stores";
import { ITooltipInner } from "../types";

export interface TooltipStoreState {
  tooltips: ITooltipInner[];
  awaitingTooltips: Omit<ITooltipInner, "id">[];
}

export const tooltipStore = new Store<TooltipStoreState>(
  {
    tooltips: [], // currently displayed tooltips
    awaitingTooltips: [], // target is visible, but tooltip is not displayed
  },
  {
    name: "tooltipStore",
  }
);

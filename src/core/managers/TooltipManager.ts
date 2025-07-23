import { ITooltipInner } from "../types";
import { tooltipStore } from "../stores/tooltipStore";

export class TooltipManager {
  private static instance: TooltipManager;
  private id = 0;
  private uniqueIds = new Set<string>();

  private constructor() {}

  public static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }

    return TooltipManager.instance;
  }

  public getActiveTooltips(): ITooltipInner[] {
    return tooltipStore.state.tooltips;
  }

  public getAwaitingTooltips(): Omit<ITooltipInner, "id">[] {
    return tooltipStore.state.awaitingTooltips;
  }

  private incrementId = () => {
    this.id = this.id + 1;
  };

  public add = (tooltip: Omit<ITooltipInner, "id">): number | null => {
    const innerTooltip: ITooltipInner = {
      ...tooltip,
      id: this.id,
    };

    this.incrementId();

    if (innerTooltip.uniqueId) {
      if (this.uniqueIds.has(innerTooltip.uniqueId)) {
        return null;
      }

      this.uniqueIds.add(innerTooltip.uniqueId);
    }

    const tooltips = [...tooltipStore.state.tooltips, innerTooltip];

    tooltipStore.setState({
      tooltips: tooltips,
    });

    return innerTooltip.id;
  };

  public remove({ id, uniqueId }: { id: number; uniqueId?: string }): void {
    if (typeof uniqueId === "string") {
      this.uniqueIds.delete(uniqueId);
    }

    tooltipStore.setState({
      tooltips: tooltipStore.state.tooltips.filter(
        (tooltip) => tooltip.id !== id
      ),
    });
  }

  public removeByUniqueId(uniqueId: string): void {
    if (typeof uniqueId === "string") {
      this.uniqueIds.delete(uniqueId);
    }

    const tooltipToRemove = tooltipStore.state.tooltips.find(
      (tooltip) => tooltip.uniqueId === uniqueId
    );

    tooltipStore.setState({
      tooltips: tooltipStore.state.tooltips.filter(
        (tooltip) => tooltip.id !== tooltipToRemove?.id
      ),
    });
  }

  public removeAll(): void {
    this.uniqueIds.clear();
    tooltipStore.resetState();
  }

  public reset(): void {
    this.removeAll();
  }

  public addAwaitingTooltip(tooltip: Omit<ITooltipInner, "id">): void {
    if (tooltip.uniqueId) {
      if (this.uniqueIds.has(tooltip.uniqueId)) {
        return;
      }
    }

    const tooltips = [...tooltipStore.state.awaitingTooltips, tooltip];

    tooltipStore.setState({
      awaitingTooltips: tooltips,
    });
  }

  public activateAwaitingTooltip(uniqueId: string): boolean {
    const awaitingTooltip = tooltipStore.state.awaitingTooltips.find(
      (tooltip) => tooltip.uniqueId === uniqueId
    );
    const tooltip = tooltipStore.state.tooltips.find(
      (tooltip) => tooltip.uniqueId === uniqueId
    );

    if (awaitingTooltip && !tooltip) {
      this.add(awaitingTooltip);
      return true;
    } else {
      return false;
    }
  }

  public removeAwaitingTooltip(uniqueId: string): void {
    if (typeof uniqueId === "string") {
      this.uniqueIds.delete(uniqueId);
    }

    tooltipStore.setState({
      tooltips: tooltipStore.state.tooltips.filter(
        (tooltip) => tooltip.uniqueId !== uniqueId
      ),
      awaitingTooltips: tooltipStore.state.awaitingTooltips.filter(
        (tooltip) => tooltip.uniqueId !== uniqueId
      ),
    });
  }

  public isAwaitingTooltipActive(uniqueId: string): boolean {
    const tooltip = tooltipStore.state.tooltips.find(
      (tooltip) => tooltip.uniqueId === uniqueId
    );
    return tooltip !== undefined;
  }

  public repairAwaitingTooltip(uniqueId: string): void {
    if (this.isAwaitingTooltipActive(uniqueId)) {
      setTimeout(() => {
        this.activateAwaitingTooltip(uniqueId);
      }, TUTORIAL_TOOLTIP_REPAIR_TIMEOUT);
    }
  }
}

export const TUTORIAL_TOOLTIP_REPAIR_TIMEOUT = 1000 as const;

export const tooltipManager = TooltipManager.getInstance();

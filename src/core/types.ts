import React, { RefObject } from "react";

export interface ITooltipMethods {
  remove: () => void;
  open: () => void;
}

export interface ITooltipChildrenMethods {
  animateOut: (closeTooltipFn: () => void) => void;
  shakeTooltip: () => void;
}

interface IRenderOverlay {
  id: number;
  remove(): void;
  forceRemove?: () => void;
  setBlocker?: (value: boolean) => void;
}

export type TTooltipTarget = RefObject<HTMLDivElement | null>;
export type TRenderOverlayTooltip = {
  ref: React.RefObject<ITooltipChildrenMethods>;
  target: TTooltipTarget;
  disableAnimation?: boolean;
} & IRenderOverlay;
export type TRenderOverlayFunction = (
  tooltip: TRenderOverlayTooltip
) => React.ReactNode;

export type IRenderOverlayToolTip = {
  ref: React.RefObject<ITooltipChildrenMethods>;
  target: TTooltipTarget;
  disableAnimation?: boolean;
} & IRenderOverlay;

export interface ITooltipInner extends Partial<ITooltipAbstraction> {
  id: number;
  priority?: boolean;
  uniqueId?: string;
  renderOverlay: TRenderOverlayFunction;
  target: TTooltipTarget;
}

export interface ITooltipAbstraction {
  blocker: boolean;
  backdropColor?: string;
  disableAnimation?: boolean;
  target: TTooltipTarget;
  children:
    | ((options: {
        ref: React.RefObject<any>;
        remove: () => void;
        forceRemove?: () => void;
        setBlocker?: (value: boolean) => void;
        target?: TTooltipTarget;
        disableAnimation?: boolean;
      }) => React.ReactNode)
    | React.ReactNode;
  onClose: () => void;
  onOpen?: () => void;
}

export enum TooltipTriggerType {
  CLICK = "click", // by clicking a target / icon
  CODE = "code", // by some code - from another tooltip or manager
}

export enum TooltipPlacement {
  TOP = "top",
  LEFT = "left",
  BOTTOM = "bottom",
  RIGHT = "right",

  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",

  LEFT_TOP = "left-top",
  LEFT_BOTTOM = "left-bottom",
  RIGHT_TOP = "right-top",
  RIGHT_BOTTOM = "right-bottom",

  NONE = "none",
}

export enum AnchorPlacement {
  TOP = "top",
  LEFT = "left",
  BOTTOM = "bottom",
  RIGHT = "right",
  NONE = "none",
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}

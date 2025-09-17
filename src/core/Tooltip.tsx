import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";

import {
  ISize,
  TTooltipTarget,
  TooltipPlacement,
  PointerPlacement,
  ITooltipChildrenMethods,
} from "../types/types";

import {
  TOOLTIP_MAXIMUM_WIDTH,
  TOOLTIP_BORDER_RADIUS,
  TOOLTIP_MAXIMUM_HEIGHT,
  TOOLTIP_VERTICAL_MARGIN,
  TOOLTIP_DEFAULT_BACKGROUND_COLOR,
  TOOLTIP_SHAKE_ANIMATION_DURATION,
  TOOLTIP_OPACITY_ANIMATION_DURATION,
} from "./constants/constants";

import { TooltipPointer } from "./TooltipPointer";
import { getTooltipPosition } from "./utils/utils";

import { useOnLayout } from "./hooks/useOnLayout";
import { useMeasureByRef } from "./hooks/useMeasureByRef";
import useWindowDimensions from "./hooks/useWindowDimensions";

import styles from "./Tooltip.module.css";

interface IProps {
  width?: number;
  pointer?: boolean;
  borderRadius?: number;
  forcePointer?: boolean;
  target: TTooltipTarget;
  backgroundColor?: string;
  children: React.ReactNode;
  containerMaxWidth?: number;
  containerMaxHeight?: number;
  preferredPlacement?: TooltipPlacement;
}

export const Tooltip = forwardRef<ITooltipChildrenMethods, IProps>(
  (
    {
      width,
      target,
      children,
      pointer = true,
      preferredPlacement,
      forcePointer = true,
      borderRadius = TOOLTIP_BORDER_RADIUS,
      containerMaxWidth = TOOLTIP_MAXIMUM_WIDTH,
      containerMaxHeight = TOOLTIP_MAXIMUM_HEIGHT,
      backgroundColor = TOOLTIP_DEFAULT_BACKGROUND_COLOR,
    },
    ref
  ) => {
    const screenDimensions = useWindowDimensions();
    const tooltipRef = useRef<HTMLDivElement>(null);

    const { position: targetPosition, size: targetSize } =
      useMeasureByRef(target);

    const [shake, setShake] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasMeasured, setHasMeasured] = useState(false);
    const [contentSize, setContentSize] = useState<ISize | null>(null);

    useOnLayout(tooltipRef, (rect) => {
      rect && setContentSize({ width: rect.width, height: rect.height });
      setHasMeasured(true);
    });

    const tooltipPosition = useMemo(() => {
      if (targetPosition && targetSize && contentSize) {
        return getTooltipPosition({
          contentSize,
          targetSize,
          targetPosition,
          preferredPlacement,
          screenDimensions,
          forcePointer,
          pointer,
        });
      }
      return null;
    }, [
      contentSize,
      preferredPlacement,
      screenDimensions,
      targetPosition,
      targetSize,
    ]);

    useEffect(() => {
      if (tooltipPosition && hasMeasured) {
        requestAnimationFrame(() => setIsVisible(true));
      }
    }, [tooltipPosition, hasMeasured]);

    const animateOut = useCallback((cb: Function) => {
      setIsVisible(false);
      if (cb) cb();

      /*
        setTimeout(() => {
          if (cb) cb();
        }, TOOLTIP_OPACITY_ANIMATION_DURATION);
      */
    }, []);

    const shakeTooltip = useCallback(() => {
      setShake(true);
      setTimeout(() => setShake(false), TOOLTIP_SHAKE_ANIMATION_DURATION);
    }, []);

    useImperativeHandle(ref, () => ({
      animateOut,
      shakeTooltip,
    }));

    return (
      <div
        className={[
          styles.tooltipContainer,
          isVisible && styles.tooltipVisible,
          shake && styles.shake,
        ].join(" ")}
      >
        {tooltipPosition?.pointerPosition &&
          tooltipPosition.pointerPlacement !== PointerPlacement.NONE && (
            <TooltipPointer
              isVisible={isVisible}
              backgroundColor={backgroundColor}
              position={tooltipPosition.pointerPosition}
              placement={tooltipPosition.pointerPlacement}
            />
          )}
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            left: tooltipPosition?.x,
            top: tooltipPosition?.y,
            width: width || undefined,
            maxWidth:
              containerMaxWidth >= screenDimensions.width
                ? screenDimensions.width - TOOLTIP_VERTICAL_MARGIN * 2
                : containerMaxWidth,
            maxHeight: containerMaxHeight,
            backgroundColor,
            borderRadius,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? "auto" : "none",
            transition: `opacity ${TOOLTIP_OPACITY_ANIMATION_DURATION}ms ease-in-out`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

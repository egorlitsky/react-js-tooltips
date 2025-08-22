import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useEscape } from "./hooks/useEscape";
import { TooltipBackDrop } from "./TooltipBackDrop";
import useWindowDimensions from "./hooks/useWindowDimensions";
import {
  ITooltipMethods,
  ITooltipAbstraction,
  ITooltipChildrenMethods,
} from "./types";

export const TooltipAbstraction: React.ForwardRefExoticComponent<ITooltipAbstraction> =
  forwardRef<ITooltipMethods, ITooltipAbstraction>((props, ref) => {
    const {
      children,
      onClose,
      onOpen,
      target,
      disableAnimation,
      backdropColor = "rgba(0, 0, 0, 0.01)",
      blocker: blockerProp = false,
    } = props;

    const tooltipRef = useRef<ITooltipChildrenMethods>(null);
    const [blocker, setBlocker] = useState(blockerProp);

    const { height: screenHeight, width: screenWidth } = useWindowDimensions();
    const [orientation] = useState(
      screenWidth > screenHeight ? "landscape" : "portrait"
    );

    useEffect(() => {
      const newOrientation =
        screenWidth > screenHeight ? "landscape" : "portrait";
      if (orientation !== newOrientation) {
        onClose?.();
      }
    }, [orientation, screenHeight, screenWidth]);

    const open = useCallback(() => {
      if (onOpen) {
        onOpen();
      }
    }, [onOpen]);

    const closeTooltip = useCallback(
      (closeCallback?: () => void) => {
        if (disableAnimation) {
          onClose();
          typeof closeCallback === "function" && closeCallback();
        } else {
          tooltipRef.current?.animateOut(() => {
            onClose();
            typeof closeCallback === "function" && closeCallback();
          });
        }
      },
      [disableAnimation, onClose, tooltipRef]
    );

    const onBackDropPress = useCallback(() => {
      if (blocker) {
        !disableAnimation && tooltipRef.current?.shakeTooltip();
      } else {
        closeTooltip();
      }
    }, [blocker, closeTooltip, disableAnimation, tooltipRef]);

    const remove = useCallback(
      (closeCallback?: () => void) => {
        closeTooltip(closeCallback);
      },
      [closeTooltip]
    );

    const forceRemove = useCallback(() => {
      closeTooltip();
    }, [closeTooltip]);

    useEscape(remove, !blocker);

    useImperativeHandle(
      ref,
      () => ({
        remove,
        open,
      }),
      [remove]
    );

    useEffect(() => {
      open();
    }, []);

    return (
      <>
        <TooltipBackDrop
          onBackDropPress={onBackDropPress}
          backgroundColor={backdropColor}
        />
        {typeof children === "function"
          ? children({
              ref: tooltipRef,
              remove,
              forceRemove,
              setBlocker,
              target,
              disableAnimation,
            })
          : children}
      </>
    );
  });

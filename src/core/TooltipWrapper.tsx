import React, { useCallback, useEffect, useRef, useState } from "react";

import { ITooltipInner, TooltipTriggerType } from "../types/types";
import { useTooltipManager } from "./hooks/useTooltipManager";

interface IProps extends Omit<ITooltipInner, "id" | "target"> {
  blocker?: boolean;
  children: React.ReactNode;
  disableAnimation?: boolean;
  triggerType?: TooltipTriggerType;
  className?: string;
  uniqueId?: string;
  onTargetClick?: () => void;
}

export const TooltipWrapper = (props: IProps) => {
  const tooltip = useTooltipManager();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [tooltipId, setTooltipId] = useState<number | null>(null);

  const {
    blocker = false,
    children,
    onTargetClick: onTargetClickProp,
    className,
    triggerType = TooltipTriggerType.CLICK,
    uniqueId,
  } = props;

  const onTargetClick = useCallback(() => {
    if (targetRef.current) {
      onTargetClickProp?.();
      setTooltipId(
        tooltip.add({
          ...props,
          target: targetRef,
        })
      );
    }
  }, [props, targetRef, tooltip]);

  useEffect(() => {
    return () => {
      uniqueId && tooltip.removeByUniqueId(uniqueId);
      !targetRef?.current &&
        tooltipId !== null &&
        tooltip.remove({ id: tooltipId });
    };
  }, [targetRef, tooltipId]);

  useEffect(() => {
    if (triggerType === TooltipTriggerType.CODE) {
      if (!uniqueId) {
        throw new Error(
          "TooltipWrapper: uniqueId is required when triggerType is CODE"
        );
      }

      // once target is mounted, add tooltip to waiting list
      tooltip.addAwaitingTooltip({
        ...props,
        blocker,
        target: targetRef,
      });

      return () => {
        // once target is unmounted, remove tooltip from waiting list
        tooltip.removeAwaitingTooltip(uniqueId);
      };
    }
  }, [triggerType, uniqueId, props, blocker, targetRef, tooltip]);

  return triggerType === TooltipTriggerType.CLICK ? (
    <span style={styles.tooltipWrapper} ref={targetRef} className={className} onClick={onTargetClick}>
      {children}
    </span>
  ) : (
    <span style={styles.tooltipWrapper} ref={targetRef} className={className}>
      {children}
    </span>
  );
};

const styles = {
  tooltipWrapper: {
    display: 'inline-block'
  }
}

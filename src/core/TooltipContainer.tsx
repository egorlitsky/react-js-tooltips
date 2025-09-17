import React from "react";

import { ITooltipInner } from "../types/types";
import styles from "./TooltipContainer.module.css";
import { TooltipAbstraction } from "./TooltipAbstraction";
import { useTooltipStore } from "./stores/useTooltipStore";
import { tooltipManager } from "./managers/TooltipManager";

interface ITooltipContainer {
  disableAnimation?: boolean;
}

export const TooltipContainer: React.FC<ITooltipContainer> = (props) => {
  const { disableAnimation: disableAnimationForAllTooltips } = props;

  const { tooltips } = useTooltipStore();

  const renderContent = (tooltip: ITooltipInner) => {
    const {
      id,
      blocker,
      backdropColor,
      disableAnimation: disableAnimationPerTooltip,
      target,
      onOpen,
      onClose,
      renderOverlay: renderTooltip,
    } = tooltip;

    const disableAnimation =
      typeof disableAnimationPerTooltip === "boolean"
        ? disableAnimationPerTooltip
        : disableAnimationForAllTooltips;

    return (
      <TooltipAbstraction
        key={id}
        blocker={!!blocker}
        backdropColor={backdropColor}
        target={target}
        disableAnimation={disableAnimation}
        onOpen={onOpen}
        onClose={(removeDone?: () => void) => {
          // removeDone is called after fade-out animation
          if (typeof removeDone === 'function') {
            removeDone();
          }
          tooltipManager.remove({ id: tooltip.id, uniqueId: tooltip.uniqueId });
          if (typeof onClose === "function") {
            onClose();
          }
        }}
      >
        {({ ref, remove, forceRemove, setBlocker }) => {
          return renderTooltip?.({
            ref,
            id: tooltip.id,
            remove,
            forceRemove,
            setBlocker,
            target,
            disableAnimation,
          });
        }}
      </TooltipAbstraction>
    );
  };

  return tooltips.length ? (
    <>
      {tooltips
        .filter((tooltip) => tooltip?.target?.current !== null)
        .map((tooltip, index) => (
          <div className={styles.container} key={index}>
            {renderContent(tooltip)}
          </div>
        ))}
    </>
  ) : null;
};

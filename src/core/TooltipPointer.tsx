import React from "react";
import { IPosition, PointerPlacement } from "../types/types";

import {
  TOOLTIP_POINTER_VERTICAL_WIDTH,
  TOOLTIP_POINTER_VERTICAL_HEIGHT,
  TOOLTIP_POINTER_HORIZONTAL_WIDTH,
  TOOLTIP_DEFAULT_BACKGROUND_COLOR,
  TOOLTIP_POINTER_HORIZONTAL_HEIGHT,
} from "./constants/constants";

import styles from "./TooltipPointer.module.css";

interface IProps {
  backgroundColor?: string;
  isVisible: boolean;
  placement: PointerPlacement;
  position: IPosition;
}

export const TooltipPointer: React.FC<IProps> = (props: IProps) => {
  const {
    backgroundColor = TOOLTIP_DEFAULT_BACKGROUND_COLOR,
    isVisible,
    placement,
    position,
  } = props;

  return (
    <div
      className={styles.tooltipPointer}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width:
          placement === PointerPlacement.TOP ||
          placement === PointerPlacement.BOTTOM
            ? TOOLTIP_POINTER_HORIZONTAL_WIDTH
            : TOOLTIP_POINTER_VERTICAL_WIDTH,
        height:
          placement === PointerPlacement.TOP ||
          placement === PointerPlacement.BOTTOM
            ? TOOLTIP_POINTER_HORIZONTAL_HEIGHT
            : TOOLTIP_POINTER_VERTICAL_HEIGHT,
        pointerEvents: isVisible ? "auto" : "none",
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
    >
      {placement === PointerPlacement.TOP && (
        <svg
          width={TOOLTIP_POINTER_HORIZONTAL_WIDTH}
          height={TOOLTIP_POINTER_HORIZONTAL_HEIGHT}
          viewBox={`0 0 ${TOOLTIP_POINTER_HORIZONTAL_WIDTH} ${TOOLTIP_POINTER_HORIZONTAL_HEIGHT}`}
        >
          <polygon
            points={`0,0 ${
              TOOLTIP_POINTER_HORIZONTAL_WIDTH / 2
            },${TOOLTIP_POINTER_HORIZONTAL_HEIGHT} ${TOOLTIP_POINTER_HORIZONTAL_WIDTH},0`}
            fill={backgroundColor}
          />
        </svg>
      )}
      {placement === PointerPlacement.BOTTOM && (
        <svg
          width={TOOLTIP_POINTER_HORIZONTAL_WIDTH}
          height={TOOLTIP_POINTER_HORIZONTAL_HEIGHT}
          viewBox={`0 0 ${TOOLTIP_POINTER_HORIZONTAL_WIDTH} ${TOOLTIP_POINTER_HORIZONTAL_HEIGHT}`}
        >
          <polygon
            points={`0,${TOOLTIP_POINTER_HORIZONTAL_HEIGHT} ${
              TOOLTIP_POINTER_HORIZONTAL_WIDTH / 2
            },0 ${TOOLTIP_POINTER_HORIZONTAL_WIDTH},${TOOLTIP_POINTER_HORIZONTAL_HEIGHT}`}
            fill={backgroundColor}
          />
        </svg>
      )}
      {placement === PointerPlacement.RIGHT && (
        <svg
          width={TOOLTIP_POINTER_VERTICAL_WIDTH}
          height={TOOLTIP_POINTER_VERTICAL_HEIGHT}
          viewBox={`0 0 ${TOOLTIP_POINTER_VERTICAL_WIDTH} ${TOOLTIP_POINTER_VERTICAL_HEIGHT}`}
        >
          <polygon
            points={`${TOOLTIP_POINTER_VERTICAL_WIDTH},0 0,${
              TOOLTIP_POINTER_VERTICAL_HEIGHT / 2
            } ${TOOLTIP_POINTER_VERTICAL_WIDTH},${TOOLTIP_POINTER_VERTICAL_HEIGHT}`}
            fill={backgroundColor}
          />
        </svg>
      )}
      {placement === PointerPlacement.LEFT && (
        <svg
          width={TOOLTIP_POINTER_VERTICAL_WIDTH}
          height={TOOLTIP_POINTER_VERTICAL_HEIGHT}
          viewBox={`0 0 ${TOOLTIP_POINTER_VERTICAL_WIDTH} ${TOOLTIP_POINTER_VERTICAL_HEIGHT}`}
        >
          <polygon
            points={`0,0 ${TOOLTIP_POINTER_VERTICAL_WIDTH},${
              TOOLTIP_POINTER_VERTICAL_HEIGHT / 2
            } 0,${TOOLTIP_POINTER_VERTICAL_HEIGHT}`}
            fill={backgroundColor}
          />
        </svg>
      )}
    </div>
  );
};

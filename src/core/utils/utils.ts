import {
  TOOLTIP_VERTICAL_MARGIN,
  TOOLTIP_HORIZONTAL_MARGIN,
  TOOLTIP_OFFSET_FOR_POINTER,
  TOOLTIP_POINTER_VERTICAL_WIDTH,
  TOOLTIP_POINTER_VERTICAL_HEIGHT,
  TOOLTIP_POINTER_HORIZONTAL_WIDTH,
  TOOLTIP_POINTER_HORIZONTAL_HEIGHT,
} from "../constants/constants";

import { PointerPlacement, IPosition, ISize, TooltipPlacement } from "../types";

interface ITooltipPositionParams {
  targetPosition: IPosition;
  targetSize: ISize;
  contentSize: ISize;
  screenDimensions: ISize;
  pointer?: boolean;
  forcePointer?: boolean;
  preferredPlacement?: TooltipPlacement;
}

export interface ITooltipPositionResult extends IPosition {
  pointerPlacement: PointerPlacement;
  pointerPosition: IPosition | null;
}

interface IPointerSize {
  hWidth: number;
  hHeight: number;
  vWidth: number;
  vHeight: number;
}

function roundToNearestPixel(value: number): number {
  const scale = window.devicePixelRatio || 1;
  return Math.round(value * scale) / scale;
}

const round = (value: number): number => roundToNearestPixel(value);

const getPointerSizes = (pointer: boolean): IPointerSize => {
  if (!pointer) {
    return {
      hWidth: 0,
      hHeight: 0,
      vWidth: 0,
      vHeight: 0,
    };
  }

  return {
    // horizontal pointer (TOP/BOTTOM tooltip placement)
    hWidth: TOOLTIP_POINTER_HORIZONTAL_WIDTH,
    hHeight: TOOLTIP_POINTER_HORIZONTAL_HEIGHT,

    // vertical pointer (LEFT/RIGHT tooltip placement)
    vWidth: TOOLTIP_POINTER_VERTICAL_WIDTH,
    vHeight: TOOLTIP_POINTER_VERTICAL_HEIGHT,
  };
};

/**
 * Checks dimensions and returns the most suitable placement for the tooltip.
 * @param {ITooltipPositionParams} tooltipPositionParams
 * @param {IPointerSize} pointerSizes
 * @returns {TooltipPlacement}
 */
const getSuitablePlacement = (
  tooltipPositionParams: ITooltipPositionParams,
  pointerSizes: IPointerSize
): TooltipPlacement => {
  const {
    contentSize,
    preferredPlacement,
    screenDimensions,
    targetPosition,
    targetSize,
  } = tooltipPositionParams;

  const { x, y } = targetPosition;
  const targetX = round(x);
  const targetY = round(y);

  const { width: targetWidth, height: targetHeight } = targetSize;
  const { width: overlayWidth, height: overlayHeight } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenDimensions;

  const isFitTop = targetY - (overlayHeight + pointerSizes.hHeight) >= 0;
  const isFitBottom =
    targetY + targetHeight + (overlayHeight + pointerSizes.hHeight) <=
    screenHeight;

  const isFitLeft = targetX - (overlayWidth + pointerSizes.vWidth) >= 0;
  const isFitRight =
    targetX + targetWidth + (overlayWidth + pointerSizes.vWidth) <= screenWidth;

  // extra check for top and bottom placement
  const isFitHorizontally =
    targetX + targetWidth / 2 - overlayWidth / 2 > 0 &&
    targetX + targetWidth / 2 + overlayWidth / 2 < screenWidth;

  // extra check for left and right placement
  const isFitVertically =
    targetY + targetHeight / 2 - overlayHeight / 2 > 0 &&
    targetY + targetHeight / 2 + overlayHeight / 2 < screenHeight;

  const fitMap: {
    // boolean "fit" flags for each placement
    [key: string]: boolean;
  } = {
    [TooltipPlacement.TOP]: isFitTop && isFitHorizontally,
    [TooltipPlacement.LEFT]: isFitLeft && isFitVertically,
    [TooltipPlacement.BOTTOM]: isFitBottom && isFitHorizontally,
    [TooltipPlacement.RIGHT]: isFitRight && isFitVertically,
  };

  // check if the preferred placement is possible
  if (preferredPlacement && fitMap[preferredPlacement]) {
    return preferredPlacement;
  }

  // check if any of classic placements is possible
  if (Object.values(fitMap).some((isFit) => isFit)) {
    return Object.keys(fitMap).filter(
      (key) => fitMap[key]
    )[0] as TooltipPlacement;
  } else {
    const screenCenterX = round(screenWidth / 2);
    const screenCenterY = round(screenHeight / 2);

    // check if some exotic placement is possible
    if (
      targetX >= screenCenterX &&
      targetY > overlayHeight + pointerSizes.hHeight
    ) {
      return TooltipPlacement.TOP_LEFT;
    } else if (
      targetX < screenCenterX &&
      targetY > overlayHeight + pointerSizes.hHeight
    ) {
      return TooltipPlacement.TOP_RIGHT;
    } else if (
      targetX >= screenCenterX &&
      targetY + targetHeight + overlayHeight + pointerSizes.hHeight <
        screenHeight
    ) {
      return TooltipPlacement.BOTTOM_LEFT;
    } else if (
      targetX < screenCenterX &&
      targetY + targetHeight + overlayHeight + pointerSizes.hHeight <
        screenHeight
    ) {
      return TooltipPlacement.BOTTOM_RIGHT;
    } else if (
      isFitLeft &&
      targetY >= screenCenterY &&
      targetY -
        overlayHeight +
        Math.round(targetHeight / 2) +
        TOOLTIP_OFFSET_FOR_POINTER * 8 >
        0
    ) {
      return TooltipPlacement.LEFT_TOP;
    } else if (
      isFitLeft &&
      targetY < screenCenterY &&
      targetY +
        overlayHeight -
        Math.round(targetHeight / 2) -
        TOOLTIP_OFFSET_FOR_POINTER * 3 <
        screenHeight
    ) {
      return TooltipPlacement.LEFT_BOTTOM;
    } else if (
      isFitRight &&
      targetY >= screenCenterY &&
      targetY -
        overlayHeight +
        Math.round(targetHeight / 2) +
        TOOLTIP_OFFSET_FOR_POINTER * 7 >
        0
    ) {
      return TooltipPlacement.RIGHT_TOP;
    } else if (
      isFitRight &&
      targetY < screenCenterY &&
      targetY + overlayHeight < screenHeight
    ) {
      return TooltipPlacement.RIGHT_BOTTOM;
    }
  }

  return TooltipPlacement.NONE;
};

/**
 * Returns the position of the tooltip based on the suitable placement.
 * @param placement
 * @param tooltipPositionParams
 * @param pointerSizes
 * @returns {ITooltipPositionResult}
 */
const getPositionByPlacement = (
  placement: TooltipPlacement,
  tooltipPositionParams: ITooltipPositionParams,
  pointerSizes: IPointerSize
): ITooltipPositionResult => {
  const {
    forcePointer,
    contentSize,
    screenDimensions,
    targetPosition,
    targetSize,
  } = tooltipPositionParams;

  const { x: targetX, y: targetY } = targetPosition;
  const { width: targetWidth, height: targetHeight } = targetSize;
  const { width: overlayWidth, height: overlayHeight } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenDimensions;

  let x: number;
  let y: number;

  switch (placement) {
    case TooltipPlacement.TOP:
      return {
        x: round(
          targetX + Math.round(targetWidth / 2) - Math.round(overlayWidth / 2)
        ),
        y: round(targetY - (overlayHeight + pointerSizes.hHeight)),
        pointerPlacement: PointerPlacement.TOP,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.TOP,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.TOP_LEFT:
      x = round(
        targetX - overlayWidth + targetWidth + TOOLTIP_OFFSET_FOR_POINTER
      );
      return {
        x: x < 0 ? 0 + TOOLTIP_HORIZONTAL_MARGIN : x,
        y: round(targetY - (overlayHeight + pointerSizes.hHeight)),
        pointerPlacement: PointerPlacement.TOP,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.TOP,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.TOP_RIGHT:
      x = round(targetX - TOOLTIP_OFFSET_FOR_POINTER);
      return {
        x:
          x < 0 || x + overlayWidth > screenWidth
            ? TOOLTIP_HORIZONTAL_MARGIN
            : x,
        y: round(targetY - (overlayHeight + pointerSizes.hHeight)),
        pointerPlacement: PointerPlacement.TOP,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.TOP,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.BOTTOM:
      return {
        x: round(
          targetX + Math.round(targetWidth / 2) - Math.round(overlayWidth / 2)
        ),
        y: round(targetY + targetHeight + pointerSizes.hHeight),
        pointerPlacement: PointerPlacement.BOTTOM,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.BOTTOM,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.BOTTOM_LEFT:
      x = round(
        targetX - overlayWidth + targetWidth + TOOLTIP_OFFSET_FOR_POINTER
      );
      return {
        x: x < 0 ? 0 + TOOLTIP_HORIZONTAL_MARGIN : x,
        y: round(targetY + targetHeight + pointerSizes.hHeight),
        pointerPlacement: PointerPlacement.BOTTOM,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.BOTTOM,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.BOTTOM_RIGHT:
      x = round(targetX - TOOLTIP_OFFSET_FOR_POINTER);
      return {
        x:
          x < 0 || x + overlayWidth > screenWidth
            ? 0 + TOOLTIP_HORIZONTAL_MARGIN
            : x,
        y: round(targetY + targetHeight + pointerSizes.hHeight),
        pointerPlacement: PointerPlacement.BOTTOM,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.BOTTOM,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.LEFT:
      return {
        x: round(targetX - (overlayWidth + pointerSizes.vWidth)),
        y: round(
          targetY + Math.round(targetHeight / 2) - Math.round(overlayHeight / 2)
        ),
        pointerPlacement: PointerPlacement.LEFT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.LEFT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.LEFT_TOP:
      y =
        targetY -
        overlayHeight +
        Math.round(targetHeight / 2) +
        TOOLTIP_OFFSET_FOR_POINTER * 8;
      y = y < 0 ? 0 : y;
      y = round(
        y + overlayHeight > screenHeight ? screenHeight - overlayHeight : y
      );
      return {
        x: round(targetX - (overlayWidth + pointerSizes.vWidth)),
        y,
        pointerPlacement: PointerPlacement.LEFT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.LEFT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.LEFT_BOTTOM:
      y =
        targetY - Math.round(targetHeight / 2) - TOOLTIP_OFFSET_FOR_POINTER * 3;
      y = y < 0 ? 0 : y;
      y = round(
        y + overlayHeight > screenHeight ? screenHeight - overlayHeight : y
      );
      return {
        x: round(targetX - (overlayWidth + pointerSizes.vWidth)),
        y,
        pointerPlacement: PointerPlacement.LEFT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.LEFT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.RIGHT:
      return {
        x: round(targetX + targetWidth + pointerSizes.vWidth),
        y: round(
          targetY + Math.round(targetHeight / 2) - Math.round(overlayHeight / 2)
        ),
        pointerPlacement: PointerPlacement.RIGHT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.RIGHT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.RIGHT_TOP:
      y =
        targetY -
        overlayHeight +
        Math.round(targetHeight / 2) +
        TOOLTIP_OFFSET_FOR_POINTER * 7;
      y = y < 0 ? 0 : y;
      y = round(
        y + overlayHeight > screenHeight ? screenHeight - overlayHeight : y
      );
      return {
        x: round(
          targetX +
            targetWidth +
            pointerSizes.vWidth -
            TOOLTIP_OFFSET_FOR_POINTER
        ),
        y,
        pointerPlacement: PointerPlacement.RIGHT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.RIGHT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.RIGHT_BOTTOM:
      y = targetY - Math.round(targetHeight / 2) - TOOLTIP_OFFSET_FOR_POINTER;
      y = y < 0 ? 0 : y;
      y = round(
        y + overlayHeight > screenHeight ? screenHeight - overlayHeight : y
      );
      return {
        x: round(
          targetX +
            targetWidth +
            pointerSizes.vWidth -
            TOOLTIP_OFFSET_FOR_POINTER
        ),
        y,
        pointerPlacement: PointerPlacement.RIGHT,
        pointerPosition: getTooltipPointerPosition(
          targetPosition,
          targetSize,
          PointerPlacement.RIGHT,
          screenDimensions,
          forcePointer
        ),
      };
    case TooltipPlacement.NONE:
    default:
      return {
        x: TOOLTIP_HORIZONTAL_MARGIN,
        y: TOOLTIP_VERTICAL_MARGIN,
        pointerPlacement: PointerPlacement.NONE,
        pointerPosition: null,
      };
  }
};

export const getTooltipPosition = (
  params: ITooltipPositionParams
): ITooltipPositionResult => {
  const { pointer = false } = params;
  const pointerSizes = getPointerSizes(pointer);
  const placement = getSuitablePlacement(params, pointerSizes);
  return getPositionByPlacement(placement, params, pointerSizes);
};

export const getTooltipPointerPosition = (
  targetPosition: IPosition,
  targetSize: ISize,
  pointerPlacement: PointerPlacement,
  screenDimensions: ISize,
  forcePointer = false
): IPosition | null => {
  const { x: targetX, y: targetY } = targetPosition;
  const { width: targetWidth, height: targetHeight } = targetSize;

  if (
    !forcePointer &&
    (targetPosition?.x < TOOLTIP_OFFSET_FOR_POINTER ||
      targetPosition?.y < TOOLTIP_OFFSET_FOR_POINTER ||
      targetPosition?.x + targetWidth >
        screenDimensions.width - TOOLTIP_OFFSET_FOR_POINTER ||
      targetPosition?.y + targetHeight >
        screenDimensions.height - TOOLTIP_OFFSET_FOR_POINTER)
  ) {
    return null;
  }

  switch (pointerPlacement) {
    case PointerPlacement.TOP:
      return {
        x: round(
          targetX +
            Math.round(targetWidth / 2) -
            Math.round(TOOLTIP_POINTER_HORIZONTAL_WIDTH / 2)
        ),
        y: round(targetY - TOOLTIP_POINTER_HORIZONTAL_HEIGHT - 6),
      };
    case PointerPlacement.LEFT:
      return {
        x: round(targetX - TOOLTIP_POINTER_VERTICAL_WIDTH - 1),
        y: round(
          targetY +
            Math.round(targetHeight / 2) -
            Math.round(TOOLTIP_POINTER_VERTICAL_HEIGHT / 2)
        ),
      };
    case PointerPlacement.BOTTOM:
      return {
        x: round(
          targetX +
            Math.round(targetWidth / 2) -
            Math.round(TOOLTIP_POINTER_HORIZONTAL_WIDTH / 2)
        ),
        y: round(targetY + targetHeight - 5),
      };
    case PointerPlacement.RIGHT:
      return {
        x: round(targetX + targetWidth) + 1,
        y: round(
          targetY +
            Math.round(targetHeight / 2) -
            Math.round(TOOLTIP_POINTER_VERTICAL_HEIGHT / 2)
        ),
      };
    default:
      return null;
  }
};

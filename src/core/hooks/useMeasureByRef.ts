import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { IPosition, ISize } from "../types";
import useWindowDimensions from "./useWindowDimensions";

interface IResult {
  position: IPosition | null;
  size: ISize | null;
}

const ORIENTATION_DELAY = 700;

export const useMeasureByRef = (
  ref: RefObject<HTMLDivElement | null> | undefined
): IResult => {
  const [result, setResult] = useState<IResult>({ position: null, size: null });
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    screenWidth > screenHeight ? "landscape" : "portrait"
  );

  const measure = useCallback(() => {
    if (ref && ref.current) {
      const { x, y, width, height } = (
        ref as RefObject<HTMLDivElement>
      ).current!.getBoundingClientRect() as DOMRect;
      setResult({ position: { x, y }, size: { height, width } });
    }
  }, [ref]);

  useEffect(() => {
    measure();
  }, [ref, screenWidth, screenHeight]);

  useEffect(() => {
    const newOrientation =
      screenWidth > screenHeight ? "landscape" : "portrait";
    if (orientation !== newOrientation) {
      setTimeout(measure, ORIENTATION_DELAY);
      setOrientation(newOrientation);
    }
  }, [orientation, screenHeight, screenWidth]);

  return {
    position: result.position,
    size: result.size,
  };
};

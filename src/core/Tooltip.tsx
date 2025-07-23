import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Tooltip.module.css';

import useWindowDimensions from './hooks/useWindowDimensions';
import { useMeasureByRef } from './hooks/useMeasureByRef';
import { useOnLayout } from './hooks/useOnLayout';

import {
  TTooltipTarget,
  TooltipPlacement,
  ITooltipChildrenMethods,
  ISize,
} from './types';
import { getTooltipPosition } from './utils/utils';

interface IProps {
  target: TTooltipTarget;
  children: React.ReactNode;
  preferredPlacement?: TooltipPlacement;
  containerMaxWidth?: number;
  containerMaxHeight?: number;
  width?: number;
  backgroundColor?: string;
}

export const Tooltip = forwardRef<ITooltipChildrenMethods, IProps>(({
  children,
  target,
  preferredPlacement,
  containerMaxWidth = 320,
  containerMaxHeight = 300,
  width,
  backgroundColor = '#E8EEF7',
}, ref) => {
  const screenDimensions = useWindowDimensions();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { position: targetPosition, size: targetSize } = useMeasureByRef(target);

  const [contentSize, setContentSize] = useState<ISize | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  // Use ResizeObserver to get content size after render
  useOnLayout(tooltipRef, rect => {
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
      });
    }
    return null;
  }, [contentSize, preferredPlacement, screenDimensions, targetPosition, targetSize]);

  useEffect(() => {
    if (tooltipPosition && hasMeasured) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [tooltipPosition, hasMeasured]);

  const animateOut = useCallback((cb: Function) => {

      setIsVisible(false);
      setTimeout(() => {
        if (cb) cb();
      }, 500); // Match the transition duration

  }, []);

  const shakeTooltip = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  useImperativeHandle(ref, () => ({
    animateOut,
    shakeTooltip,
  }));

  return (
    <div
      ref={tooltipRef}
      className={[
        styles.tooltipContainer,
        isVisible ? styles.tooltipVisible : '',
        shake ? styles.shake : '',
      ].join(' ')}
      style={{
        left: tooltipPosition?.x,
        top: tooltipPosition?.y,
        width: width || undefined,
        maxWidth:
          containerMaxWidth >= screenDimensions.width
            ? screenDimensions.width - 32
            : containerMaxWidth,
        maxHeight: containerMaxHeight,
        backgroundColor,
        borderRadius: 5,
        opacity: isVisible ? 1 : 0,
        position: 'absolute',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 500ms ease-in-out',
      }}
    >
      {children}
    </div>
  );
});
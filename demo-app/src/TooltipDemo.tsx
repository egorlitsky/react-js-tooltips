import React, { useCallback } from 'react';
import { TooltipWrapper, Tooltip } from 'react-js-tooltips';

export const TooltipDemo: React.FC = () => {
  const getTooltipElement = useCallback((tooltipPlacement: string) => {
    return (
      <TooltipWrapper
        renderOverlay={(tooltipProps: any) => {
          return (
            <Tooltip {...tooltipProps} width={240}>
              <div>
                <h3>Tooltip Title</h3>
                <p>This is a tooltip with some content.</p>
              </div>
            </Tooltip>
          );
        }}
      >
        <div
          style={{
            width: '100px',
            height: '100%',
            backgroundColor: 'blue',
          }}
        >
          {tooltipPlacement}
        </div>
      </TooltipWrapper>
    );
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {getTooltipElement('bottom-right')}
        {getTooltipElement('bottom')}
        {getTooltipElement('bottom-left')}
      </div>
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {getTooltipElement('right')}
        {getTooltipElement('top')}
        {getTooltipElement('left')}
      </div>
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {getTooltipElement('top-right')}
        {getTooltipElement('top')}
        {getTooltipElement('top-left')}
      </div>
    </div>
  );
};

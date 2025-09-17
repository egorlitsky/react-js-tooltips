import React from "react";
import { TooltipWrapper, Tooltip } from "react-js-tooltips";

export const TooltipDemo: React.FC = () => {
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
          width: "100px",
          height: "50px",
          backgroundColor: "blue",
        }}
      />
    </TooltipWrapper>
  );
};

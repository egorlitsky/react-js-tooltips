import React from "react";
import "./App.css";
import { TooltipContainer } from "./core/TooltipContainer";
import { TooltipWrapper } from "./core/TooltipWrapper";
import { Tooltip } from "./core/Tooltip";

const Demo: React.FC = () => {
  return (
    <TooltipWrapper
      renderOverlay={(tooltipProps) => {
        return <Tooltip {...tooltipProps} width={240}>
          <div>
            <h3>Tooltip Title</h3>
            <p>This is a tooltip with some content.</p>
          </div>
        </Tooltip>;
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

const App: React.FC = () => {
  return (
    <div className="App">

      <h1>Some heading text</h1>
      <p>Click element below to see tooltip in action!</p>
      <Demo />

      <TooltipContainer />
    </div>
  );
};

export default App;

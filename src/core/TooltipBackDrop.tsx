import React from "react";

interface ITooltipBackDrop {
  onBackDropPress?: React.MouseEventHandler<HTMLDivElement>;
  backgroundColor?: string;
}

export const TooltipBackDrop: React.FC<ITooltipBackDrop> = (props) => {
  const { onBackDropPress, backgroundColor } = props;

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <div
        style={{ position: "absolute", width: "100%", height: "100%" }}
        onClick={onBackDropPress}
      >
        <div
          style={{
            flex: 1,
            backgroundColor,
          }}
        />
      </div>
    </div>
  );
};

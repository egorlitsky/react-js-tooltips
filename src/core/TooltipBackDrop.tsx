import React from "react";
import styles from "./TooltipBackDrop.module.css";

interface ITooltipBackDrop {
  onBackDropPress?: React.MouseEventHandler<HTMLDivElement>;
  backgroundColor?: string;
}

export const TooltipBackDrop: React.FC<ITooltipBackDrop> = (props) => {
  const { onBackDropPress, backgroundColor } = props;

  return (
    <div className={styles.backdrop}>
      <div className={styles.backdrop} onClick={onBackDropPress}>
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

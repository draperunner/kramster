import { FC } from "react";
import styles from "./DivChart.module.css";

const HEIGHTS = new Array(6).fill(0).map(() => 100 * Math.random());

const DivChart: FC = () => {
  return (
    <div className={styles.divChart}>
      {HEIGHTS.map((value) => (
        <div
          key={value}
          className={styles.divChartBar}
          style={{
            maxHeight: Math.min(Math.max(value, 20), 100).toString() + "%",
          }}
        />
      ))}
    </div>
  );
};

export default DivChart;

import styles from "./toggle_swich.module.css";
import { FC } from "react";

interface ToggleSwichProps {
  handleChange: () => void;
}

export const ToggleSwich: FC<ToggleSwichProps> = ({ handleChange }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" onChange={handleChange} />
      <span className={styles.slider}></span>
    </label>
  );
};

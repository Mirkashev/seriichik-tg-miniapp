import ReactSwitch from "react-switch";
import styles from "./Switch.module.scss";

const TRACK_OFF = "#5C5C5C";
const TRACK_ON = "#24B749";
const HANDLE = "#FFFFFF";

const WIDTH = 36;
const HEIGHT = 20;
const HANDLE_DIAMETER = 18;

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export function Switch({
  checked,
  onChange,
  disabled,
  id,
  className,
  "aria-label": ariaLabel,
}: SwitchProps) {
  return (
    <span className={`${styles.root} ${className ?? ""}`.trim()}>
      <ReactSwitch
        checked={checked}
        onChange={(next) => onChange(next)}
        disabled={disabled}
        id={id}
        aria-label={ariaLabel}
        width={WIDTH}
        height={HEIGHT}
        handleDiameter={HANDLE_DIAMETER}
        offColor={TRACK_OFF}
        onColor={TRACK_ON}
        offHandleColor={HANDLE}
        onHandleColor={HANDLE}
        borderRadius={HEIGHT / 2}
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </span>
  );
}

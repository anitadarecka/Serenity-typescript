import React, { MouseEventHandler, ReactNode } from "react";
import PropTypes from "prop-types";

interface BtnProps {
  type?: "button" | "submit" | "reset" | undefined;
  label: ReactNode;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  color: string;
}

function Btn({ type, label, handleClick, color }: BtnProps) {
  return (
    <div>
      <button
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        className={`${color} p-2 rounded-xl`}
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}

Btn.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]).isRequired,
  handleClick: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};
export default Btn;

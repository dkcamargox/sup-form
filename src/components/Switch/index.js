import React, { Component } from "react";
import "./switch.css";
const Switch = ({ label, name, ...rest }) => {
  return (
    <div className="form-check form-switch hole-width-switch">
      <label className="form-check-label hole-width-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="form-check-input hole-width-input"
        type="checkbox"
        id={name}
        {...rest}
      />
    </div>
  );
};

export default Switch;

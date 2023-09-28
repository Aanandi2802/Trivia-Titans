import React from "react";
import "./button.styles.scss";

const Button = ({ text, children, ...otherProps }) => (
  <button
    style={{
      color: "black",
      backgroundColor: "#1091e1",
    }}
    className="btnShvet btn--primary"
    {...otherProps}
  >
    {children}
  </button>
);

export default Button;

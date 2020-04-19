import React, { HtmlHTMLAttributes } from "react";
import cn from "classnames";
import "./Button.scss";

interface XbuttonProps {
  disabled?: boolean;
  next?: boolean;
}

export const XButton = ({ next, className, ...props }: HtmlHTMLAttributes<HTMLButtonElement> & XbuttonProps) => (
  <button className={cn(className, "x-button")} {...props}>
    {props.children}

    {next && <span className="x-button-next material-icons">navigate_next</span>}
  </button>
);

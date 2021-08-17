import React, { HtmlHTMLAttributes } from "react";
import cn from "classnames";

import "./button.scss";

interface ButtonProps {
  disabled?: boolean;
  next?: boolean;
  variant?: string;
}

export const XButton = ({
  next,
  className,
  variant = "primary",
  ...props
}: HtmlHTMLAttributes<HTMLButtonElement> & ButtonProps) => (
  <button className={cn(className, { next }, variant, "x-button")} {...props}>
    {props.children}

    {next && <span className="x-button-next material-icons">navigate_next</span>}
  </button>
);

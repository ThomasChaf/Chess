import React, { ReactNode, ChangeEvent } from "react";
import "./Elements.scss";

interface XLabelProps {
  children: ReactNode;
}
export const XLabel = (props: XLabelProps) => <label className="x-label">{props.children}</label>;

interface XInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  type: string;
}
export const XInput = (props: XInputProps) => <input className="x-input" {...props} />;

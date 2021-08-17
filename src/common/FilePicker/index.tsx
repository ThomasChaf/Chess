import React, { useRef } from "react";

import "./filePicker.scss";

const PLACEHOLDER = "Select a file";

const getFileName = (inputRef: React.RefObject<HTMLInputElement>) => {
  if (inputRef.current?.files && inputRef.current.files[0]) {
    return inputRef.current.files[0].name;
  }
  return PLACEHOLDER;
};

export const FilePicker = (props: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openInput = () => inputRef.current?.click();

  return (
    <>
      <input ref={inputRef} onChange={props.onChange} accept={props.accept} className="x-input-hidden" type="file" />

      <button className="x-input-button" onClick={openInput}>
        {getFileName(inputRef)}
      </button>
    </>
  );
};

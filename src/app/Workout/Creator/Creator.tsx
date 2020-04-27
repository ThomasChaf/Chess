import React, { useRef } from "react";
import { AnimatedLayoutRef } from "common/AnimatedLayout/AnimatedLayout";
import { XButton } from "common/Button/Button";
import { ExercicePicker } from "./ExercicePicker";
import "./Creator.scss";

export const Creator = () => {
  const pickerRef = useRef<AnimatedLayoutRef>(null);

  const openPicker = () => pickerRef.current?.open();

  return (
    <div>
      <h1>Create</h1>

      <XButton next onClick={openPicker}>
        Pick excerices
      </XButton>

      <ExercicePicker ref={pickerRef} />

      <button>Train</button>
    </div>
  );
};

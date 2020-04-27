import React, { forwardRef, useState } from "react";
import cn from "classnames";
import { AnimatedLayout } from "common/AnimatedLayout/AnimatedLayout";
import { EXERCICES, Exercice } from "core/workout";
import { XButton } from "common/Button/Button";

type SelectedState = {
  [key: string]: Exercice | null;
};

export const ExercicePicker = forwardRef((props: any, ref) => {
  const [selected, setSelected] = useState<SelectedState>({});

  const handleSelect = (exercice: Exercice) => {
    setSelected({
      ...selected,
      [exercice.name]: selected[exercice.name] ? null : exercice
    });
  };

  const isSelected = (name: string) => !!selected[name];

  return (
    <AnimatedLayout ref={ref}>
      <div className="picker-container">
        <h2>Pick exercices</h2>

        <div className="picker-list">
          {EXERCICES.map((exercice: Exercice) => (
            <div
              className={cn("picker-cell", { selected: isSelected(exercice.name) })}
              onClick={() => handleSelect(exercice)}
            >
              <img className="picker-preview" src={exercice.imageUrl} alt="visu" />

              <span>{exercice.name}</span>
            </div>
          ))}
        </div>

        <XButton variant="valid" className="picker-validate">
          Validate
        </XButton>
      </div>
    </AnimatedLayout>
  );
});

import React, { useState, useRef } from "react";
import { Game } from "core/index";
import { InitalState } from "./InitialState";
import { LoadGameState } from "./LoadGameState/LoadGameState";
import { AnimatedLayout, AnimatedLayoutRef } from "./AnimatedLayout/AnimatedLayout";
import "./Menu.scss";

export enum EVues {
  Initial,
  LoadGame
}

interface MenuProps {
  start: (game: Game, interval: number) => void;
}

export const Menu = (props: MenuProps) => {
  const layoutRef = useRef<AnimatedLayoutRef>(null);
  const [vue, switchVue] = useState(EVues.Initial);

  const handleStart = (game: Game, interval: number) => {
    layoutRef.current?.close();
    props.start(game, interval);
  };

  const onClose = () => switchVue(EVues.Initial);

  return (
    <AnimatedLayout ref={layoutRef} onClose={onClose}>
      <div className="menu-box">
        <p className="menu-headline">Menu</p>
        {vue === EVues.Initial && <InitalState switchVue={switchVue} />}

        {vue === EVues.LoadGame && <LoadGameState start={handleStart} />}
      </div>
    </AnimatedLayout>
  );
};

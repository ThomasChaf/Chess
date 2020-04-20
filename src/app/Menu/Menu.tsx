import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Game } from "core/chess";
import { NavigationPanel } from "./NavigationPanel";
import { ChessPanel } from "./ChessPanel/ChessPanel";
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
  const history = useHistory();

  const handleStart = (game: Game, interval: number) => {
    layoutRef.current?.close();
    props.start(game, interval);
  };

  const redirect = (path: string) => {
    layoutRef.current?.close();
    history.push(path);
  };

  const onClose = () => switchVue(EVues.Initial);

  return (
    <AnimatedLayout ref={layoutRef} onClose={onClose}>
      <div className="menu-box">
        <p className="menu-headline">Menu</p>
        {vue === EVues.Initial && <NavigationPanel switchVue={switchVue} redirect={redirect} />}

        {vue === EVues.LoadGame && <ChessPanel start={handleStart} />}
      </div>
    </AnimatedLayout>
  );
};

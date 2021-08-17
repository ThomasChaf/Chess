import React, { useState, useRef, FC } from "react";
import { useHistory } from "react-router-dom";

import { Game } from "core/chess";

import { AnimatedLayout, AnimatedLayoutRef } from "common/animatedLayout";

import { NavigationPanel } from "./panel";
import { ChessPanel } from "./chessPanel";

import "./menu.scss";

export enum Views {
  Initial,
  LoadGame
}

interface MenuProps {
  start: (game: Game) => void;
}

export const Menu: FC<MenuProps> = ({ start }) => {
  const layoutRef = useRef<AnimatedLayoutRef>(null);
  const [vue, switchVue] = useState(Views.Initial);
  const history = useHistory();

  const handleStart = (game: Game, interval: number, step: number, autoplay: boolean) => {
    redirect("/chess");
    game.autoplay = autoplay;
    game.interval = interval;
    game.moveForwardTo(step);
    layoutRef.current?.close();
    start(game);
  };

  const redirect = (path: string) => {
    layoutRef.current?.close();
    history.push(path);
  };

  const onClose = () => switchVue(Views.Initial);
  const openMenu = () => layoutRef.current?.open();

  return (
    <>
      <span onClick={openMenu} className="menu-icon material-icons">
        menu
      </span>

      <AnimatedLayout ref={layoutRef} onClose={onClose}>
        <div className="menu-box">
          <p className="menu-headline">Menu</p>
          {vue === Views.Initial && <NavigationPanel switchVue={switchVue} redirect={redirect} />}

          {vue === Views.LoadGame && <ChessPanel start={handleStart} />}
        </div>
      </AnimatedLayout>
    </>
  );
};

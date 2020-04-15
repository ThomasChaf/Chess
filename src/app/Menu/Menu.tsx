import React, { useState } from "react";
import { useMenuToggler } from "./useKeyPress";
import "./Menu.scss";
import { InitalState } from "./InitialState";
import { LoadGameState } from "./LoadGameState/LoadGameState";
import { Game } from "core/index";

export enum EVues {
  Initial,
  LoadGame
}

interface MenuProps {
  start: (game: Game) => void;
}

export const Menu = (props: MenuProps) => {
  const [open, setOpen] = useMenuToggler();
  const [vue, switchVue] = useState(EVues.Initial);

  if (!open) return null;

  const handleStart = (game: Game) => {
    setOpen(false);
    props.start(game);
  };

  return (
    <div className="menu-container">
      <div className="menu-box">
        <p className="menu-headline">Menu</p>
        {vue === EVues.Initial && <InitalState switchVue={switchVue} />}

        {vue === EVues.LoadGame && <LoadGameState start={handleStart} />}
      </div>
    </div>
  );
};

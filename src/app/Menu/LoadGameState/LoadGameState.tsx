import React, { useState, ChangeEvent } from "react";
import { parse } from "../../../core/game-parser";
import { Game } from "../../../core/game";

interface LoadGameStateProps {
  start: (game: Game) => void;
}

export const LoadGameState = (props: LoadGameStateProps) => {
  const [game, setGame] = useState<Game | null>(null);

  const loadGame = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files == null || e.currentTarget.files[0] == null) {
      setGame(null);
      return;
    }

    var reader = new FileReader();
    reader.readAsText(e.currentTarget.files[0], "UTF-8");
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      if (evt.target?.result == null) return;

      const game = parse(evt.target.result as string);

      setGame(game);
    };
  };

  const handleStart = () => {
    if (game) props.start(game);
  };

  return (
    <div className="menu-content">
      <input onChange={loadGame} accept=".pgn" className="menu-option secondary" type="file" />

      <button disabled={!game} className="menu-option primary" onClick={handleStart}>
        Start
      </button>
    </div>
  );
};

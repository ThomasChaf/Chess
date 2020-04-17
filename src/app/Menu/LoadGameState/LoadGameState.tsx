import React, { useState, ChangeEvent } from "react";
import { parse, Game } from "core/index";

interface LoadGameStateProps {
  start: (game: Game, interval: number) => void;
}

export const LoadGameState = (props: LoadGameStateProps) => {
  const [game, setGame] = useState<Game | null>(null);
  const [time, setTime] = useState(1500);

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

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => setTime(parseInt(e.target?.value));

  const handleStart = () => {
    if (game) props.start(game, time);
  };

  return (
    <div className="menu-content">
      <input onChange={loadGame} accept=".pgn" className="menu-option secondary" type="file" />

      <label className="menu-label">Time interval</label>
      <input onChange={handleTimeChange} value={time} className="menu-number" type="number" />

      <button disabled={!game} className="menu-start menu-option primary" onClick={handleStart}>
        Start
      </button>
    </div>
  );
};

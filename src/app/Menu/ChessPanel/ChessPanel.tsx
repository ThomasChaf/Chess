import React, { useState, ChangeEvent } from "react";
import { parse, Game } from "core/chess";
import { FilePicker } from "common/FilePicker/FilePicker";
import { XButton } from "common/Button/Button";
import { XLabel, XInput } from "common/Elements/Elements";
import { useHistory } from "react-router-dom";

interface LoadGameStateProps {
  start: (game: Game, interval: number) => void;
}

export const ChessPanel = (props: LoadGameStateProps) => {
  const [game, setGame] = useState<Game | null>(null);
  const [time, setTime] = useState(1500);
  const history = useHistory();

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
      history.push("/chess");
    };
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => setTime(parseInt(e.target?.value));

  const handleStart = () => {
    if (game) props.start(game, time);
  };

  return (
    <div className="menu-content">
      <XLabel>File</XLabel>
      <FilePicker onChange={loadGame} accept=".pgn" />

      <XLabel>Time interval</XLabel>
      <XInput onChange={handleTimeChange} value={time} type="number" />

      <XButton next disabled={!game} className="menu-start" onClick={handleStart} variant="valid">
        Start
      </XButton>
    </div>
  );
};

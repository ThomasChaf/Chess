import React, { useState, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import { parse, Game } from "core/chess";

import { FilePicker } from "common/filePicker";
import { XButton } from "common/button";
import { XLabel, XInput } from "common/elements";

import { LoadGameStateProps } from "./chessPanel.d";

export const ChessPanel = (props: LoadGameStateProps) => {
  const [defaultGame] = useState<Game>(new Game());
  const [game, setGame] = useState<Game>(defaultGame);
  const [time, setTime] = useState(1500);
  const history = useHistory();

  const loadGame = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files == null || e.currentTarget.files[0] == null) {
      setGame(defaultGame);
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
    props.start(game, time);
  };

  return (
    <div className="menu-content">
      <XLabel>File</XLabel>
      <FilePicker onChange={loadGame} accept=".pgn" />

      <XLabel>Time interval</XLabel>
      <XInput onChange={handleTimeChange} value={time} type="number" />

      <XButton next className="menu-start" onClick={handleStart} variant="valid">
        Start
      </XButton>
    </div>
  );
};

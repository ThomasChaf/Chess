import React, { useState, ChangeEvent } from "react";

import { parse, Game } from "core/chess";

import { FilePicker } from "common/filePicker";
import { XButton } from "common/button";
import { XLabel, XInput } from "common/elements";

import "./panel.scss";

interface LoadGameStateProps {
  onStart: (game: Game, interval: number, step: number, autoplay: boolean) => void;
}

export const Panel = ({ onStart }: LoadGameStateProps) => {
  const [game, setGame] = useState<Game>();
  const [time, setTime] = useState(1500);
  const [step, setStep] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const loadGame = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files == null || e.currentTarget.files[0] == null) {
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
  const handleMoveChange = (e: ChangeEvent<HTMLInputElement>) => setStep(parseInt(e.target?.value));
  const handleAutoplayChange = (e: ChangeEvent<HTMLInputElement>) => setAutoplay(!autoplay);

  const start = () => {
    if (game) onStart(game, time, step, autoplay);
  };

  return (
    <div className="chess-panel">
      <XLabel>File</XLabel>
      <FilePicker onChange={loadGame} accept=".pgn" />

      <XLabel>Time interval</XLabel>
      <XInput onChange={handleTimeChange} value={time} type="number" />

      <XLabel>Move</XLabel>
      <XInput onChange={handleMoveChange} value={step} type="number" />

      <XLabel>Autoplay</XLabel>
      <XInput onChange={handleAutoplayChange} type="checkbox" />

      <XButton next className="menu-start" onClick={start} variant="valid">
        Start
      </XButton>
    </div>
  );
};

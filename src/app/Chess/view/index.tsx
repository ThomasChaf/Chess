import { Game } from "core/chess";

import { Board } from "./board";
import { Controls } from "./controls";
import { useActions } from "./useActions";
import { useAnalyse } from "./useAnalyse";

interface ViewProps {
  game: Game;
}

export const View = ({ game }: ViewProps) => {
  const actions = useActions(game);
  const { analyse, loading } = useAnalyse(game);

  const nextPlay = !loading ? game.getPlay() : undefined;

  return (
    <div className="chess-container">
      <Board nextPlay={nextPlay} pieces={game.board.getPieces()} />
      <Controls onGoing={game.onGoing()} actions={actions} analyse={analyse} />
    </div>
  );
};

import React, { useEffect, useState } from "react";

import { Game, parse } from "core/chess";
import { Panel } from "./panel";

import "./game.scss";
import { View } from "./view";

export const Chess = () => {
  const [game, setGame] = useState<Game | undefined>();

  useEffect(() => {
    // https://lichess.org/Q9YxuQC3/white#65
    const nGame = parse(
      "1. e3 g6 2. d4 Bg7 3. Nf3 Nf6 4. c4 O-O 5. Nc3 d5 6. cxd5 Nxd5 7. Be2 c5 8. O-O Nc6 9. Re1 cxd4 10. exd4 Nxc3 11. bxc3 e5 12. d5 Na5 13. Ba3 Re8 14. c4 e4 15. Nd4 Qb6 16. c5 Qf6 17. Bb2 Qg5 18. Qa4 Bh3 19. Bf1 b6 20. cxb6 axb6 21. Rab1 Bg4 22. Bc3 Qxd5 23. Rxb6 Rec8 24. Ba1 Nc4 25. Qb5 Nxb6 26. Qxb6 Rab8 27. Qa7 Ra8 28. Qb6 Rcb8 29. Qc7 Bxd4 30. Bc4 Qc5 31. Qxf7+ Kh8 32. Qf6+ Bxf6 33. Bxf6# 1-0"
    );
    nGame.moveForwardTo(30.5);

    // https://lichess.org/JpcwilNZ/white#27 - 13.5
    // const nGame = parse(
    //   "1. d4 Nf6 2. Nf3 c5 3. e3 e6 4. Bd3 d5 5. b3 Nbd7 6. Bb2 Be7 7. Nbd2 O-O 8. O-O Re8 9. Ne5 Nf8 10. f4 a6 11. a4 Qc7 12. Qf3 N6d7 13. Qh3 f6 14. Bxh7+ Nxh7 15. Qxe6+ Kh8 16. Nf7+ Kg8 17. Nh6+ Kh8 18. Qg8+ Rxg8 19. Nf7# 1-0"
    // );
    // nGame.moveForwardTo(13.5);

    nGame.autoplay = false;
    nGame.interval = 800;
    setGame(nGame);
  }, []);

  const handleStart = (game: Game, interval: number, step: number, autoplay: boolean) => {
    game.autoplay = autoplay;
    game.interval = interval;
    game.moveForwardTo(step);

    setGame(game);
  };

  if (!game) {
    return <Panel onStart={handleStart} />;
  }

  return <View game={game} />;
};

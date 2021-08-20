import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Game, parse } from "core/chess";

import { Chess } from "./chess";
import { Ui2048 } from "./2048/2048";
import { Menu } from "./menu";
import { Workout } from "./workout/Workout";

import "./main.css";

export const App = () => {
  const [game, setGame] = useState<Game>(new Game());

  useEffect(() => {
    const nGame = parse(
      '[Event "Rated Bullet game"]\n[Site "https://lichess.org/kBrG5XZ6"]\n[Date "2021.08.17"]\n[White "Totolebarjo"]\n[Black "fadu94"]\n[Result "1-0"]\n[UTCDate "2021.08.17"]\n[UTCTime "00:59:57"]\n[WhiteElo "1448"]\n[BlackElo "1450"]\n[WhiteRatingDiff "+6"]\n[BlackRatingDiff "-6"]\n[Variant "Standard"]\n[TimeControl "120+1"]\n[ECO "B10"]\n[Opening "Caro-Kann Defense"]\n[Termination "Normal"]\n1. e4 c6 2. Nc3 d5 3. exd5 cxd5 4. d4 g6 5. Nf3 Bg7 6. Bd3 Nf6 7. O-O O-O 8. b3 Nc6 9. Bb2 Bg4 10. Be2 Rc8 11. h3 Bxf3 12. Bxf3 e6 13. Re1 Qb6 14. Ne2 Ne4 15. Rb1 Nb4 16. c3 Nxa2 17. Ra1 Naxc3 18. Nxc3 Nxc3 19. Bxc3 Rxc3 20. Ra4 a6 21. Re3 Rfc8 22. Rxc3 Rxc3 23. Qd2 Qxb3 24. Bd1 Qxa4 25. Bxa4 Ra3 26. Bd1 Ra1 27. Kh2 b5 28. Bf3 a5 29. Qc3 Rf1 30. Qxa5 Rxf2 31. Qxb5 Bxd4 32. Qe8+ Kg7 33. Qe7 Bf6 34. Qd6 e5 35. Qb6 e4 36. Qxf2 exf3 37. gxf3 d4 38. Kg3 Be5+ 39. f4 Bf6 40. Kg4 h5+ 41. Kf3 g5 42. fxg5 Bxg5 43. Qxd4+ Bf6 44. Qh4 Kh6 45. Qf4+ Bg5 46. Qxf7 h4 47. Qe6+ Kh5 48. Ke4 Bd8 49. Kf5 Bg5 50. Qg6# 1-0'
    );

    nGame.autoplay = false;
    nGame.interval = 1500;
    nGame.moveForwardTo(49.5);
    setGame(nGame);
  }, []); // eslint-disable-line

  return (
    <Router>
      <div className="App">
        <Menu start={setGame} />

        <Switch>
          <Route path="/chess">
            <Chess game={game} />
          </Route>

          <Route path="/2048" component={Ui2048} />

          <Route path="/workout" component={Workout} />
        </Switch>
      </div>
    </Router>
  );
};

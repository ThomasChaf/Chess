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
    // const nGame = parse(
    //   '[Event "Rated Bullet game"]\n[Site "https://lichess.org/kBrG5XZ6"]\n[Date "2021.08.17"]\n[White "Totolebarjo"]\n[Black "fadu94"]\n[Result "1-0"]\n[UTCDate "2021.08.17"]\n[UTCTime "00:59:57"]\n[WhiteElo "1448"]\n[BlackElo "1450"]\n[WhiteRatingDiff "+6"]\n[BlackRatingDiff "-6"]\n[Variant "Standard"]\n[TimeControl "120+1"]\n[ECO "B10"]\n[Opening "Caro-Kann Defense"]\n[Termination "Normal"]\n1. e4 c6 2. Nc3 d5 3. exd5 cxd5 4. d4 g6 5. Nf3 Bg7 6. Bd3 Nf6 7. O-O O-O 8. b3 Nc6 9. Bb2 Bg4 10. Be2 Rc8 11. h3 Bxf3 12. Bxf3 e6 13. Re1 Qb6 14. Ne2 Ne4 15. Rb1 Nb4 16. c3 Nxa2 17. Ra1 Naxc3 18. Nxc3 Nxc3 19. Bxc3 Rxc3 20. Ra4 a6 21. Re3 Rfc8 22. Rxc3 Rxc3 23. Qd2 Qxb3 24. Bd1 Qxa4 25. Bxa4 Ra3 26. Bd1 Ra1 27. Kh2 b5 28. Bf3 a5 29. Qc3 Rf1 30. Qxa5 Rxf2 31. Qxb5 Bxd4 32. Qe8+ Kg7 33. Qe7 Bf6 34. Qd6 e5 35. Qb6 e4 36. Qxf2 exf3 37. gxf3 d4 38. Kg3 Be5+ 39. f4 Bf6 40. Kg4 h5+ 41. Kf3 g5 42. fxg5 Bxg5 43. Qxd4+ Bf6 44. Qh4 Kh6 45. Qf4+ Bg5 46. Qxf7 h4 47. Qe6+ Kh5 48. Ke4 Bd8 49. Kf5 Bg5 50. Qg6# 1-0'
    // );

    // const nGame = parse(
    //   '[Event "Rated Rapid game"]\n[Site "https://lichess.org/3WgJV8yb"]\n[Date "2021.09.10"]\n[White "Frundsberg1"]\n[Black "DrBoomkestien"]\n[Result "0-1"]\n[UTCDate "2021.09.10"]\n[UTCTime "09:11:13"]\n[WhiteElo "2499"]\n[BlackElo "2395"]\n[WhiteRatingDiff "-7"]\n[BlackRatingDiff "+8"]\n[Variant "Standard"]\n[TimeControl "600+0"]\n[ECO "B13"]\n[Opening "Caro-Kann Defense: Panov Attack, Modern Defense, Carlsbad Line"]\n[Termination "Time forfeit"]\n1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4 Nf6 5. Nc3 Nc6 6. Bg5 e6 7. c5 Be7 8. Nf3 h6 9. Bf4 O-O 10. Bb5 Nh5 11. Be3 Nf6 12. O-O a6 13. Bxc6 bxc6 14. Ne5 Bb7 15. b4 Rb8 16. a4 Nd7 17. Bf4 Nxe5 18. Bxe5 Rc8 19. b5 axb5 20. axb5 cxb5 21. Nxb5 f6 22. Bg3 Ra8 23. Qg4 Qd7 24. Rxa8 Rxa8 25. Nc7 f5 26. Qe2 Ra4 27. Nxe6 Ba6 28. Qe5 Bf6 29. Qb8+ Bc8 30. Nf4 Bxd4 31. Qb3 Rc4 32. h4 g5 33. hxg5 hxg5 34. Nh5 f4 35. Rd1 fxg3 36. Rxd4 gxf2+ 37. Kf1 Qe6 38. Rd1 Ba6 39. Qb8+ Kh7 40. Kxf2 Rc2+ 41. Kg1 Qe3+ 42. Kh2 Rxg2+ 43. Kxg2 Qe2+ 44. Kg3 Qxd1 45. Qc7+ Kh6 46. Qd6+ Kxh5 47. Qxa6 Qg4+ 48. Kf2 Qf4+ 49. Ke2 Qd4 50. Kf1 Qe4 51. Kf2 Qf4+ 52. Kg1 Qe4 53. Kf1 Qb1+ 54. Kg2 Qe4+ 55. Kg3 Qf4+ 56. Kg2 Kg4 57. Kg1 Qe4 0-1'
    // );

    // const nGame = parse(
    //   '[Event "Rated Rapid game"]\n[Site "https://lichess.org/6vyYqbwl"]\n[Date "2017.03.06"]\n[White "docti"]\n[Black "marmat2"]\n[Result "0-1"]\n[UTCDate "2017.03.06"]\n[UTCTime "12:15:35"]\n[WhiteElo "1725"]\n[BlackElo "1760"]\n[WhiteRatingDiff "-9"]\n[BlackRatingDiff "+9"]\n[Variant "Standard"]\n[TimeControl "600+3"]\n[ECO "B20"]\n[Opening "Sicilian Defense: Staunton-Cochrane Variation"]\n[Termination "Normal"]\n1. e4 c5 2. c4 Nc6 3. Nc3 e6 4. d3 a6 5. Nf3 Nf6 6. Be2 Nd4 7. Be3 Nxe2 8. Qxe2 Ng4 9. h3 Nxe3 10. fxe3 Be7 11. O-O O-O 12. Rf2 Qc7 13. Nd2 Bg5 14. Rf3 b6 15. Rb1 Bb7 16. a3 Rae8 17. Qf2 f5 18. Rf1 f4 19. exf4 Rxf4 20. Rxf4 Bf6 21. Qg3 Be5 22. Qf3 Bxf4 23. Qxf4 Qxf4 24. Rxf4 Rf8 25. Rxf8+ Kxf8 26. Kf2 Kf7 27. Kf3 g5 28. Kg4 Kg6 29. g3 b5 30. cxb5 axb5 31. Nxb5 d5 32. Nd6 Ba6 33. exd5 Bxd3 34. dxe6 Be2+ 35. Nf3 h5# 0-1'
    // );

    // const nGame = parse(
    //   '[Event "Rated Blitz game"]\n[Site "https://lichess.org/efcvL4qF"]\n[Date "2017.05.27"]\n[White "lidbo"]\n[Black "maniospas"]\n[Result "0-1"]\n[UTCDate "2017.05.27"]\n[UTCTime "23:08:42"]\n[WhiteElo "1502"]\n[BlackElo "1506"]\n[WhiteRatingDiff "-12"]\n[BlackRatingDiff "+10"]\n[Variant "Standard"]\n[TimeControl "30+11"]\n[ECO "B06"]\n[Opening "Modern Defense: Two Knights Variation"]\n[Termination "Normal"]\n1. e4 d6 2. Nf3 g6 3. Nc3 Bg7 4. d4 Nd7 5. Bd3 e5 6. Be3 Ne7 7. O-O O-O 8. d5 b6 9. Qe2 Nc5 10. Qd2 f5 11. Bh6 f4 12. Bxg7 Kxg7 13. Ng5 Ng8 14. b4 Nxd3 15. Ne6+ Bxe6 16. dxe6 Nxb4 17. Nd5 Nxd5 18. Qxd5 Qe7 19. g3 Nf6 20. Qc4 fxg3 21. fxg3 Rfe8 22. Rf2 Qxe6 23. Qxc7+ Re7 24. Qc6 Rc8 25. Qa4 a5 26. Raf1 Nh5 27. Qb5 Rb7 28. Qd3 Rc4 29. Qe3 b5 30. Rf8 Rbc7 31. Qg5 Rxe4 32. h3 Qxh3 33. R8f7+ Rxf7 34. Rxf7+ Kxf7 35. Qd8 Qxg3+ 0-1'
    // );

    const nGame = parse(
      '[Event "Rated Rapid game"]\n[Site "https://lichess.org/gYiTebGO"]\n[Date "2021.03.14"]\n[White "CHECKPIT"]\n[Black "AdihuyHuyy"]\n[Result "0-1"]\n[UTCDate "2021.03.14"]\n[UTCTime "04:25:27"]\n[WhiteElo "2054"]\n[BlackElo "2008"]\n[WhiteRatingDiff "-6"]\n[BlackRatingDiff "+7"]\n[Variant "Standard"]\n[TimeControl "600+0"]\n[ECO "A23"]\n[Opening "English Opening: King\'s English Variation, Two Knights Variation, Keres Variation"]\n[Termination "Normal"]\n1. c4 e5 2. Nc3 c6 3. g3 Nf6 4. Bg2 d5 5. cxd5 cxd5 6. d4 e4 7. e3 Bb4 8. Ne2 O-O 9. h3 Be6 10. O-O Nc6 11. a3 Bd6 12. Nb5 Be7 13. Kh2 Qd7 14. Nf4 Na5 15. Nc3 Nc4 16. Nxe6 fxe6 17. Ne2 Nd6 18. Bd2 Rac8 19. Nf4 Nf5 20. Bc3 g5 21. Nh5 h6 22. Nxf6+ Rxf6 23. Qe2 Bd6 24. Rac1 Kg7 25. Qg4 Nh4 26. Bxe4 dxe4 27. Qxe4 Nf3+ 28. Kg2 Rcf8 29. d5 e5 30. Bb4 Bxb4 31. Qxb4 Qxd5 32. Rc7+ Kg6 33. e4 Qd3 34. Qxb7 Ne1+ 35. Kg1 Rxf2 36. Rxf2 Qxg3+ 0-1'
    );

    nGame.autoplay = false;
    nGame.interval = 800;
    // nGame.moveForwardTo(1);
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

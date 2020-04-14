import { Play } from "./game-d";
import { Board } from "./board";
import { generate } from "shortid";

export class Game {
  public id: string = generate();
  public board: Board = new Board();
  private history: Play[] = [];
  private step: number = 0;

  public play = (play: Play, save: boolean = true) => {
    if (save) this.history.push(play);

    if (play.taken) this.board.take(play.taken);

    play.moves.forEach(this.board.applyMove);
  };

  public launch = (cb: () => void): NodeJS.Timeout => {
    const timer = setInterval(() => {
      if (!this.history[this.step]) {
        clearInterval(timer);

        return;
      }

      this.play(this.history[this.step], false);
      this.step += 1;
      cb();
    }, 400);

    return timer;
  };
}

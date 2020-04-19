import { Play } from "./game-d";
import { Board } from "./board";
import { generate } from "shortid";
import { reverseMove } from "./utils";

export class Game {
  public id: string = generate();
  public board: Board = new Board();
  public history: Play[] = [];
  private interval: number = 0;
  private timer: NodeJS.Timeout | null = null;
  private step: number = 0;

  public get onGoing(): boolean {
    return this.timer !== null;
  }

  public play = (play: Play, save: boolean = true) => {
    if (save) this.history.push(play);

    if (play.taken) this.board.take(play.taken.position);

    this.board.applyMove(play.move);
    if (play.rock) this.board.applyMove(play.rock);

    if (play.promotion) this.board.promote(play.move.to, play.promotion.to);
  };

  public launch = (interval: number, cb: () => void): NodeJS.Timeout => {
    this.interval = interval;
    this.timer = setInterval(() => {
      if (this.timer && !this.history[this.step]) {
        clearInterval(this.timer);

        return;
      }

      this.play(this.history[this.step], false);
      this.step += 1;
      cb();
    }, interval);

    return this.timer;
  };

  public playPause = (cb: () => void) => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      cb();
    } else {
      this.launch(this.interval, cb);
    }
  };

  public moveBackWard = (cb: () => void) => {
    if (this.step === 0) return;

    this.step -= 1;
    const lastPlay = this.history[this.step];

    if (lastPlay.promotion) this.board.promote(lastPlay.move.to, lastPlay.promotion.from);

    this.board.applyMove(reverseMove(lastPlay.move));
    if (lastPlay.rock) this.board.applyMove(reverseMove(lastPlay.rock));

    if (lastPlay.taken) {
      this.board.addPiece(lastPlay.taken);
    }

    cb();
  };

  public moveForward = (cb: () => void) => {
    if (!this.history[this.step]) return;

    this.play(this.history[this.step], false);
    this.step += 1;
    cb();
  };
}

import { Play } from "./chess";
import { Board } from "./board";
import { generate } from "shortid";
import { reverseMove } from "./utils";

export class Game {
  public autoplay: boolean = false;
  public id: string = generate();
  public board: Board = new Board();
  public history: Play[] = [];
  public analyse: { [k: number]: Play } = {};
  public interval: number = 0;
  private timer: NodeJS.Timeout | null = null;
  private step: number = 0;

  public getPlay = (): Play | undefined => {
    return this.analyse[this.step] || this.history[this.step];
  };

  public getLastPlay = (): Play | undefined => {
    return this.history[this.step - 1];
  };

  public onGoing = (): boolean => {
    return this.timer !== null;
  };

  public setAnalyse = (analysePlays: Play[]) => {
    analysePlays.forEach((play, index) => {
      play.fromAnalyse = true;
      this.analyse[this.step + index] = play;
    });
  };

  public play = (play: Play, save: boolean = true) => {
    if (save) this.history.push(play);

    if (play.taken) this.board.take(play.taken.position);

    this.board.basicMove(play.move);
    if (play.rock) this.board.basicMove(play.rock);

    if (play.promotion) this.board.promote(play.move.to, play.promotion.to);
  };

  public launch = (update: () => void): NodeJS.Timeout => {
    this.timer = setInterval(() => {
      if (this.timer && !this.history[this.step]) {
        clearInterval(this.timer);

        return;
      }

      this.play(this.history[this.step], false);
      this.step += 1;
      update();
    }, this.interval);

    return this.timer;
  };

  public playPause = (update: () => void) => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      update();
    } else {
      this.launch(update);
    }
  };

  public moveBackWard = () => {
    if (this.step === 0) return;

    this.step -= 1;
    const lastPlay = this.history[this.step];

    if (lastPlay.promotion) this.board.promote(lastPlay.move.to, lastPlay.promotion.from);

    this.board.applyMove(reverseMove(lastPlay.move));
    if (lastPlay.rock) this.board.applyMove(reverseMove(lastPlay.rock));

    if (lastPlay.taken) {
      this.board.addPiece(lastPlay.taken);
    }
  };

  public moveForward = () => {
    if (!this.history[this.step]) return;

    this.play(this.history[this.step], false);
    this.step += 1;
  };

  public moveForwardTo = (step: number) => {
    const move = (step - 1) * 2;
    for (let i = 0; i <= move; i++) {
      this.moveForward();
    }
  };
}

import { ExerciceBlob } from "./workout-d";

export class Exercice {
  public name: string;
  public slug: string;

  constructor(args: ExerciceBlob) {
    this.name = args.name;
    this.slug = args.slug;
  }

  public get imageUrl(): string {
    return `/workout/images/${this.slug}.png`;
  }

  public get videoUrl(): string {
    return `/workout/videos/${this.slug}.mp4`;
  }
}

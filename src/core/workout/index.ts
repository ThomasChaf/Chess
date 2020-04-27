import data from "./data.json";
import { Exercice } from "./exercice";

export { Exercice } from "./exercice";
export * from "./workout-d";

export const EXERCICES = data.map((blob) => new Exercice(blob));

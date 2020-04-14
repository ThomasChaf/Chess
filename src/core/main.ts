import fs from "fs";
import { parse } from "./game-parser";

const main = () => {
  console.log("START");

  const content = fs.readFileSync(process.argv[2], "utf8");

  parse(content);

  console.log("END");
};

main();

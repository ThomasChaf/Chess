import React from "react";
import cn from "classnames";

import { Play } from "core/chess";

import "./uiPlay.scss";

const rowToX = (row: number) => row - 1;
const colToY = (col: number) => 8 - col;

interface PieceProps {
  play: Play;
}

export const UiPlay = ({ play }: PieceProps) => {
  console.log("UiPlay:", play);

  const caseLength = 650 / 8;
  const { move } = play;
  const { from, to } = move;
  const x1 = caseLength * rowToX(from[0]) + caseLength / 2;
  const y1 = caseLength * colToY(from[1]) + caseLength / 2;
  const x2 = caseLength * rowToX(to[0]) + caseLength / 2;
  const y2 = caseLength * colToY(to[1]) + caseLength / 2;

  return (
    <svg className={cn("chess-play", { active: play.fromAnalyse })}>
      <defs>
        <marker id="arrowhead-pb" orient="auto" markerWidth="4" markerHeight="8" refX="2.05" refY="2.01">
          <path d="M0,0 V4 L3,2 Z"></path>
        </marker>
      </defs>
      <g>
        <line
          strokeWidth="18.6328125"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-pb)"
          opacity="0.4"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        ></line>
      </g>
    </svg>
  );
};

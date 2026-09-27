export const LANES = ["porch", "pink", "mint", "arch", "love"] as const;

export const TALE = [
  { mean: "before", color: "#e7c4b0", say: "She has not gone. He is beside the porch, not on the road." },
  { mean: "pink is her", color: "#f3b183", say: "Pink is her. The path wears her color. It is not a prize." },
  { mean: "mint is the well", color: "#9ecfb8", say: "Mint is the well. The pink is inside it. They enter together." },
  { mean: "the arch is the veil", color: "#f3d7a1", say: "The arch is the horizon. The city is beyond. He does not lead." },
  { mean: "love stays beside", color: "#c4a07a", say: "Love is beside. The horizon holds. He never went ahead." },
] as const;

const MINT = 2;
const LAST = LANES.length - 1;

export type Move = "step" | "beside" | "together";

export type Board = {
  she: number;
  he: number;
  line: string;
  won: boolean;
};

export function begin(): Board {
  return {
    she: 0,
    he: 0,
    line: "Side view. She plays. He stays beside, never ahead.",
    won: false,
  };
}

/** The board is the game. Pictures do not move it. */
export function act(board: Board, move: Move): Board {
  if (board.won) return board;
  const { she, he } = board;

  if (move === "beside") {
    if (he > she) return { ...board, he: she, line: "Not ahead. He comes back beside her." };
    if (he === she) return { ...board, line: "He is already beside her." };
    if (she === LAST) return { ...board, he: she, won: true, line: "Love. He came beside. He did not lead." };
    return { ...board, he: she, line: "He comes beside. He does not pass her." };
  }

  if (move === "step") {
    if (she >= LAST) return { ...board, line: "She is at love. Call him beside." };
    if (he < she) return { ...board, line: "He is behind. Call him before she goes on." };
    if (she + 1 === MINT) return { ...board, line: "The mint is for both. Go together." };
    return { ...board, she: she + 1, line: "She steps. He does not lead." };
  }

  if (he !== she) return { ...board, line: "Together means beside. He is not there yet." };
  if (she >= LAST) return { ...board, won: true, line: "Love. Side by side." };
  const next = she + 1;
  const won = next === LAST;
  return {
    she: next,
    he: next,
    won,
    line: won ? "Love. Side by side. He never went ahead." : next === MINT ? "Pink inside the mint. Both of them." : "They step. He is not ahead.",
  };
}

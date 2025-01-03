import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const initialPuzzle = [];
let initialPos;
let targetPos;

for await (const line of readLines(Deno.stdin)) {
  initialPuzzle.push(line.split(""));

  line.split("").forEach((value, colIndex) => {
    if (value === "S") {
      initialPos = [initialPuzzle.length - 1, colIndex];
    } else if (value === "E") {
      targetPos = [initialPuzzle.length - 1, colIndex];
    }
  });
}

const adjacentPositions = (puzzle, pos, usedPositions) => {
  const [row, col] = pos;
  const positions = [];

  // North
  if (row > 0) {
    if (puzzle[row - 1][col] === "." || puzzle[row - 1][col] === "E") {
      const posToString = `${row - 1}|${col}|`;
      if (!usedPositions.includes(posToString)) {
        positions.push([[row - 1, col], "N"]);
      }
    }
  }

  // South
  if (row < puzzle.length - 1) {
    if (puzzle[row + 1][col] === "." || puzzle[row + 1][col] === "E") {
      const posToString = `${row + 1}|${col}`;

      if (!usedPositions.includes(posToString)) {
        positions.push([[row + 1, col], "S"]);
      }
    }
  }

  // East
  if (col < puzzle[0].length - 1) {
    if (puzzle[row][col + 1] === "." || puzzle[row][col + 1] === "E") {
      const posToString = `${row}|${col + 1}`;

      if (!usedPositions.includes(posToString)) {
        positions.push([[row, col + 1], "E"]);
      }
    }
  }

  // West
  if (col > 0) {
    if (puzzle[row][col - 1] === "." || puzzle[row][col - 1] === "E") {
      const posToString = `${row}|${col - 1}`;

      if (!usedPositions.includes(posToString)) {
        positions.push([[row, col - 1], "W"]);
      }
    }
  }

  return positions;
};

const updatedScore = (score, lastDirection, currentDirection) => {
  // North
  if (
    lastDirection === "N" &&
    (currentDirection === "W" || currentDirection === "E")
  ) {
    return score + 1001;
  }

  // South
  if (
    lastDirection === "S" &&
    (currentDirection === "W" || currentDirection === "E")
  ) {
    return score + 1001;
  }

  // East
  if (
    lastDirection === "E" &&
    (currentDirection === "N" || currentDirection === "S")
  ) {
    return score + 1001;
  }

  // West
  if (
    lastDirection === "W" &&
    (currentDirection === "N" || currentDirection === "S")
  ) {
    return score + 1001;
  }

  return score + 1;
};

const lowestScorePath = (puzzle, initialPos, targetPos) => {
  let possiblePaths = [
    {
      path: [[initialPos, "E"]],
      total: 0,
    },
  ];
  let lowestScore = Number.MAX_VALUE;
  const visited = new Set();

  while (possiblePaths.length > 0) {
    const path = possiblePaths.pop();
    console.log("UIII", possiblePaths.length);

    const { path: currentPath, total: currentTotal } = path;
    const [lastPos, lastDirection] = currentPath[currentPath.length - 1];

    if (currentTotal > lowestScore) {
      continue;
    }

    if (lastPos[0] === targetPos[0] && lastPos[1] === targetPos[1]) {
      if (currentTotal < lowestScore) {
        console.log(
          "PATH FOUND, printing score and paths to still visit",
          currentTotal,
          possiblePaths.length,
        );

        lowestScore = currentTotal;
        break;
      }
    } else if (currentTotal < lowestScore) {
      const allUsedPositions = currentPath.map((pos) => {
        const [position, direction] = pos;

        return `${position[0]}|${position[1]}`;
      });

      if (visited.has(`${lastPos[0]}|${lastPos[1]}`)) {
        continue;
      }

      const adjacents = adjacentPositions(puzzle, lastPos, allUsedPositions);

      const parsedAdjacents = adjacents.map((adjacent) => {
        const [adjacentPos, adjacentDirection] = adjacent;
        const newTotal = updatedScore(
          currentTotal,
          lastDirection,
          adjacentDirection,
        );

        return {
          path: [...currentPath, [adjacentPos, adjacentDirection]],
          total: newTotal,
        };
      });

      parsedAdjacents.forEach((newPath) => {
        if (newPath.total < lowestScore) {
          possiblePaths.push(newPath);
        }
      });

      possiblePaths = possiblePaths.sort(
        (path1, path2) => path2.total - path1.total,
      );

      visited.add(`${lastPos[0]}|${lastPos[1]}`);
    }
  }

  return lowestScore;
};

console.log("function", lowestScorePath(initialPuzzle, initialPos, targetPos));

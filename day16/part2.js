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

const tilesPartOfBestPaths = (puzzle, initialPos, targetPos) => {
  let possiblePaths = [
    {
      path: [[initialPos, "E"]],
      total: 0,
    },
  ];
  let lowestScore = Number.MAX_VALUE;
  const inBestPaths = new Set();
  let visited = {};

  while (possiblePaths.length > 0) {
    const path = possiblePaths.pop();

    const { path: currentPath, total: currentTotal } = path;
    const [lastPos, lastDirection] = currentPath[currentPath.length - 1];

    if (currentTotal > lowestScore) {
      continue;
    }

    if (lastPos[0] === targetPos[0] && lastPos[1] === targetPos[1]) {
      if (currentTotal <= lowestScore) {
        lowestScore = currentTotal;

        currentPath.forEach((item) =>
          inBestPaths.add(`${item[0][0]}|${item[0][1]}`),
        );
      } else {
        break;
      }
    } else if (currentTotal < lowestScore) {
      const allUsedPositions = currentPath.map((pos) => {
        const [position, direction] = pos;

        return `${position[0]}|${position[1]}|`;
      });

      const currentPathKey = `${lastPos[0]}|${lastPos[1]}|${lastDirection}`;

      if (currentPathKey in visited && currentTotal > visited[currentPathKey]) {
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

      visited[currentPathKey] = currentTotal;
    }
  }

  return inBestPaths.size;
};

console.log(
  "tilesPartOfBestPaths",
  tilesPartOfBestPaths(initialPuzzle, initialPos, targetPos),
);

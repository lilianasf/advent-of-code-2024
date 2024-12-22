import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const map = [];
const starPosition = [];
let originalDirection;

for await (const line of readLines(Deno.stdin)) {
  const row = line.split("");

  row.forEach((char, colIndex) => {
    if (char !== "." && char !== "#") {
      originalDirection = char;
      starPosition.push(map.length, colIndex);
    }
  });

  map.push(row);
}

const isOutside = (map, row, col) => {
  if (row >= map.length || col >= map[0].length || row < 0 || col < 0) {
    return true;
  }

  return false;
};

const updateDirection = (direction) => {
  switch (direction) {
    case "v":
      return "<";
    case ">":
      return "v";
    case "^":
      return ">";
    case "<":
      return "^";
    default:
      return null;
  }
};

const updatePosition = (rowIndex, colIndex, direction) => {
  let newRowIndex = rowIndex;
  let newColIndex = colIndex;

  switch (direction) {
    case "v":
      newRowIndex += 1;
      break;
    case ">":
      newColIndex += 1;
      break;
    case "^":
      newRowIndex -= 1;
      break;
    case "<":
      newColIndex -= 1;
      break;
    default:
      break;
  }

  return [newRowIndex, newColIndex];
};

const previousPosition = (rowIndex, colIndex, direction) => {
  let prevRowIndex = rowIndex;
  let prevColIndex = colIndex;

  switch (direction) {
    case "v":
      prevRowIndex += 1;
      break;
    case ">":
      prevColIndex -= 1;
      break;
    case "^":
      prevRowIndex += 1;
      break;
    case "<":
      prevColIndex += 1;
      break;
    default:
      break;
  }

  return [prevRowIndex, prevColIndex];
};

const isLoop = (map, starPos, originalDirection, newObstaclePos) => {
  // Add new obstacle
  const newMap = map.map((row, rowIndex) => {
    const newRow = [...row];

    if (rowIndex === newObstaclePos[0]) {
      newRow[newObstaclePos[1]] = "o";
    }

    return newRow;
  });

  const positionsAndDirection = new Set();
  let currentRowIndex = starPos[0];
  let currentColIndex = starPos[1];
  let direction = originalDirection;
  let isLoop = false;

  while (!isOutside(newMap, currentRowIndex, currentColIndex) && !isLoop) {
    if (
      newMap[currentRowIndex][currentColIndex] === "#" ||
      newMap[currentRowIndex][currentColIndex] === "o"
    ) {
      direction = updateDirection(direction);

      const [nextRowIndex, nextColIndex] = updatePosition(
        currentRowIndex,
        currentColIndex,
        updateDirection(direction),
      );

      currentRowIndex = nextRowIndex;
      currentColIndex = nextColIndex;
    } else {
      const newPosAndDirection = `${currentRowIndex}|${currentColIndex}|${direction}`;
      const oldPositionsSize = positionsAndDirection.size;

      positionsAndDirection.add(newPosAndDirection);

      if (oldPositionsSize === positionsAndDirection.size) {
        isLoop = true;
      }

      const [newRowIndex, newColIndex] = updatePosition(
        currentRowIndex,
        currentColIndex,
        direction,
      );

      currentRowIndex = newRowIndex;
      currentColIndex = newColIndex;
    }
  }

  return isLoop;
};

let numberOfObstacleWithLoop = 0;

map.forEach((row, rowIndex) => {
  row.forEach((char, colIndex) => {
    if (char === ".") {
      const isSimulationALoop = isLoop(map, starPosition, originalDirection, [
        rowIndex,
        colIndex,
      ]);

      if (isSimulationALoop) {
        numberOfObstacleWithLoop += 1;
      }
    }
  });
});

//console.log(isLoop(map, starPosition, originalDirection, [6, 3]));
console.log(numberOfObstacleWithLoop);

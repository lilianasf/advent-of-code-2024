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

const positions = new Set();
let currentRowIndex = starPosition[0];
let currentColIndex = starPosition[1];
let direction = originalDirection;

while (!isOutside(map, currentRowIndex, currentColIndex)) {
  if (map[currentRowIndex][currentColIndex] === "#") {
    direction = updateDirection(direction);

    const [nextRowIndex, nextColIndex] = updatePosition(
      currentRowIndex,
      currentColIndex,
      updateDirection(direction),
    );

    currentRowIndex = nextRowIndex;
    currentColIndex = nextColIndex;
  } else {
    positions.add(`${currentRowIndex}|${currentColIndex}`);

    const [newRowIndex, newColIndex] = updatePosition(
      currentRowIndex,
      currentColIndex,
      direction,
    );

    currentRowIndex = newRowIndex;
    currentColIndex = newColIndex;
  }
}

console.log(positions.size);

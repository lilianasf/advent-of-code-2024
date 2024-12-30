import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const initialMap = [];
const moves = [];
let currentRobotPosition;

for await (const line of readLines(Deno.stdin)) {
  if (line === "") {
    continue;
  } else if (line.startsWith("#")) {
    const row = line.split("");

    const findRobotCol = row.findIndex((value) => value === "@");

    if (findRobotCol !== -1) {
      currentRobotPosition = [initialMap.length, findRobotCol];
    }
    initialMap.push(row);
  } else {
    const newMoves = line.split("");

    newMoves.forEach((move) => moves.push(move));
  }
}

const currentPosValue = (warehouseMap, newPos) => {
  const [row, col] = newPos;

  return warehouseMap[row][col];
};

const findFirstEmptySpot = (values, isReverse, startPos) => {
  let firstEmptySpot;

  for (let i = startPos; i < values.length; isReverse ? i-- : i++) {
    const currentValue = values[i];

    if (currentValue === "#") {
      return undefined;
    } else if (currentValue === ".") {
      return i;
    }
  }

  return firstEmptySpot;
};

const updateRobotPos = (
  warehouseMap,
  targetPos,
  oldPos,
  valuesOnSameLine,
  isReverse,
) => {
  const currentWarehouseMap = warehouseMap.map((row) => [...row]);
  let finalRobotPos;
  let updatedValuesOnSameLine;

  const [oldRow, oldCol] = oldPos;
  const [targetRowPos, targetColPos] = targetPos;
  const currentPosVal = currentPosValue(currentWarehouseMap, [
    targetRowPos,
    targetColPos,
  ]);

  if (currentPosVal === ".") {
    currentWarehouseMap[oldRow][oldCol] = ".";
    currentWarehouseMap[targetRowPos][targetColPos] = "@";
    finalRobotPos = [targetRowPos, targetColPos];
  } else if (currentPosVal === "O") {
    const currentValues = [...valuesOnSameLine];
    const currentRobotPos = valuesOnSameLine.findIndex(
      (value) => value === "@",
    );
    const findFirstEmptyPos = findFirstEmptySpot(
      valuesOnSameLine,
      isReverse,
      currentRobotPos,
    );

    if (findFirstEmptyPos >= 0 && findFirstEmptyPos >= 0) {
      if (isReverse) {
        for (let i = findFirstEmptyPos; i < currentRobotPos; i++) {
          currentValues[i] = valuesOnSameLine[i + 1];
        }

        currentValues[currentRobotPos] = ".";
      } else {
        for (let i = findFirstEmptyPos; i >= currentRobotPos; i--) {
          currentValues[i] = valuesOnSameLine[i - 1];
        }
      }

      if (valuesOnSameLine.join("") !== currentValues.join("")) {
        updatedValuesOnSameLine = currentValues;
      }
    }
  }

  return [currentWarehouseMap, finalRobotPos, updatedValuesOnSameLine];
};

const moveOnceRobot = (warehouseMap, currentRobotPos, move) => {
  let currentWarehouseMap = warehouseMap.map((row) => [...row]);
  const [row, col] = currentRobotPos;

  let finalRobotPos = currentRobotPos;

  if (move === "^") {
    if (row > 0) {
      const targetRowPos = row - 1;

      const [updatedMap, finalPos, updatedValuesOnSameLine] = updateRobotPos(
        currentWarehouseMap,
        [targetRowPos, col],
        finalRobotPos,
        currentWarehouseMap.map((currentRow) => currentRow[col]),
        true,
      );

      currentWarehouseMap = updatedMap;

      if (finalPos) {
        finalRobotPos = finalPos;
      }

      if (updatedValuesOnSameLine) {
        currentWarehouseMap.forEach((currentRow, index) => {
          currentWarehouseMap[index][col] = updatedValuesOnSameLine[index];
        });

        const newRobotRow = updatedValuesOnSameLine.findIndex(
          (value) => value === "@",
        );

        currentWarehouseMap[row][col] = ".";

        finalRobotPos = [newRobotRow, col];
      }
    }
  } else if (move === "<") {
    if (col > 0) {
      const targetColPos = col - 1;

      const [updatedMap, finalPos, updatedValuesOnSameLine] = updateRobotPos(
        currentWarehouseMap,
        [row, targetColPos],
        finalRobotPos,
        currentWarehouseMap[row],
        true,
      );

      currentWarehouseMap = updatedMap;

      if (finalPos) {
        finalRobotPos = finalPos;
      }

      if (updatedValuesOnSameLine) {
        currentWarehouseMap[row] = updatedValuesOnSameLine;
        const newRobotCol = updatedValuesOnSameLine.findIndex(
          (value) => value === "@",
        );
        finalRobotPos = [row, newRobotCol];

        currentWarehouseMap[row][col] = ".";
      }
    }
  } else if (move === ">") {
    if (col < currentWarehouseMap[0].length - 1) {
      const targetColPos = col + 1;

      const [updatedMap, finalPos, updatedValuesOnSameLine] = updateRobotPos(
        currentWarehouseMap,
        [row, targetColPos],
        finalRobotPos,
        currentWarehouseMap[row],
      );

      currentWarehouseMap = updatedMap;

      if (finalPos) {
        finalRobotPos = finalPos;
      }

      if (updatedValuesOnSameLine) {
        currentWarehouseMap[row] = updatedValuesOnSameLine;
        const newRobotCol = updatedValuesOnSameLine.findIndex(
          (value) => value === "@",
        );
        finalRobotPos = [row, newRobotCol];

        currentWarehouseMap[row][col] = ".";
      }
    }
  } else if (move === "v") {
    if (row < currentWarehouseMap.length - 1) {
      const targetRowPos = row + 1;

      const [updatedMap, finalPos, updatedValuesOnSameLine] = updateRobotPos(
        currentWarehouseMap,
        [targetRowPos, col],
        finalRobotPos,
        currentWarehouseMap.map((currentRow) => currentRow[col]),
      );

      currentWarehouseMap = updatedMap;

      if (finalPos) {
        finalRobotPos = finalPos;
      }

      if (updatedValuesOnSameLine) {
        currentWarehouseMap.forEach((currentRow, index) => {
          currentWarehouseMap[index][col] = updatedValuesOnSameLine[index];
        });

        const newRobotRow = updatedValuesOnSameLine.findIndex(
          (value) => value === "@",
        );

        currentWarehouseMap[row][col] = ".";

        finalRobotPos = [newRobotRow, col];
      }
    }
  }

  return [currentWarehouseMap, finalRobotPos];
};

const moveAllRobot = (warehouseMap, currentRobotPosition, moves) => {
  let currentWarehouseMap = warehouseMap.map((row) => [...row]);
  let currentRobotPos = [...currentRobotPosition];

  moves.forEach((move, index) => {
    const [warehouseMap, robotPos] = moveOnceRobot(
      currentWarehouseMap,
      currentRobotPos,
      move,
    );

    currentRobotPos = robotPos;
    currentWarehouseMap = warehouseMap;

    //printWarehouseMap(currentWarehouseMap);
  });

  return currentWarehouseMap;
};

const printWarehouseMap = (warehouseMap) => {
  warehouseMap.forEach((row) => {
    console.log(row.join(""));
  });
};

const boxGPSCoordinate = (boxPos) => {
  return 100 * boxPos[0] + boxPos[1];
};

const sumBoxesCoordinates = (warehouseMap) => {
  let sum = 0;

  warehouseMap.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === "O") {
        sum += boxGPSCoordinate([rowIndex, colIndex]);
      }
    });
  });

  return sum;
};

const currentWarehouseMap = moveAllRobot(
  initialMap,
  currentRobotPosition,
  moves,
);
console.log("sum", sumBoxesCoordinates(currentWarehouseMap));

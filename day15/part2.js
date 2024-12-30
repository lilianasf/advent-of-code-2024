import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const initialMap = [];
const moves = [];
let currentRobotPosition;

for await (const line of readLines(Deno.stdin)) {
  if (line === "") {
    continue;
  } else if (line.startsWith("#")) {
    const row = [];

    line.split("").forEach((value) => {
      if (value === "#") {
        row.push("#");
        row.push("#");
      } else if (value === "O") {
        row.push("[");
        row.push("]");
      } else if (value === ".") {
        row.push(".");
        row.push(".");
      } else if (value === "@") {
        row.push("@");
        row.push(".");
      }
    });

    initialMap.push(row);
  } else {
    const newMoves = line.split("");

    newMoves.forEach((move) => moves.push(move));
  }
}

initialMap.forEach((row, rowIndex) => {
  row.forEach((value, colIndex) => {
    if (value === "@") {
      currentRobotPosition = [rowIndex, colIndex];
    }
  });
});

const currentPosValue = (warehouseMap, newPos) => {
  const [row, col] = newPos;

  return warehouseMap[row][col];
};

const adjacentBoxes = (warehouseMap, boxPosition, move) => {
  const [leftPart, rightPart] = boxPosition;
  const [xLeftPart, yLeftPart] = leftPart;
  const [xRightPart, yRightPart] = rightPart;

  if (move === "^" && xLeftPart > 0) {
    const topLeftPosValue = warehouseMap[xLeftPart - 1][yLeftPart];

    if (topLeftPosValue === "[") {
      return [
        [
          [xLeftPart - 1, yLeftPart],
          [xLeftPart - 1, yLeftPart + 1],
        ],
      ];
    } else if (topLeftPosValue === "]" || topLeftPosValue === ".") {
      const boxes = [];

      if (topLeftPosValue === "]") {
        boxes.push([
          [xLeftPart - 1, yLeftPart - 1],
          [xLeftPart - 1, yLeftPart],
        ]);
      }

      if (yRightPart < warehouseMap[0].length - 1) {
        const topRightPosValue = warehouseMap[xRightPart - 1][yRightPart];

        if (topRightPosValue === "[") {
          boxes.push([
            [xRightPart - 1, yRightPart],
            [xRightPart - 1, yRightPart + 1],
          ]);
        }
      }

      return boxes;
    }
  } else if (move === "<" && yLeftPart > 0) {
    // Assuming: we can't have a box push two on the side
    const leftPosValue = warehouseMap[xLeftPart][yLeftPart - 1];

    if (leftPosValue === "]") {
      return [
        [
          [xLeftPart, yLeftPart - 2],
          [xLeftPart, yLeftPart - 1],
        ],
      ];
    }
  } else if (move === ">" && yRightPart < warehouseMap[0].length - 1) {
    // Assuming: we can't have a box push two on the side
    const leftPosValue = warehouseMap[xRightPart][yRightPart + 1];

    if (leftPosValue === "[") {
      return [
        [
          [xRightPart, yRightPart + 1],
          [xRightPart, yRightPart + 2],
        ],
      ];
    }
  } else if (move === "v" && xLeftPart < warehouseMap.length - 1) {
    const bottomLeftPosValue = warehouseMap[xLeftPart + 1][yLeftPart];

    if (bottomLeftPosValue === "[") {
      return [
        [
          [xLeftPart + 1, yLeftPart],
          [xLeftPart + 1, yLeftPart + 1],
        ],
      ];
    } else if (bottomLeftPosValue === "]" || bottomLeftPosValue === ".") {
      const boxes = [];

      if (bottomLeftPosValue === "]") {
        boxes.push([
          [xLeftPart + 1, yLeftPart - 1],
          [xLeftPart + 1, yLeftPart],
        ]);
      }

      if (yRightPart < warehouseMap[0].length - 1) {
        const bottomRightPosValue = warehouseMap[xRightPart + 1][yRightPart];

        if (bottomRightPosValue === "[") {
          boxes.push([
            [xRightPart + 1, yRightPart],
            [xRightPart + 1, yRightPart + 1],
          ]);
        }
      }

      return boxes;
    }
  }

  return [];
};

const canClusterMove = (warehouseMap, cluster, move) => {
  for (let i = 0; i < cluster.length; i++) {
    const currentBox = cluster[i];
    const [leftPart, rightPart] = currentBox;
    const [xLeftPart, yLeftPart] = leftPart;
    const [xRightPart, yRightPart] = rightPart;

    if (move === "^" && xLeftPart > 0) {
      const topLeftPosValue = warehouseMap[xLeftPart - 1][yLeftPart];
      const topRightPosValue = warehouseMap[xRightPart - 1][yRightPart];

      if (topLeftPosValue === "#" || topRightPosValue === "#") {
        return false;
      }
    } else if (move === "v" && xLeftPart < warehouseMap.length - 1) {
      const bottomLeftPosValue = warehouseMap[xLeftPart + 1][yLeftPart];
      const bottomRightPosValue = warehouseMap[xRightPart + 1][yRightPart];

      if (bottomLeftPosValue === "#" || bottomRightPosValue === "#") {
        return false;
      }
    } else if (move === ">" && yRightPart < warehouseMap[0].length - 1) {
      const rightLeftPosValue = warehouseMap[xLeftPart][yLeftPart + 1];
      const rightRightPosValue = warehouseMap[xRightPart][yRightPart + 1];

      if (rightLeftPosValue === "#" || rightRightPosValue === "#") {
        return false;
      }
    } else if (move === "<" && yLeftPart > 0) {
      const leftLeftPosValue = warehouseMap[xLeftPart][yLeftPart - 1];
      const leftRightPosValue = warehouseMap[xRightPart][yRightPart - 1];

      if (leftLeftPosValue === "#" || leftRightPosValue === "#") {
        return false;
      }
    }
  }

  return true;
};

const findCluster = (warehouseMap, robotPosition, move) => {
  const [xPos, yPos] = robotPosition;

  let startBoxPos;

  if (move === "^" && xPos > 0) {
    const topPosValue = warehouseMap[xPos - 1][yPos];

    if (topPosValue === "[") {
      startBoxPos = [
        [xPos - 1, yPos],
        [xPos - 1, yPos + 1],
      ];
    } else if (topPosValue === "]") {
      startBoxPos = [
        [xPos - 1, yPos - 1],
        [xPos - 1, yPos],
      ];
    }
  } else if (move === "<" && yPos > 0) {
    // Assuming: we can't have a box push two on the side
    const leftPosValue = warehouseMap[xPos][yPos - 1];

    if (leftPosValue === "]") {
      startBoxPos = [
        [xPos, yPos - 2],
        [xPos, yPos - 1],
      ];
    }
  } else if (move === ">" && yPos < warehouseMap[0].length - 1) {
    // Assuming: we can't have a box push two on the side
    const leftPosValue = warehouseMap[xPos][yPos + 1];

    if (leftPosValue === "[") {
      startBoxPos = [
        [xPos, yPos + 1],
        [xPos, yPos + 2],
      ];
    }
  } else if (move === "v" && xPos < warehouseMap.length - 1) {
    const bottomPosValue = warehouseMap[xPos + 1][yPos];

    if (bottomPosValue === "[") {
      startBoxPos = [
        [xPos + 1, yPos],
        [xPos + 1, yPos + 1],
      ];
    } else if (bottomPosValue === "]") {
      startBoxPos = [
        [xPos + 1, yPos - 1],
        [xPos + 1, yPos],
      ];
    }
  }

  if (!startBoxPos) {
    return [];
  }

  const boxesToExplore = [startBoxPos];
  const cluster = [];

  while (boxesToExplore.length > 0) {
    const currentBox = boxesToExplore.pop();

    adjacentBoxes(warehouseMap, currentBox, move).forEach((box) => {
      boxesToExplore.push(box);
    });

    cluster.push(currentBox);
  }

  return cluster;
};

const sortCluster = (cluster, sortBy, asc) => {
  return cluster.sort((a, b) => {
    if (sortBy === "row") {
      if (asc) {
        return b[0][0] - a[0][0];
      } else {
        return a[0][0] - b[0][0];
      }
    } else {
      return a[0][1] - b[0][1];
    }
  });
};

const moveOnceRobot = (warehouseMap, currentRobotPos, move) => {
  const currentWarehouseMap = warehouseMap.map((row) => [...row]);
  const [row, col] = currentRobotPos;

  let finalRobotPos = currentRobotPos;

  if (move === "^") {
    if (row > 0) {
      const targetRobotRow = row - 1;
      const currentCluster = findCluster(warehouseMap, currentRobotPos, move);

      if (currentCluster.length > 0) {
        if (canClusterMove(warehouseMap, currentCluster, move)) {
          const sortedCluster = sortCluster(currentCluster, "row", false);

          sortedCluster.forEach((box) => {
            const [leftPart, rightPart] = box;
            const [xLeftPart, yLeftPart] = leftPart;
            const [xRightPart, yRightPart] = rightPart;

            currentWarehouseMap[xLeftPart - 1][yLeftPart] = "[";
            currentWarehouseMap[xRightPart - 1][yRightPart] = "]";

            currentWarehouseMap[xLeftPart][yLeftPart] = ".";
            currentWarehouseMap[xRightPart][yRightPart] = ".";
          });

          currentWarehouseMap[targetRobotRow][col] = "@";
          currentWarehouseMap[row][col] = ".";
          finalRobotPos = [targetRobotRow, col];
        }
      } else {
        if (warehouseMap[targetRobotRow][col] === ".") {
          currentWarehouseMap[row][col] = ".";
          currentWarehouseMap[targetRobotRow][col] = "@";
          finalRobotPos = [targetRobotRow, col];
        }
      }
    }
  } else if (move === "<") {
    if (col > 0) {
      const targetRobotCol = col - 1;
      const currentCluster = findCluster(warehouseMap, currentRobotPos, move);

      if (currentCluster.length > 0) {
        if (canClusterMove(warehouseMap, currentCluster, move)) {
          const sortedCluster = sortCluster(currentCluster, "col", true);

          sortedCluster.forEach((box) => {
            const [leftPart, rightPart] = box;
            const [xLeftPart, yLeftPart] = leftPart;
            const [xRightPart, yRightPart] = rightPart;

            currentWarehouseMap[xLeftPart][yLeftPart - 1] = "[";
            currentWarehouseMap[xRightPart][yRightPart - 1] = "]";
          });

          currentWarehouseMap[row][targetRobotCol] = "@";
          currentWarehouseMap[row][col] = ".";
          finalRobotPos = [row, targetRobotCol];
        }
      } else {
        if (warehouseMap[row][targetRobotCol] === ".") {
          currentWarehouseMap[row][col] = ".";
          currentWarehouseMap[row][targetRobotCol] = "@";
          finalRobotPos = [row, targetRobotCol];
        }
      }
    }
  } else if (move === ">") {
    if (col < currentWarehouseMap[0].length - 1) {
      const targetRobotCol = col + 1;
      const currentCluster = findCluster(warehouseMap, currentRobotPos, move);

      if (currentCluster.length > 0) {
        if (canClusterMove(warehouseMap, currentCluster, move)) {
          const sortedCluster = sortCluster(currentCluster, "col", false);

          sortedCluster.forEach((box) => {
            const [leftPart, rightPart] = box;
            const [xLeftPart, yLeftPart] = leftPart;
            const [xRightPart, yRightPart] = rightPart;

            currentWarehouseMap[xLeftPart][yLeftPart + 1] = "[";
            currentWarehouseMap[xRightPart][yRightPart + 1] = "]";
          });

          currentWarehouseMap[row][targetRobotCol] = "@";
          currentWarehouseMap[row][col] = ".";
          finalRobotPos = [row, targetRobotCol];
        }
      } else {
        if (warehouseMap[row][targetRobotCol] === ".") {
          currentWarehouseMap[row][col] = ".";
          currentWarehouseMap[row][targetRobotCol] = "@";
          finalRobotPos = [row, targetRobotCol];
        }
      }
    }
  } else if (move === "v") {
    if (row < warehouseMap.length) {
      const targetRobotRow = row + 1;
      const currentCluster = findCluster(warehouseMap, currentRobotPos, move);
      if (currentCluster.length > 0) {
        if (canClusterMove(warehouseMap, currentCluster, move)) {
          const sortedCluster = sortCluster(currentCluster, "row", true);

          sortedCluster.forEach((box) => {
            const [leftPart, rightPart] = box;
            const [xLeftPart, yLeftPart] = leftPart;
            const [xRightPart, yRightPart] = rightPart;

            currentWarehouseMap[xLeftPart + 1][yLeftPart] = "[";
            currentWarehouseMap[xRightPart + 1][yRightPart] = "]";

            currentWarehouseMap[xLeftPart][yLeftPart] = ".";
            currentWarehouseMap[xRightPart][yRightPart] = ".";
          });

          currentWarehouseMap[targetRobotRow][col] = "@";
          currentWarehouseMap[row][col] = ".";
          finalRobotPos = [targetRobotRow, col];
        }
      } else {
        if (warehouseMap[targetRobotRow][col] === ".") {
          currentWarehouseMap[row][col] = ".";
          currentWarehouseMap[targetRobotRow][col] = "@";
          finalRobotPos = [targetRobotRow, col];
        }
      }
    }
  }

  return [currentWarehouseMap, finalRobotPos];
};

const moveAllRobot = (warehouseMap, currentRobotPosition, moves) => {
  let currentWarehouseMap = warehouseMap.map((row) => [...row]);
  let currentRobotPos = [...currentRobotPosition];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const [warehouseMap, robotPos] = moveOnceRobot(
      currentWarehouseMap,
      currentRobotPos,
      move,
    );

    currentRobotPos = robotPos;
    currentWarehouseMap = warehouseMap;

    //printWarehouseMap(currentWarehouseMap);
  }

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
      if (value === "[") {
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

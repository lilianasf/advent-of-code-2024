import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const robotsInfo = [];

for await (const line of readLines(Deno.stdin)) {
  const [left, right] = line.split(" ");
  const [, pos] = left.split("=");
  const [, offset] = right.split("=");

  const [posX, posY] = pos.split(",");
  const [offsetX, offsetY] = offset.split(",");

  const currentRobot = {
    pos: {
      x: Number(posX),
      y: Number(posY),
    },
    offset: {
      x: Number(offsetX),
      y: Number(offsetY),
    },
  };

  robotsInfo.push(currentRobot);
}

const moveToTheRight = (x, offset, xMax) => {
  let currentX = x;
  for (let i = 0; i < offset; i++) {
    if (currentX + 1 > xMax) {
      currentX = 0;
    } else {
      currentX += 1;
    }
  }

  return currentX;
};

const moveToTheLeft = (x, offset, xMax) => {
  let currentX = x;
  for (let i = 0; i < offset; i++) {
    if (currentX - 1 < 0) {
      currentX = xMax;
    } else {
      currentX -= 1;
    }
  }

  return currentX;
};

const moveToTheTop = (y, offset, yMax) => {
  let currentY = y;
  for (let i = 0; i < offset; i++) {
    if (currentY - 1 < 0) {
      currentY = yMax;
    } else {
      currentY -= 1;
    }
  }

  return currentY;
};

const moveToTheBottom = (y, offset, yMax) => {
  let currentY = y;
  for (let i = 0; i < offset; i++) {
    if (currentY + 1 > yMax) {
      currentY = 0;
    } else {
      currentY += 1;
    }
  }

  return currentY;
};

const moveOneTime = (vx, vy, pos, xMax, yMax) => {
  const [x, y] = pos;
  let newX = x;
  let newY = y;

  if (vx > 0) {
    newX = moveToTheRight(x, vx, xMax);
  }

  if (vx < 0) {
    newX = moveToTheLeft(x, Math.abs(vx), xMax);
  }

  if (vy > 0) {
    newY = moveToTheBottom(y, vy, yMax);
  }

  if (vy < 0) {
    newY = moveToTheTop(y, Math.abs(vy), yMax);
  }

  return [newX, newY];
};

const quadrant = (pos, xMax, yMax) => {
  const [x, y] = pos;
  const middleX = xMax / 2;
  const middleY = yMax / 2;

  if (x < middleX) {
    if (y < middleY) {
      return "first";
    } else if (y > middleY) {
      return "fourth";
    }
  } else if (x > middleX) {
    if (y < middleY) {
      return "second";
    } else if (y > middleY) {
      return "third";
    }
  }

  return undefined;
};

const robotsPositionsAfterOneTime = (robots, xMax, yMax) => {
  const positionsInQuadrantsMap = {
    first: {},
    second: {},
    third: {},
    fourth: {},
  };
  const newRobots = robots.map((robot) => structuredClone(robot));

  robots.forEach((robotInfo, index) => {
    const { pos, offset } = robotInfo;
    const [x, y] = moveOneTime(offset.x, offset.y, [pos.x, pos.y], xMax, yMax);
    const robotKey = `${x}|${y}`;
    const currentRobotQuadrant = quadrant([x, y], xMax, yMax);
    newRobots[index].pos = {
      x,
      y,
    };

    if (currentRobotQuadrant) {
      if (robotKey in positionsInQuadrantsMap[currentRobotQuadrant]) {
        positionsInQuadrantsMap[currentRobotQuadrant][robotKey] =
          positionsInQuadrantsMap[currentRobotQuadrant][robotKey] + 1;
      } else {
        positionsInQuadrantsMap[currentRobotQuadrant][robotKey] = 1;
      }
    }
  });

  return [positionsInQuadrantsMap, newRobots];
};

const printRobotsPositions = (robots, xMax, yMax) => {
  const allPositions = Array(yMax + 1).fill(Array(xMax + 1).fill("."));

  robots.forEach((robotInfo) => {
    const { x, y } = robotInfo.pos;

    const newRow = [...allPositions[y]];

    newRow[x] = "#";
    allPositions[y] = newRow;
  });

  allPositions.forEach((row) => console.log(row.join("")));
};

const robotsAfterXTimes = (robots, xMax, yMax, times) => {
  let robotsMap = robots.map((robot) => structuredClone(robot));
  let quadrantsMap = {};

  for (let i = 0; i < times; i++) {
    const [newQuadrantsMap, newRobotMaps] = robotsPositionsAfterOneTime(
      robotsMap,
      xMax,
      yMax,
    );

    robotsMap = newRobotMaps.map((robot) => structuredClone(robot));
    quadrantsMap = structuredClone(newQuadrantsMap);
  }

  return [quadrantsMap, robotsMap];
};

const safetyFactor = (robots, xMax, yMax, times) => {
  const [quadrantsMap] = robotsAfterXTimes(robots, xMax, yMax, times);

  let totalPerQuadrant = 1;

  Object.values(quadrantsMap).forEach((quadrantValues) => {
    totalPerQuadrant =
      totalPerQuadrant * Object.values(quadrantValues).reduce((a, b) => a + b);
  });

  return totalPerQuadrant;
};

const xMaxExample = 10;
const yMaxExample = 6;

const xMaxInput = 100;
const yMaxInput = 102;

console.log(safetyFactor(robotsInfo, xMaxInput, yMaxInput, 100));

import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const stonesMap = {};

for await (const line of readLines(Deno.stdin)) {
  const stones = line.split(" ");

  stones.forEach((stone) => {
    if (stone in stonesMap) {
      stonesMap[stone] = stonesMap[stone] + 1;
    } else {
      stonesMap[stone] = 1;
    }
  });
}

const stoneAfterBlinkArray = (stone) => {
  let updatedStone = [];

  if (stone === "0") {
    updatedStone = ["1"];
  } else if (stone.length % 2 === 0) {
    const middleIndex = stone.length / 2 - 1;

    const stoneToArray = stone.split("");

    const leftPart = stoneToArray.slice(0, middleIndex + 1).join("");
    const rightPart = stoneToArray
      .slice(middleIndex + 1, stone.length)
      .join("");

    const newStone = [];

    if (leftPart.startsWith("0")) {
      newStone.push(parseInt(leftPart).toString());
    } else if (!leftPart.startsWith("0")) {
      newStone.push(leftPart);
    }

    if (rightPart.startsWith("0")) {
      newStone.push(parseInt(rightPart).toString());
    } else if (!rightPart.startsWith("0")) {
      newStone.push(rightPart);
    }

    updatedStone = newStone;
  } else {
    updatedStone = [(Number(stone) * 2024).toString()];
  }

  return updatedStone;
};

const blink = (stonesAndCountMap) => {
  const stonesAfterBlinkMap = {};

  Object.keys(stonesAndCountMap).forEach((stone) => {
    const updatedStone = stoneAfterBlinkArray(stone) || [];
    const stoneCount = stonesAndCountMap[stone];
    console.log("stoneCount", stoneCount);

    updatedStone.forEach((stone) => {
      if (stone in stonesAfterBlinkMap) {
        stonesAfterBlinkMap[stone] =
          stonesAfterBlinkMap[stone] + 1 * stoneCount;
      } else {
        stonesAfterBlinkMap[stone] = 1 * stoneCount;
      }
    });
  });

  return stonesAfterBlinkMap;
};

const blinkNTimes = (n, stonesMap) => {
  let finalStones = stonesMap;

  for (let i = 0; i < n; i++) {
    console.log("N", i);
    finalStones = blink(finalStones);
  }

  console.log(finalStones);
  return Object.values(finalStones).reduce((a, b) => a + b);
};

console.log(blinkNTimes(75, stonesMap));

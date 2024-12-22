import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

let stones;

for await (const line of readLines(Deno.stdin)) {
  stones = line.split(" ");
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

const blink = (originalStones) => {
  const copyStones = [...originalStones];
  const stonesAfterBlink = [];

  copyStones.forEach((stone) => {
    stoneAfterBlinkArray(stone).forEach((stone) => {
      stonesAfterBlink.push(stone);
    });
  });

  return stonesAfterBlink;
};

const blinkNTimes = (n, stones) => {
  let finalStones = stones;

  for (let i = 0; i < n; i++) {
    finalStones = blink(finalStones);
  }

  console.log("final", finalStones);
  return finalStones.length;
};

console.log(blinkNTimes(25, stones));

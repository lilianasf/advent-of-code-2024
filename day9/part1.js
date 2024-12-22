import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

let diskMap = "";

for await (const line of readLines(Deno.stdin)) {
  diskMap += line;
}

const transformDiskMapToArray = (diskMap) => {
  const diskMapArray = diskMap.split("");
  let transformedDiskMap = [];

  let lastFileIndex = -1;

  for (let i = 0; i < diskMapArray.length; i += 2) {
    const emptySpacePosition = i + 1;
    const usedSpace = diskMap[i];
    const fileIndex = lastFileIndex + 1;
    const transformedUsedSpace = Array(Number(usedSpace)).fill(fileIndex);
    let transformedEmptySpace = [];

    if (emptySpacePosition < diskMapArray.length) {
      const emptySpace = diskMap[i + 1];
      transformedEmptySpace = Array(Number(emptySpace)).fill(".");
    }

    transformedDiskMap = transformedDiskMap.concat(
      transformedUsedSpace,
      transformedEmptySpace,
    );

    lastFileIndex++;
  }

  return transformedDiskMap;
};

const moveFiles = (diskMapArray) => {
  const transformedDiskMapArray = [...diskMapArray];
  const numberOfEmptySlots = transformedDiskMapArray.filter(
    (value) => value === ".",
  ).length;

  const numberOfDigits = transformedDiskMapArray.length - numberOfEmptySlots;
  let isToMoveFile = true;

  while (isToMoveFile) {
    const firstEmptySplot = transformedDiskMapArray.findIndex(
      (value) => value === ".",
    );
    const lastDigit = transformedDiskMapArray.findLastIndex(
      (value) => value !== ".",
    );

    transformedDiskMapArray[firstEmptySplot] =
      transformedDiskMapArray[lastDigit];
    transformedDiskMapArray[lastDigit] = ".";

    isToMoveFile = transformedDiskMapArray
      .slice(0, numberOfDigits)
      .some((value) => value === ".");
  }

  return transformedDiskMapArray;
};

const checksum = (diskMap) => {
  const transformedDiskMapToArray = transformDiskMapToArray(diskMap);
  const finalDiskMapArray = moveFiles(transformedDiskMapToArray);

  let sum = 0;
  let i = 0;

  while (finalDiskMapArray[i] !== ".") {
    const value = finalDiskMapArray[i];
    const currentResult = Number(value) * i;

    sum += currentResult;

    i++;
  }

  return sum;
};

console.log(checksum(diskMap));

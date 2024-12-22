import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

let diskMap = "";

for await (const line of readLines(Deno.stdin)) {
  diskMap += line;
}

const transformDiskMapToArrayAndMap = (diskMap) => {
  const diskMapArray = diskMap.split("");
  const filesPositionsAndLengthMap = {};
  const emptySpacesPositions = [];
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

    filesPositionsAndLengthMap[lastFileIndex + 1] = [
      transformedDiskMap.length,
      transformedUsedSpace.length,
    ];

    emptySpacesPositions.push([
      transformedDiskMap.length + transformedUsedSpace.length,
      transformedEmptySpace.length,
    ]);

    transformedDiskMap = transformedDiskMap.concat(
      transformedUsedSpace,
      transformedEmptySpace,
    );

    lastFileIndex++;
  }

  return {
    diskMap: transformedDiskMap,
    filesMap: filesPositionsAndLengthMap,
    emptyPositions: emptySpacesPositions,
  };
};

const moveFilesOneCycle = (data) => {
  const { diskMap, filesMap, emptyPositions } = data;
  const transformedDiskMapArray = [...diskMap];

  for (
    let fileKeyIndex = Object.keys(filesMap).length - 1;
    fileKeyIndex >= 0;
    fileKeyIndex--
  ) {
    const fileKey = Object.keys(filesMap)[fileKeyIndex];

    const [fileStartPosition, fileSize] = filesMap[fileKey];

    for (
      let emptySpaceIndex = 0;
      emptySpaceIndex < emptyPositions.length;
      emptySpaceIndex++
    ) {
      const [startPosition, size] = emptyPositions[emptySpaceIndex];
      const isToMove = size >= fileSize && startPosition <= fileStartPosition;
      //(startPosition === fileStartPosition - 1 && size === 1);

      if (isToMove) {
        // move file to the first slot of empty positions
        for (let i = startPosition; i <= startPosition + fileSize - 1; i++) {
          transformedDiskMapArray[i] = fileKey;
        }

        // set file old positions to empty
        for (let j = fileStartPosition; j < fileStartPosition + fileSize; j++) {
          //if (j > startPosition + fileSize - 1) {
          //}
          transformedDiskMapArray[j] = ".";
        }

        // Update empty spaces after using them
        if (size === fileSize) {
          emptyPositions.splice(emptySpaceIndex, 1);
        } else {
          emptyPositions[emptySpaceIndex] = [
            startPosition + fileSize,
            size - fileSize,
          ];
        }

        break;
      }
    }
  }

  return transformedDiskMapArray;
};

const filesAndEmptySpacesMaps = (diskMap) => {
  let currentKey;
  let currentStartPos;
  let size = 0;

  const emptyPositions = [];
  const filesMap = {};

  diskMap.forEach((value, index) => {
    const parsedValue = value.toString();

    if (!currentKey) {
      currentKey = parsedValue.toString();
      currentStartPos = index;
      size = 1;
    } else {
      if (parsedValue !== currentKey) {
        const newValue = [currentStartPos, size];

        if (currentKey === ".") {
          emptyPositions.push(newValue);
        } else {
          filesMap[currentKey] = newValue;
        }

        currentKey = parsedValue;
        currentStartPos = index;
        size = 1;
      } else {
        if (index === diskMap.length - 1) {
          const newValue = [currentStartPos, size + 1];

          if (currentKey === ".") {
            emptyPositions.push(newValue);
          } else {
            filesMap[currentKey] = newValue;
          }
        }

        size += 1;
      }
    }
  });

  return {
    diskMap,
    filesMap,
    emptyPositions,
  };
};

const moveFiles = (diskMap) => {
  const data = transformDiskMapToArrayAndMap(diskMap);

  let isToMove = true;
  let currentDiskAndFilesData = data;
  let i = 0;

  while (isToMove) {
    const oldDiskMap = currentDiskAndFilesData.diskMap;
    const newDiskMap = moveFilesOneCycle(currentDiskAndFilesData);

    currentDiskAndFilesData = filesAndEmptySpacesMaps(newDiskMap);

    console.log("AQUII newdisk", newDiskMap.join(""));
    console.log("AQUII old", oldDiskMap.join(""));
    console.log(
      "AQUII currentDiskAndFilesData",
      currentDiskAndFilesData.diskMap.join(""),
    );
    console.log("-------------");

    if (oldDiskMap.join("") === currentDiskAndFilesData.diskMap.join("")) {
      isToMove = false;
    }

    if (i === 0) {
      isToMove = false;
    }

    i++;
  }

  return currentDiskAndFilesData.diskMap;
};

const checksum = (diskMap) => {
  const finalDiskMapArray = moveFiles(diskMap);

  let sum = 0;

  finalDiskMapArray.forEach((value, index) => {
    if (value !== ".") {
      const currentResult = Number(value) * index;

      sum += currentResult;
    }
  });

  return sum;
};

console.log(checksum(diskMap));

//console.log(moveFiles(transformDiskMapToArrayAndMap(diskMap)));

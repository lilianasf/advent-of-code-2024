import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const defaultMachineValues = {
  A: {
    x: 0,
    y: 0,
  },
  B: {
    x: 0,
    y: 0,
  },
  Prize: {
    x: 0,
    y: 0,
  },
};
const machines = [];
let currentMachine = structuredClone(defaultMachineValues);

for await (const line of readLines(Deno.stdin)) {
  if (line === "") {
    machines.push(currentMachine);
    currentMachine = structuredClone(defaultMachineValues);
  } else if (line.startsWith("Button")) {
    const [buttonName, values] = line.split(":");
    const [, name] = buttonName.split(" ");
    const [xPart, yPart] = values.split(",");
    const [, x] = xPart.split("+");
    const [, y] = yPart.split("+");

    currentMachine[name] = {
      x: Number(x),
      y: Number(y),
    };
  } else if (line.startsWith("Prize")) {
    const [name, values] = line.split(":");
    const [xPart, yPart] = values.split(",");
    const [, x] = xPart.split("=");
    const [, y] = yPart.split("=");

    currentMachine[name] = {
      x: Number(x) + 10000000000000,
      y: Number(y) + 10000000000000,
    };
  }
}

// Add last machine
machines.push(currentMachine);

const timesForAandB = (machine) => {
  const timesForADenominator =
    machine.A.y * machine.B.x - machine.A.x * machine.B.y;
  const timesForANumerator =
    machine.Prize.y * machine.B.x - machine.Prize.x * machine.B.y;
  const timesForA = timesForANumerator / timesForADenominator;

  const timesForBNumerator = machine.Prize.x - machine.A.x * timesForA;
  const timesForBDenominator = machine.B.x;
  const timesForB = timesForBNumerator / timesForBDenominator;

  return {
    A: timesForA,
    B: timesForB,
  };
};

const numberOfTokens = (timesForAandB) => {
  return timesForAandB.A * 3 + timesForAandB.B * 1;
};

const numberOfTokenToWinAllPrizes = (machines) => {
  let totalTokens = 0;

  machines.forEach((machine) => {
    const times = timesForAandB(machine);
    const tokens = numberOfTokens(times);
    const isPossibleToWin = Number.isInteger(tokens);

    if (isPossibleToWin) {
      totalTokens += tokens;
    }
  });

  return totalTokens;
};

console.log(numberOfTokenToWinAllPrizes(machines));

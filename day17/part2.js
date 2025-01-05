import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const initialRegisters = {};
let initialProgram;

for await (const line of readLines(Deno.stdin)) {
  if (line === "") {
    continue;
  } else {
    if (line.startsWith("Register")) {
      const [, registerNameUnparsed, registerValue] = line.split(" ");
      const registerName = registerNameUnparsed.split(":")[0];

      initialRegisters[registerName] = Number(registerValue);
    } else if (line.startsWith("Program")) {
      const [, unparsedProgram] = line.split(" ");

      initialProgram = unparsedProgram.split(",").map((item) => Number(item));
    }
  }

  line.split("").forEach((value, colIndex) => {
    if (value === "S") {
      initialPos = [initialPuzzle.length - 1, colIndex];
    } else if (value === "E") {
      targetPos = [initialPuzzle.length - 1, colIndex];
    }
  });
}

const comboOperand = (operand, registers) => {
  if ([0, 1, 2, 3, 7].includes(operand)) {
    return operand;
  } else {
    if (operand === 4) {
      return registers.A;
    } else if (operand === 5) {
      return registers.B;
    } else if (operand === 6) {
      return registers.C;
    }
  }
};

const runInstruction = (instruction, operand, registers) => {
  const combo = comboOperand(operand, registers);
  let pointer;
  let output;
  const newRegisters = structuredClone(registers);

  if (instruction === 0) {
    newRegisters.A = Math.floor(newRegisters.A / Math.pow(2, combo));
  } else if (instruction === 1) {
    newRegisters.B = Number(BigInt(operand) ^ BigInt(newRegisters.B));
  } else if (instruction === 2) {
    newRegisters.B = combo % 8;
  } else if (instruction === 3) {
    if (newRegisters.A !== 0) {
      pointer = operand;
    }
  } else if (instruction === 4) {
    newRegisters.B = Number(BigInt(newRegisters.B) ^ BigInt(newRegisters.C));
  } else if (instruction === 5) {
    output = combo % 8;
  } else if (instruction === 6) {
    newRegisters.B = Math.floor(newRegisters.A / Math.pow(2, combo));
  } else if (instruction === 7) {
    newRegisters.C = Math.floor(newRegisters.A / Math.pow(2, combo));
  }

  return {
    pointer,
    output,
    registers: newRegisters,
  };
};

const runProgram = (registers, program) => {
  let finalRegisters = structuredClone(registers);
  let i = 0;
  const finalOutput = [];

  while (i < program.length) {
    const instruction = program[i];
    const operand = program[i + 1];
    const {
      pointer,
      output,
      registers: newRegisters,
    } = runInstruction(instruction, operand, finalRegisters);

    i = pointer === undefined ? i + 2 : pointer;

    if (output !== undefined) {
      finalOutput.push(output);
    }

    finalRegisters = newRegisters;
  }

  return finalOutput;
};

const findAValue = (registers, program) => {
  const programString = program.join(",");
  let i = 1;

  //while (finalOutputString !== programString) {
  for (;;) {
    const finalRegisters = structuredClone(registers);
    finalRegisters.A = i;

    const currentOutput = runProgram(finalRegisters, program);
    const currentOutputString = currentOutput.join(",");

    if (programString === currentOutputString) {
      return i;
    }

    if (programString.endsWith(currentOutputString)) {
      console.log("A | output", i, currentOutputString);
      i *= 8;
      continue;
    }

    i++;
  }
};

console.log("findAValue", findAValue(initialRegisters, initialProgram));

import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const equations = [];

for await (const line of readLines(Deno.stdin)) {
  const [total, equationNumbers] = line.split(":");
  const parsedEquationNumbers = equationNumbers
    .trim()
    .split(" ")
    .map((number) => Number(number));

  equations.push({
    total: Number(total),
    numbers: parsedEquationNumbers,
  });
}

const canBeMadeTrue = (equation) => {
  const { total, numbers } = equation;

  let possibleCombinationsTotals = [numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    const newCombinations = [];

    while (possibleCombinationsTotals.length > 0) {
      const currentTotal = possibleCombinationsTotals.pop();
      const totalWithAddOperator = currentTotal + numbers[i];
      const totalWithMultiplyOperator = currentTotal * numbers[i];
      const totalWithConcatenationOperator = Number(
        [currentTotal, numbers[i]].join(""),
      );

      if (totalWithAddOperator <= total) {
        newCombinations.push(totalWithAddOperator);
      }

      if (totalWithMultiplyOperator <= total) {
        newCombinations.push(totalWithMultiplyOperator);
      }

      if (totalWithConcatenationOperator <= total) {
        newCombinations.push(totalWithConcatenationOperator);
      }
    }

    possibleCombinationsTotals = newCombinations;
  }

  return possibleCombinationsTotals.some(
    (possibleTotal) => total === possibleTotal,
  );
};

const sumOfAllThatCanBeMadeTrue = (equations) => {
  let sum = 0;

  equations.forEach((equation) => {
    if (canBeMadeTrue(equation)) {
      sum += equation.total;
    }
  });

  return sum;
};

console.log(sumOfAllThatCanBeMadeTrue(equations));

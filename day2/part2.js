import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const reports = [];

for await (const line of readLines(Deno.stdin)) {
  reports.push(line.split(" ").map((value) => Number(value)));
}

const getIsReportSafe = (report) => {
  const isAsc = report[0] < report[1];
  const lastIndex = report.length - 1;

  for (let i = 0; i < lastIndex; i++) {
    const currentReport = report[i];
    const nextReport = report[i + 1];
    const difference = Math.abs(nextReport - currentReport);
    const isGraduallyChanging = difference >= 1 && difference <= 3;

    if (!isGraduallyChanging) {
      return false;
    }

    const isNextHigher = nextReport > currentReport;

    if ((isAsc && !isNextHigher) || (!isAsc && isNextHigher)) {
      return false;
    }

    if (i === lastIndex - 1) {
      return true;
    } else {
      continue;
    }
  }
};

let numberOfSafeReports = 0;

reports.forEach((report) => {
  const isReportSafe = getIsReportSafe(report);

  if (!isReportSafe) {
    for (let i = 0; i < report.length; i++) {
      const newReport = report.toSpliced(i, 1);

      if (getIsReportSafe(newReport)) {
        return (numberOfSafeReports += 1);
      }
    }
  }

  if (isReportSafe) {
    numberOfSafeReports += 1;
  }
});

console.log(numberOfSafeReports);

import fs from "fs";

export async function executeWithRetries<T>(
  fn: () => Promise<T>,
  retries = 3,
  err?: any
): Promise<T> {
  return retries == 0
    ? Promise.reject(err)
    : fn().catch((error) => executeWithRetries(fn, retries - 1, error));
}

export const writeToFile = (path: string, content: Buffer | string) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, content, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(undefined);
    })
  );

export const getWeekNumber = (date: Date): number => {
  const initDate = new Date(date.getFullYear(), 0, 1); // todo
  const endWeekOffet = 7 - initDate.getDay();
  let endWeek = new Date(initDate);
  endWeek.setDate(endWeek.getDate() + endWeekOffet);
  let currentWeek = 1;
  while (date > endWeek) {
    currentWeek++;
    endWeek.setDate(endWeek.getDate() + 7);
  }
  return currentWeek;
};

import { CalcStatsFn, RawData } from "../definitions";

interface MonthStat {
  monthNr: number;
  year: number;
  longestPost: number;
}

/**
 * Average character length of posts per month
 */
export const longestPostPerMonth: CalcStatsFn = (rawData: RawData) => {
  const monthStats: MonthStat[] = rawData.months.map((month) => {
    return {
      monthNr: month.monthNr,
      year: month.yearNr,
      longestPost: month.longestPostLenght,
    };
  });
  return { name: "longestPostMonth", stats: monthStats };
};

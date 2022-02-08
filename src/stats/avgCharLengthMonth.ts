import { CalcStatsFn, RawData } from "../definitions";

interface MonthStat {
  monthNr: number;
  year: number;
  avgCharLength: number;
}

/**
 * Average character length of posts per month
 */
export const calculateAvgCharLengthMonth: CalcStatsFn = (rawData: RawData) => {
  const monthStats: MonthStat[] = rawData.months.map((month) => {
    return {
      monthNr: month.monthNr,
      year: month.yearNr,
      avgCharLength: month.totalChars / month.totalPosts,
    };
  });
  return { name: "avgCharLengthMonth", stats: monthStats };
};

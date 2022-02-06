import { CalcStatsFn, Month, PostSummary } from "../definitions";

// todo extract this definition
interface MonthStat {
  monthNr: number;
  year: number;
  avgCharLength: number;
}

/**
 * Average character length of posts per month
 */
export const calculateAvgCharLengthMonth: CalcStatsFn = (months: Month[]) => {
  const monthStats: MonthStat[] = months.map((month) => {
    return {
      monthNr: month.monthNr,
      year: month.year,
      avgCharLength: getAvgLengthPost(month.posts),
    };
  });
  return { name: "avgCharLengthMonth", stats: monthStats };
};

/**
 * Calculates the average post lenght of a list of post summaries
 * 
 * @param {PostSummary[]} posts - list of post summaries
 * @returns {number} - average post length
 */
const getAvgLengthPost = (posts: PostSummary[]): number => {
  return posts.reduce((acc, post) => acc + post.length, 0) / posts.length;
};

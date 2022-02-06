import { CalcStatsFn, Month, PostSummary } from "../definitions";

interface MonthStat {
  monthNr: number;
  year: number;
  longestPost: number;
}

export const longestPostPerMonth: CalcStatsFn = (months: Month[]) => {
  // Average character length of posts per month
  const monthStats: MonthStat[] = months.map((month) => {
    return {
      monthNr: month.monthNr,
      year: month.year,
      longestPost: getLongestPost(month.posts),
    };
  });
  return { name: "longestPostMonth", stats: monthStats };
};

const getLongestPost = (posts: PostSummary[]): number => {
  return Math.max.apply(
    Math,
    posts.map((post) => post.length)
  );
};

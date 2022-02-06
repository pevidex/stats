import { CalcStatsFn, Month, Post, PostSummary } from "../definitions";
import { getWeekNumber } from "../utils";

interface WeekStat {
  weekNr: number;
  year: number;
  totalPosts: number;
}

export const calculateTotalPostsWeek: CalcStatsFn = (months: Month[]) => {
  // Average character length of posts per month
  const postSummaries: PostSummary[] = months.reduce(
    (accum: PostSummary[], month) => accum.concat(month.posts),
    []
  );
  const weeks: WeekStat[] = [];
  postSummaries.forEach((post) => {
    const year = post.date.getFullYear();
    const weekNr = getWeekNumber(post.date);
    let week = weeks.find(
      (_week) => _week.year == year && _week.weekNr == weekNr
    );
    if (!week) {
      week = {
        weekNr,
        year,
        totalPosts: 0,
      };
      weeks.push(week);
    }
    week.totalPosts++;
  });
  return { name: "totalPostsWeek", stats: weeks };
};

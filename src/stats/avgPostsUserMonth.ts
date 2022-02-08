import { CalcStatsFn, RawData, Stat } from "../definitions";

export interface UsersStats {
  userId: string;
  avgPostsMonth: number;
}

/**
 * Average number of posts per user per month
 */
export const calculateAvgPostsUserMonth: CalcStatsFn = (
  rawData: RawData
): Stat => {
  const userStats: UsersStats[] = rawData.users.map((userData) => {
    return {
      userId: userData.user,
      avgPostsMonth:
        userData.monthStats.reduce(
          (accum, month) => accum + month.totalPosts,
          0
        ) / rawData.months.length,
    };
  });
  return { name: "avgPostsUserMonth", stats: userStats };
};

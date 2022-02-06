import { CalcStatsFn, Month, Stat } from "../definitions";

// todo extract this definition
interface UsersStats {
  [key: string]: number;
}

/**
 * Average number of posts per user per month
 */
export const calculateAvgPostsUserMonth: CalcStatsFn = (
  months: Month[]
): Stat => {
  let stat: UsersStats = {};
  /**
   * 
   */
  months.forEach((month) => {
    return month.posts.forEach((post) => {
      const user = post.user;
      if (stat[user]) {
        return stat[user]++;
      }
      stat[user] = 1;
    });
  });
  for (const user in stat) {
    // I assumed we're dividing by the number of months we have data for
    // If a certain month has no posts from any user at all it will not be counted
    stat[user] = stat[user] == 0 ? 0 : stat[user] / months.length;
  }
  return { name: "avgPostsUserMonth", stats: stat };
};

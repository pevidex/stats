import { CalcStatsFn, RawData } from "../definitions";

/**
 * Average character length of posts per month
 */
export const calculateTotalPostsWeek: CalcStatsFn = (rawData: RawData) => {
  return { name: "totalPostsWeek", stats: rawData.weeks };
};

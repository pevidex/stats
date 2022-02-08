import { MonthData, Post, RawData, UserData, WeekData } from "../definitions";
import { executeWithRetries, getWeekNumber } from "../utils";
import { PostsParams } from "./httpService";

export class ApiError extends Error {}
export class HttpError extends Error {}

export class TokenError extends ApiError {}

export const getPostRawData = async (
  numberOfPages: number,
  fetchPostsByPage: (params: PostsParams) => Promise<Post[]>,
  fetchToken: () => Promise<string>
): Promise<RawData> => {
  const fn = () =>
    fetchToken().then(async (token) => {
      // create a list of numbers like: [1,2,3,4,...,numberOfPages]
      const pagesList: number[] = [...Array(numberOfPages).keys()];
      const rawData: RawData = { months: [], weeks: [], users: [] };
      // For memory concern issues we are iterating page by page and update rawData
      for (const page of pagesList) {
        await fetchPostsByPage({ sl_token: token, page }).then((posts) =>
          updateRawData(posts, rawData)
        );
      }
      return rawData;
    });
  return executeWithRetries(fn);
};

/**
 * Mutates an object to contain the data from the post served as input
 *
 * @param {Post} post - post to be extracted the metadata
 * @param {MonthData[]} months - list of months to be updated
 */
const updateMonthData = (post: Post, months: MonthData[]) => {
  const date = new Date(post.created_time);
  const monthNr = date.getMonth();
  const yearNr = date.getFullYear();

  let month = months.find(
    (_month) => _month.yearNr == yearNr && _month.monthNr == monthNr
  );
  if (!month) {
    // create and push month
    month = {
      yearNr,
      monthNr,
      longestPostLenght: post.message.length,
      totalChars: post.message.length,
      totalPosts: 1,
    };
    months.push(month);
  } else {
    // update month metadata
    month.totalChars += post.message.length;
    month.longestPostLenght =
      month.longestPostLenght < post.message.length
        ? post.message.length
        : month.longestPostLenght;
    month.totalPosts++;
  }
};

/**
 * Mutates an object to contain the data from the post served as input
 *
 * @param {Post} post - post to be extracted the metadata
 * @param {WeekData[]} weeks - list of weeks to be updated
 */
const updateWeekData = (post: Post, weeks: WeekData[]) => {
  const date = new Date(post.created_time);
  const weekNr = getWeekNumber(date);
  const yearNr = date.getFullYear();

  let week = weeks.find(
    (_week) => _week.yearNr == yearNr && _week.weekNr == weekNr
  );
  if (!week) {
    // create and push week
    week = {
      yearNr,
      weekNr,
      totalPosts: 1,
    };
    weeks.push(week);
  } else {
    // update week
    week.totalPosts++;
  }
};

/**
 * Mutates an object to contain the data from the post served as input
 *
 * @param {Post} post - post to be extracted the metadata
 * @param {UserData[]} users - list of users to be updated (only one will)
 */
const updateUserData = (post: Post, users: UserData[]) => {
  const date = new Date(post.created_time);
  const yearNr = date.getFullYear();
  const monthNr = date.getMonth();
  const userId = post.from_id;

  let user = users.find((_userId) => _userId.user == userId);
  if (!user) {
    // create and push user
    user = {
      user: userId,
      monthStats: [
        {
          yearNr,
          monthNr,
          longestPostLenght: post.message.length,
          totalChars: post.message.length,
          totalPosts: 1,
        },
      ],
    };
    users.push(user);
  } else {
    // see if user has a month data obj
    const month = user.monthStats.find(
      (_month) => _month.yearNr == yearNr && _month.monthNr == monthNr
    );
    if (!month) {
      // create and push month to user data
      user.monthStats.push({
        monthNr,
        yearNr,
        totalPosts: 1,
        totalChars: post.message.length,
        longestPostLenght: post.message.length,
      });
    } else {
      // update month to user data
      month.totalChars += post.message.length;
      month.longestPostLenght =
        month.longestPostLenght < post.message.length
          ? post.message.length
          : month.longestPostLenght;
      month.totalPosts++;
    }
  }
};

/**
 * Based on a list of posts mutates a god data object with all the required info
 * to calculate stats
 *
 * @param {Post[]} posts - list of posts
 * @param {RawData} rawData - god data object
 */
const updateRawData = (posts: Post[], rawData: RawData): void => {
  posts.forEach((post) => {
    updateMonthData(post, rawData.months);
    updateWeekData(post, rawData.weeks);
    updateUserData(post, rawData.users);
  });
};

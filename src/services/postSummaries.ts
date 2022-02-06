import { Month, Post, PostSummary } from "../definitions";
import { executeWithRetries, getNameForMonthNr } from "../utils";
import { PostsParams } from "./httpService";

export class ApiError extends Error {}
export class HttpError extends Error {}

export class TokenError extends ApiError {}

export const getPostSummaries = (
  numberOfPages: number,
  fetchPostsByPage: (params: PostsParams) => Promise<Post[]>,
  fetchToken: () => Promise<string>
): Promise<Month[]> => {
  const fn = () =>
    fetchToken().then((token) => {
      // create a list of numbers like: [1,2,3,4,...,numberOfPages]
      const pagesList: number[] = [...Array(numberOfPages).keys()];
      const postSummariesQueries = pagesList.map((page) =>
        fetchPostsByPage({ sl_token: token, page }).then(postsToSummaries)
      );
      return Promise.all(postSummariesQueries).then((postsSummaries) =>
        postsSummaries.flat()
      );
    });
  return executeWithRetries(fn).then(organizePerYearAndMonth);
};

const organizePerYearAndMonth = (posts: PostSummary[]): Month[] => {
  const months: Month[] = [];
  posts.forEach((post) => {
    const date = post.date;
    const yearNr = date.getFullYear();
    const monthNr = date.getMonth();
    let monthObj = months.find((month) => month.monthNr == monthNr && month.year == yearNr);
    if (!monthObj) {
      monthObj = {
        year: yearNr,
        monthNr: monthNr,
        posts: [],
        monthName: getNameForMonthNr(monthNr),
      };
      months.push(monthObj);
    }
    monthObj.posts.push(post);
  });
  return months;
};

const postsToSummaries = (posts: Post[]): PostSummary[] => {
  return posts.map((post) => {
    return {
      date: new Date(post.created_time),
      user: post.from_id,
      length: post.message.length,
    };
  });
};

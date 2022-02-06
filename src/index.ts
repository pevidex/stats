import { CalcStatsFn, Post, Stat } from "./definitions";
import {
  fetchPostsByPageGen,
  fetchTokenGen,
  PostsParams,
} from "./services/httpService";
import { getPostSummaries } from "./services/postSummaries";
import { calculateAvgCharLengthMonth } from "./stats/avgCharLengthMonth";
import { writeToFile } from "./utils";
import dotenv from "dotenv";
import { longestPostPerMonth } from "./stats/longestPostMonth";
import { calculateTotalPostsWeek } from "./stats/totalPostsWeek";
import { calculateAvgPostsUserMonth } from "./stats/avgPostsUserMonth";

/**
 * Main file
 * 
 * Some considerations:
 * - I decided to focus on certain aspects that took me time from testing and validating the stats functions;
 * - The focus on my approach was to add the ability to easily remove and add new stat functions
 * - In some situations I took advantage on the assumption we're going to have only 10 pages of data.
 *  This reduce a bit the amount of work but could easily adapted to fetch N number of pages.
 * - Despite memory consumption not being mentioned as a concern, I adopted the
 *  class PostSummary instead of Post to avoid handling post content.
 * - I added a really small test coverage just to show how I would test things. 
 *  It was not asked, so I didn't focus much on that.
 * - Stats response could have a more appealing structure and merge the monthly stats together.
 **/

dotenv.config();

const numberOfPages = Number(process.env.POSTS_PAGES) || 10;
const clientId = process.env.CLIENT_ID;
const email = process.env.EMAIL;
const name = process.env.NAME || "Default name";
const apiUrl = process.env.API_URL;
const pathJsonStats = process.env.JSON_PATH;

// todo requires more strict validation
if (
  !numberOfPages ||
  isNaN(numberOfPages as number) ||
  !clientId ||
  !email ||
  !name ||
  !apiUrl ||
  !pathJsonStats
) {
  console.info("Please, configure your env variables");
  throw new Error("Mising environment variables");
}

const tokenUrl = `${apiUrl}/assignment/register`;
const postsUrl = `${apiUrl}/assignment/posts`;

// function generators to facilitate dependency injection and consequently testing
const fetchTokenFn = fetchTokenGen(clientId, email, name, tokenUrl);
const fetchPagesFn = fetchPostsByPageGen(postsUrl);
const writeToFileFn = (filePath: string) => (content: string | Buffer) =>
  writeToFile(filePath, content);

const statsToResponse = (stats: Stat[]) => {stats};

export const main = async (
  fetchToken: () => Promise<string>,
  fetchPages: (postParams: PostsParams) => Promise<Post[]>,
  writeToFile: (content: string | Buffer) => Promise<any>
): Promise<void> => {
  // list of stats functions to be executed
  const listOfCalFns: CalcStatsFn[] = [
    longestPostPerMonth,
    calculateAvgCharLengthMonth,
    calculateTotalPostsWeek,
    calculateAvgPostsUserMonth,
  ];

  return getPostSummaries(numberOfPages, fetchPages, fetchToken)
    .then((postSummaries) => listOfCalFns.map((fn) => fn(postSummaries)))
    .then(statsToResponse)
    .then(JSON.stringify)
    .then(writeToFile)
    .catch(console.error);
};

/**
 * TODO:
 * - add a test to a stat;
 * - add a test to the main endpoint;
 * - add comments;
 * - review stat structure;
 * - add a readme;
 * - reset github commits;
 */

main(fetchTokenFn, fetchPagesFn, writeToFileFn(pathJsonStats));

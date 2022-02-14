import { CalcStatsFn, Post, Stat } from "./definitions";
import {
  fetchPostsByPageGen,
  fetchTokenGen,
  PostsParams,
} from "./services/httpService";
import { getPostRawData } from "./services/postsRawData";
import { calculateAvgCharLengthMonth } from "./stats/avgCharLengthMonth";
import { writeToFile } from "./utils";
import dotenv from "dotenv";
import { longestPostPerMonth } from "./stats/longestPostMonth";
import { calculateTotalPostsWeek } from "./stats/totalPostsWeek";
import { calculateAvgPostsUserMonth } from "./stats/avgPostsUserMonth";

/**
 * Some considerations:
 * - I decided to focus on the following aspects:
 *   1) ability to add, remove stat functions easily;
 *   2) Memory consumption by not storing the posts and by not reading all
 *      the request pages at once.
 *   3) Performance is also being taken into consideration by avoiding unnecessary cycles;
 *   4) ability to easily mock external dependencies for testing purposes
 *   5) clear separation of concerns and project organization
 * - I could improve at:
 *   1) Tests were not my focus here. I have some to display how I would test, but it lacks coverage;
 *   2) Output object could have a better defined type
 *   3) There are some scenarios I would like to test that I believe can have flaws. 
 *      The function to calculate the weeknr for example. I though about bringing a library to calculate this
 *      However I went for my own implementation for fun.
 *   4) Input validations and documentation could also be strictier
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

const statsToResponse = (stats: Stat[]) => {
  return { stats };
};

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

  return getPostRawData(numberOfPages, fetchPages, fetchToken)
    .then((rawData) => listOfCalFns.map((fn) => fn(rawData)))
    .then(statsToResponse)
    .then(JSON.stringify)
    .then(writeToFile)
    .catch(console.error);
};

//Since this is index.ts, this func call should be commented. 
//Otherwise importing this file wil have this executed (ex: tests)
main(fetchTokenFn, fetchPagesFn, writeToFileFn(pathJsonStats));

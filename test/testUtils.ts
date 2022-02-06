import { Post, PostSummary } from "../src/definitions";

export const generateListOfPostsSummariesPerUser = (
  user: string,
  month: number,
  year: number,
  nrPosts: number
): PostSummary[] => {
  let posts: PostSummary[] = [];
  for (let i = 1; i <= nrPosts; i++) {
    posts.push({
      date: new Date(year, month, i, 10),
      user,
      length: Math.round(Math.random() * (500 - 10) + 10),
    });
  }
  return posts;
};

export const generateListOfPostsPerUser = (
  user: string,
  month: number,
  year: number,
  nrPosts: number
): Post[] => {
  let posts: Post[] = [];
  for (let i = 1; i <= nrPosts; i++) {
    posts.push({
      id: "some-id",
      created_time: new Date(year, month, i, 10),
      from_id: user,
      from_name: "",
      type: "",
      message: new Array(i+1).join("a"),
    });
  }
  return posts;
};

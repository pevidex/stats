import { expect } from "chai";
import { Post } from "../src/definitions";
import { main } from "../src/index";
import { PostsParams } from "../src/services/httpService";
import { generateListOfPostsPerUser } from "./testUtils";

describe("main", () => {
  it("should return the expected stats", function () {
    const posts: Post[] = [
      // 2021
      ...generateListOfPostsPerUser("user1", 0, 2021, 3),
      ...generateListOfPostsPerUser("user2", 0, 2021, 1),
      // 2020
      ...generateListOfPostsPerUser("user1", 11, 2020, 2),
      ...generateListOfPostsPerUser("user2", 11, 2020, 0),
    ];

    // for simplicity I will use this function to perform the asserts;
    const writeToFile = (content: string | Buffer) => {
      const stats = JSON.parse(content as string).stats;
      const stats1 = stats[0] //longestPostMonth;
      const stats2 = stats[1] //avgCharLengthMonth;
      const stats3 = stats[2] //totalPostsWeek;
      const stats4 = stats[3] //avgPostsUserMonth;

      expect(stats1.name).to.be.eql("longestPostMonth");
      expect(stats1.stats[0].longestPost).to.be.eql(3);
      expect(stats1.stats[1].longestPost).to.be.eql(2);
      
      expect(stats2.name).to.be.eql("avgCharLengthMonth");
      expect(stats2.stats[0].avgCharLength).to.be.eql(1.75);
      expect(stats2.stats[1].avgCharLength).to.be.eql(1.5);

      expect(stats3.name).to.be.eql("totalPostsWeek");
      expect(stats3.stats[0].totalPosts).to.be.eql(4);
      expect(stats3.stats[1].totalPosts).to.be.eql(1);

      expect(stats4.name).to.be.eql("avgPostsUserMonth");
      expect(stats4.stats[0]["user1"]).to.be.eql(2.5);
      expect(stats4.stats[1]["user2"]).to.be.eql(0.5);
      return Promise.resolve(undefined);
    };
    main(
      () => Promise.resolve("some-token"),
      (postParams: PostsParams) => Promise.resolve(posts),
      writeToFile
    );
  });
});

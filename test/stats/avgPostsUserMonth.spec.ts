import { expect } from "chai";
import { Month } from "../../src/definitions";
import { calculateAvgPostsUserMonth } from "../../src/stats/avgPostsUserMonth";
import { generateListOfPostsSummariesPerUser } from "../testUtils";

describe("calculateAvgPostsUserMonth", () => {
  it("should return expected values", () => {
    const january: Month = {
      year: 2021,
      monthNr: 0,
      monthName: "January",
      posts: [
        ...generateListOfPostsSummariesPerUser("user1", 0, 2021, 16),
        ...generateListOfPostsSummariesPerUser("user2", 0, 2021, 8),
      ],
    };
    const february: Month = {
      year: 2021,
      monthNr: 1,
      monthName: "February",
      posts: [...generateListOfPostsSummariesPerUser("user1", 1, 2021, 1)],
    };
    const april: Month = {
      year: 2022,
      monthNr: 3,
      monthName: "April",
      posts: [...generateListOfPostsSummariesPerUser("user1", 3, 2022, 11)],
    };
    const september: Month = {
      year: 2022,
      monthNr: 8,
      monthName: "September",
      posts: [
        ...generateListOfPostsSummariesPerUser("user1", 8, 2022, 2),
        ...generateListOfPostsSummariesPerUser("user2", 8, 2022, 4),
      ],
    };
    const usersStats = calculateAvgPostsUserMonth([
      january,
      february,
      april,
      september,
    ]).stats;
    expect(usersStats["user1"]).to.be.eql(7.5);
    expect(usersStats["user2"]).to.be.eql(3);
  });
});

import { expect } from "chai";
import { MonthData } from "../../src/definitions";
import { calculateAvgPostsUserMonth, UsersStats } from "../../src/stats/avgPostsUserMonth";

describe("calculateAvgPostsUserMonth", () => {
  it("should return expected values", () => {
    const months: MonthData[] = [
      {
        yearNr: 2021,
        monthNr: 0,
        totalChars: 120,
        totalPosts: 2,
        longestPostLenght: 100,
      },
      {
        yearNr: 2021,
        monthNr: 1,
        totalChars: 240,
        totalPosts: 4,
        longestPostLenght: 120,
      },
      {
        yearNr: 2022,
        monthNr: 3,
        totalChars: 1200,
        totalPosts: 16,
        longestPostLenght: 340,
      },
      {
        yearNr: 2022,
        monthNr: 8,
        totalChars: 400,
        totalPosts: 5,
        longestPostLenght: 140,
      },
    ];
    const usersStats = calculateAvgPostsUserMonth({
      months: months,
      weeks: [],
      users: [{ user: "user1", monthStats: months }],
    }).stats;
    const user1: UsersStats = usersStats.find((user: UsersStats) => user.userId == "user1");
    expect(user1.avgPostsMonth).to.be.eql(6.75);
  });
});

import { expect } from "chai";
import { getWeekNumber } from "../src/utils";

describe("getWeekNumber", () =>{
  it("should return expected weekNumbers", () => {
    const inputExpected = [
      { input: new Date("2021-12-31T13:49:10.000Z"), expected: 53 },
      { input: new Date("2021-01-19T13:49:10.000Z"), expected: 4 },
      { input: new Date("2021-01-03T13:49:10.000Z"), expected: 2 },
      { input: new Date("2021-01-02T00:00:00.000Z"), expected: 1 },
      { input: new Date("2021-01-01T00:00:00.000Z"), expected: 1 },
    ];
    inputExpected.forEach((inEx) =>
      expect(getWeekNumber(inEx.input)).to.be.equal(inEx.expected)
    );
  });
});

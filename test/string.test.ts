import { Enum } from "../src/index";

const StringExample = Enum({
  ONE: "one",
  TWO: "two",
});

test("cast returns matched values", () => {
  expect(StringExample.cast("one")).toEqual("one");
});

test("cast returns undefined for unmatched values", () => {
  expect(StringExample.cast("three")).toBeUndefined();
});

test("cast returns undefined for null values", () => {
  expect(StringExample.cast(null)).toBeUndefined();
});

test("cast returns undefined for undefined values", () => {
  expect(StringExample.cast(undefined)).toBeUndefined();
});

test("isValid returns true for matched values", () => {
  expect(StringExample.isValid("one")).toBe(true);
});

test("isValid returns false for unmatched values", () => {
  expect(StringExample.isValid("three")).toBe(false);
});

test("members iterates over all values", () => {
  const members = Array.from(StringExample.members());
  expect(members).toEqual(["one", "two"]);
});

test("getName returns the correct name", () => {
  const name = StringExample.getName("one");
  expect(name).toBe("ONE");
});

test("can access members", () => {
  expect(StringExample.ONE).toBe("one");
  expect(StringExample.TWO).toBe("two");
});

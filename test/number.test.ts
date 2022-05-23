import { Enum } from "../src/index";

const NumberExample = Enum({
  ONE: 1,
  TWO: 2,
});

test("cast returns matched values", () => {
  expect(NumberExample.cast(1)).toEqual(1);
});

test("cast returns undefined for unmatched values", () => {
  expect(NumberExample.cast(3)).toBeUndefined();
});

test("cast returns undefined for null values", () => {
  expect(NumberExample.cast(null)).toBeUndefined();
});

test("cast returns undefined for undefined values", () => {
  expect(NumberExample.cast(undefined)).toBeUndefined();
});

test("isValid returns true for matched values", () => {
  expect(NumberExample.isValid(1)).toBe(true);
});

test("isValid returns false for unmatched values", () => {
  expect(NumberExample.isValid(3)).toBe(false);
});

test("members iterates over all values", () => {
  const members = Array.from(NumberExample.members());
  expect(members).toEqual([1, 2]);
});

test("getName returns the correct name", () => {
  const name = NumberExample.getName(1);
  expect(name).toBe("ONE");
});

test("can access members", () => {
  expect(NumberExample.ONE).toBe(1);
  expect(NumberExample.TWO).toBe(2);
});

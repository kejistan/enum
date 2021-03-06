import { Enum, EnumValue } from "../src/index";

const NumericExample = Enum({
  ONE: 1,
  TWO: 2,
});
type NumericExample = EnumValue<typeof NumericExample>;

const StringExample = Enum({
  ONE: "one",
  TWO: "two",
});
type StringExample = EnumValue<typeof StringExample>;

// Mixed definitions should error
// @ts-expect-error
Enum({
  ONE: 1,
  TWO: "two",
});

// Forbid lowercase names for enums
// @ts-expect-error
Enum({
  one: 1,
  two: 2,
});

// Allow capitalized names for enums
Enum({
  One: 1,
  Two: 2,
});

// string enums and number enums should be distinct
// @ts-expect-error
expectError(NumericExample.cast("one"));
// @ts-expect-error
expectError(StringExample.cast(1));

// Enum types are correct
(value: NumericExample) => {
  const valid: 1 | 2 = value;
  // @ts-expect-error
  const invalid: 3 = value;
};

(value: StringExample) => {
  const valid: "one" | "two" = value;
  // @ts-expect-error
  const invalid: "three" = value;
};

// Cast should be able to result in undefined
(value: number) => {
  const result = NumericExample.cast(value);
  // @ts-expect-error
  const invalid: NumericExample = result;
  if (result) {
    const valid: NumericExample = result;
  }
};

(value: string) => {
  const result = StringExample.cast(value);
  // @ts-expect-error
  const invalid: StringExample = result;
  if (result) {
    const valid: StringExample = result;
  }
};

// Members resolve to specific types
// This diverges from flow but it helps with exhaustive switch checking
() => {
  const valid: 1 = NumericExample.ONE;
};

() => {
  const valid: "one" = StringExample.ONE;
};

// Exhaustive switch checks work
(value: NumericExample) => {
  switch (value) {
    case NumericExample.ONE:
      return true;
    case NumericExample.TWO:
      return true;
  }

  const assert: never = value;
};

(value: StringExample) => {
  switch (value) {
    case StringExample.ONE:
      return true;
    case StringExample.TWO:
      return true;
  }

  const assert: never = value;
};

// isValid does refinement
(value: number) => {
  // @ts-expect-error
  const invalid: NumericExample = value;
  if (NumericExample.isValid(value)) {
    const valid: NumericExample = value;
  }
};

(value: string) => {
  // @ts-expect-error
  const invalid: StringExample = value;
  if (StringExample.isValid(value)) {
    const valid: StringExample = value;
  }
};

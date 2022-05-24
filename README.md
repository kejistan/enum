# @kejistan/enum

Inspired by [the enum implementation in Flow](https://flow.org/en/docs/enums/). This attempts to bring some similar sanity to TypeScript.

## Usage

Define enums via `Enum` and `EnumValue`. Enum keys must be capitalized, lowercased names will result in type errors to avoid potential collisions with enum methods. Values can be strings or numbers, but all values must be of the same type:

```ts
import { Enum, EnumValue } from "@kejistan/enum";

const MyStringEnum = Enum({
  ValueOne: "one",
  ValueTwo: "two",
});

type MyStringEnum = EnumValue<typeof MyStringEnum>;

const MyNumericEnum = Enum({
  ValueOne: 1,
  ValueTwo: 2,
});

type MyNumericEnum = EnumValue<typeof MyNumericEnum>;
```

You can use the enum to access the specific values or to check and coerce unchecked values:

```ts
function doSomethingWithAnEnumValue(value: MyStringEnum) {
  switch (value) {
    case MyStringEnum.ValueOne:
      // ...
      break;
    case MyStringEnum.ValueTwo:
      // ...
      break;
  }
}

function processRawString(value: string) {
  const enumValue = MyStringEnum.cast(value) ?? MyStringEnum.ValueOne;
  doSomethingWithAnEnumValue(enumValue);
}

function somethingElseWithAString(value: string) {
  if (MyStringEnum.isValid(value)) {
    doSomethingWithAnEnumValue(value);
  }
}
```

## Missing features

Mirrored enum definitions. Currently you need to manually define both the name and the value. This is verbose for the common usecase of name === value.

Enum values are not their own nominative types. This means that overlapping enum values are comparable. Values are also implicitly convertible to their representation type (i.e. string or number).

Enums with unknown members aren't implemented as I don't know of a mechanism to describe that in TypeScript.

The Enum value type and the Enum collection are not exported via a single definition statement (this is the need for the extra `EnumValue` declaration). I'm not sure how to replicate this in TypeScript

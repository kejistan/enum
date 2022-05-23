interface BaseStringEnum<T extends string> {
  cast(input: string | null | undefined): T | undefined;
  isValid(input: string | null | undefined): input is T;
  members(): Iterable<T>;
  getName(value: T): string;
}

interface BaseNumericEnum<T extends number> {
  cast(input: number | null | undefined): T | undefined;
  isValid(input: number | null | undefined): input is T;
  members(): Iterable<T>;
  getName(value: T): string;
}

export type StringEnum<T extends Record<string, string>> = BaseStringEnum<
  T[keyof T]
> & {
  readonly [Name in keyof T]: T[Name];
};

export type NumericEnum<T extends Record<string, number>> = BaseNumericEnum<
  T[keyof T]
> & {
  readonly [Name in keyof T]: T[Name];
};

export function Enum<Values extends number, T extends Record<string, Values>>(
  definition: T & Record<Capitalize<keyof T & string>, unknown>
): NumericEnum<T>;
export function Enum<Value extends string, T extends Record<string, Value>>(
  definition: T & Record<Capitalize<keyof T & string>, unknown>
): StringEnum<typeof definition>;
export function Enum(
  definition: Record<string, string> | Record<string, number>
): StringEnum<any> | NumericEnum<any> {
  class AnEnum extends BaseEnumType<any> {
    constructor() {
      super(definition);

      Object.entries(definition).forEach(([key, value]) => {
        (this as any)[key] = value;
      });
    }
  }

  return new AnEnum();
}

export type EnumType<T extends BaseNumericEnum<any> | BaseStringEnum<any>> =
  NonNullable<ReturnType<T["cast"]>>;

type EnumDefinition = {
  valuesToNames?: Map<unknown, string>;
  namesToValues: Record<string, any>;
};

class BaseEnumType<T extends string | number> {
  cast(input: string | number | null | undefined): T | undefined {
    if (this.isValid(input)) {
      return input;
    }

    return undefined;
  }

  isValid(input: string | number | null | undefined): input is T {
    return this.#getValuesToNames().has(input);
  }

  members(): Iterable<T> {
    return Object.values(this.#definition.namesToValues);
  }

  getName(value: T): string {
    return this.#getValuesToNames().get(value)!;
  }

  constructor(definition: Record<string, T>) {
    this.#definition = {
      namesToValues: Object.freeze(definition),
    };
  }

  #definition: EnumDefinition;

  #getValuesToNames() {
    if (!this.#definition.valuesToNames) {
      this.#definition.valuesToNames = new Map(
        Object.entries(this.#definition.namesToValues).map(([key, val]) => [
          val,
          key,
        ])
      );
    }

    return this.#definition.valuesToNames;
  }
}

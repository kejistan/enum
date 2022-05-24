export type Enum<T extends Record<string, any> = Record<string, any>> =
  BaseEnum<T[keyof T]> & {
    readonly [Name in keyof T]: T[Name];
  };

export function Enum<Values extends number, T extends Record<string, Values>>(
  definition: T & Record<Capitalize<keyof T & string>, unknown>
): Enum<T>;
export function Enum<Values extends string, T extends Record<string, Values>>(
  definition: T & Record<Capitalize<keyof T & string>, unknown>
): Enum<T>;
export function Enum(
  definition: Record<string, string | number>
): Enum<typeof definition> {
  class AnEnum extends BaseEnumType<any> {
    constructor() {
      super(definition);

      Object.entries(definition).forEach(([key, value]) => {
        (this as any)[key] = value;
      });
    }
  }

  return new AnEnum() as any;
}

export type EnumValue<T extends Enum> = NonNullable<ReturnType<T["cast"]>>;

type RepresentationType<T> = T extends string
  ? string
  : T extends number
  ? number
  : never;

interface BaseEnum<T> {
  cast(input: RepresentationType<T> | null | undefined): T | undefined;
  // @ts-ignore
  isValid(input: RepresentationType<T> | null | undefined): input is T;
  members(): Iterable<T>;
  getName(value: T): string;
}

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

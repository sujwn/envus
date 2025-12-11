import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/defineConfig";
import { schema } from "../src/schema/factory";
import { EnvValidationError } from "../src/errors";

describe("strict mode", () => {
  it("allows only env keys defined in schema", () => {
    expect(() =>
      defineConfig(
        { port: schema("PORT").number() },
        {
          strict: true,
          source: { PORT: "3000", EXTRA: "x" },
        }
      )
    ).toThrow(EnvValidationError);
  });

  it("passes when no extra env vars are present", () => {
    const config = defineConfig(
      { port: schema("PORT").number() },
      { strict: true, source: { PORT: "5000" } }
    );

    expect(config.port).toBe(5000);
  });
});

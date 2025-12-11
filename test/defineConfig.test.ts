import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/defineConfig";
import { schema } from "../src/schema/factory";
import { EnvValidationError } from "../src/errors";

describe("defineConfig()", () => {
  it("returns validated config object", () => {
    const config = defineConfig(
      {
        port: schema("PORT").number().default(3000),
        debug: schema("DEBUG").boolean().default(false),
      },
      { source: { PORT: "8080", DEBUG: "true" } }
    );

    expect(config).toEqual({ port: 8080, debug: true });
  });

  it("applies default values", () => {
    const config = defineConfig(
      { port: schema("PORT").number().default(3000) },
      { source: {} }
    );

    expect(config.port).toBe(3000);
  });

  it("throws on missing required field", () => {
    expect(() =>
      defineConfig({ url: schema("URL").string().required() }, { source: {} })
    ).toThrow(EnvValidationError);
  });

  it("supports nested structures", () => {
    const config = defineConfig(
      {
        app: {
          name: "MyApp",
          port: schema("PORT").number().default(3000),
        },
      },
      { source: { PORT: "9000" } }
    );

    expect(config.app.port).toBe(9000);
    expect(config.app.name).toBe("MyApp");
  });

  it("collects multiple errors", () => {
    try {
      defineConfig(
        {
          a: schema("A").number().required(),
          b: schema("B").boolean().required(),
        },
        { source: {} }
      );
    } catch (err) {
      const e = err as EnvValidationError;
      expect(e.issues.length).toBe(2);
    }
  });
});

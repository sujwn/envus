import { describe, it, expect, beforeEach } from "vitest";
import { loadEnv } from "../src/loadEnv";
import * as fs from "fs";

describe("loadEnv()", () => {
  beforeEach(() => {
    delete process.env.TEST_A;
    delete process.env.TEST_B;
    delete process.env.TEST_C;
  });

  it("loads simple KEY=value pairs", () => {
    fs.writeFileSync(".env.test", "TEST_A=hello");

    loadEnv({ path: ".env.test" });

    expect(process.env.TEST_A).toBe("hello");

    fs.unlinkSync(".env.test");
  });

  it("strips quotes", () => {
    fs.writeFileSync(".env.test", `TEST_A="quoted value"`);

    loadEnv({ path: ".env.test" });

    expect(process.env.TEST_A).toBe("quoted value");

    fs.unlinkSync(".env.test");
  });

  it("does not override existing variables by default", () => {
    process.env.TEST_B = "original";

    fs.writeFileSync(".env.test", "TEST_B=newvalue");

    loadEnv({ path: ".env.test" });

    expect(process.env.TEST_B).toBe("original");

    fs.unlinkSync(".env.test");
  });

  it("overrides variables if override: true", () => {
    process.env.TEST_C = "old";

    fs.writeFileSync(".env.test", "TEST_C=new");

    loadEnv({ path: ".env.test", override: true });

    expect(process.env.TEST_C).toBe("new");

    fs.unlinkSync(".env.test");
  });

  it("ignores missing file when ignoreMissing=true", () => {
    expect(() => loadEnv({ path: "nonexistent.env", ignoreMissing: true })).not.toThrow();
  });

  it("throws if file is missing and ignoreMissing=false", () => {
    expect(() => loadEnv({ path: "missing.env", ignoreMissing: false })).toThrow();
  });
});

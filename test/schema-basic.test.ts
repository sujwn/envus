import { describe, it, expect } from "vitest";
import { schema } from "../src/schema/factory";

describe("schema() basic behavior", () => {
  it("validates string", () => {
    const s = schema("TEST").string().minLength(3);

    const result = s.resolve({ TEST: "hello" });

    expect(result.value).toBe("hello");
  });

  it("fails on invalid string", () => {
    const s = schema("TEST").string().minLength(5);

    const res = s.resolve({ TEST: "hi" });

    expect(res.issue).toBeTruthy();
  });

  it("validates numbers", () => {
    const s = schema("NUM").number().min(10);

    const res = s.resolve({ NUM: "20" });
    expect(res.value).toBe(20);
  });

  it("validates booleans", () => {
    const s = schema("FLAG").boolean();

    expect(s.resolve({ FLAG: "true" }).value).toBe(true);
    expect(s.resolve({ FLAG: "no" }).value).toBe(false);
  });

  it("validates enums", () => {
    const s = schema("MODE").enum(["dev", "prod"]);

    expect(s.resolve({ MODE: "dev" }).value).toBe("dev");
    expect(s.resolve({ MODE: "bad" }).issue).toBeTruthy();
  });

  it("validates arrays", () => {
    const s = schema("LIST").array();

    expect(s.resolve({ LIST: "a,b,c" }).value).toEqual(["a", "b", "c"]);
  });

  it("validates JSON", () => {
    const s = schema("JSON").json();

    expect(s.resolve({ JSON: '{"a":1}' }).value).toEqual({ a: 1 });
  });
});

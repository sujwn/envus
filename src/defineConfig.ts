import { BaseSchema } from "./schema/BaseSchema";
import { EnvValidationError } from "./errors";
import { DefineConfigOptions, ValidationIssue } from "./types";

/**
 * Utility type guards
 */
function isSchema(v: any): v is BaseSchema<any> {
  return v instanceof BaseSchema;
}

function isPlainObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof BaseSchema);
}

/**
 * Recursively walk tree. For schema nodes, call resolve; for literals, copy;
 * for nested objects, recursively process.
 */
function buildConfigInternal(
  node: any,
  source: Record<string, string | undefined>,
  issues: ValidationIssue[],
): any {
  if (isSchema(node)) {
    const resolved = node.resolve(source);
    if (resolved.issue) issues.push(resolved.issue);
    return resolved.value;
  }

  if (Array.isArray(node)) {
    // arrays as literal config nodes: map children
    return node.map((item) => buildConfigInternal(item, source, issues));
  }

  if (isPlainObject(node)) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = buildConfigInternal(v, source, issues);
    }
    return out;
  }

  // literal value (string, number, boolean, null, undefined)
  return node;
}

/**
 * Flatten schema tree to find referenced env keys (for strict mode)
 */
function collectSchemaKeys(node: any, keys: Set<string>): void {
  if (!node) return;
  if (node instanceof BaseSchema) {
    keys.add(node.envKey);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectSchemaKeys(item, keys);
    return;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node)) collectSchemaKeys(v, keys);
  }
}

/**
 * defineConfig public API
 */
export function defineConfig<T extends Record<string, any>>(tree: T, options: DefineConfigOptions = {}): any {
  const source = options.source ?? process.env;
  const issues: ValidationIssue[] = [];

  const result = buildConfigInternal(tree, source, issues);

  if (issues.length > 0) {
    const err = options.formatError ? options.formatError(issues) : new EnvValidationError(issues);
    throw err;
  }

  if (options.strict) {
    const keys = new Set<string>();
    collectSchemaKeys(tree, keys);
    // check for keys in source that are not referenced
    for (const k of Object.keys(source)) {
      if (source[k] === undefined) continue;
      if (!keys.has(k)) {
        throw new EnvValidationError([{ key: k, message: "Unknown environment variable (not referenced in schema)" }]);
      }
    }
  }

  return result;
}

/**
 * Type-level helpers are exported from index.ts (InferConfig)
 */

export { loadEnv } from "./loadEnv";
export { defineConfig } from "./defineConfig";
export { schema } from "./schema/factory";
export { EnvValidationError } from "./errors";

// types
export type {
	LoadEnvOptions,
	DefineConfigOptions,
	ValidationIssue,
} from "./types";

/**
 * Simple InferConfig type inference:
 * - If node is BaseSchema -> resolved type is the inner type (best-effort)
 * - If node is object -> recursively infer
 *
 * Note: due to runtime polymorphism and complexity of mapping method-chains to
 * precise types, this InferConfig is a practical mapping: if you want full
 * compile-time precision, you can extend schema builder with generics.
 */

/* eslint-disable @typescript-eslint/ban-types */
import { BaseSchema } from "./schema/BaseSchema";

/**
 * Extract the TypeScript type from a schema instance at compile-time.
 * We can't derive the concrete T from runtime BaseSchema, so we rely on the
 * user to annotate or accept basic inference for literals and nested objects.
 *
 * The following is a pragmatic utility that maps:
 * - literals -> their types
 * - objects -> mapped types
 * - BaseSchema<any> -> any (user-friendly)
 */

type InferNode<N> =
	// If N is a BaseSchema instance, result any (runtime typed)
	N extends BaseSchema<infer U>
		? U
		: // If literal primitives
		N extends string
		? string
		: N extends number
		? number
		: N extends boolean
		? boolean
		: // If array literal
		N extends (infer I)[]
		? InferNode<I>[]
		: // If object -> recursively map
		N extends Record<string, any>
		? { [K in keyof N]: InferNode<N[K]> }
		: unknown;

export type InferConfig<T extends Record<string, any>> = {
	[K in keyof T]: InferNode<T[K]>;
};

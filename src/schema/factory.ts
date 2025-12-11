import { BaseSchema } from "./BaseSchema";
import { StringSchema } from "./StringSchema";
import { NumberSchema } from "./NumberSchema";
import { BooleanSchema } from "./BooleanSchema";
import { EnumSchema } from "./EnumSchema";
import { ArraySchema } from "./ArraySchema";
import { JsonSchema } from "./JsonSchema";
import { CustomSchema } from "./CustomSchema";

/**
 * Factory method: schema(envKey) returns an object exposing type builders.
 * This function is the public 'schema' export.
 */
export function schema(envKey: string) {
	return {
		string: () => new StringSchema(envKey),
		number: () => new NumberSchema(envKey),
		boolean: () => new BooleanSchema(envKey),
		enum: <T extends string>(values: T[]) => new EnumSchema<T>(envKey, values),
		array: (separator?: string) => new ArraySchema<any>(envKey, separator),
		json: () => new JsonSchema(envKey),
		custom: <T>(fn: (raw: string | undefined) => T | undefined) =>
			new CustomSchema<T>(envKey, fn),
	};
}

// also export concrete types for reuse if needed
export type SchemaFactory = ReturnType<typeof schema>;
export {
	BaseSchema,
	StringSchema,
	NumberSchema,
	BooleanSchema,
	EnumSchema,
	ArraySchema,
	JsonSchema,
	CustomSchema,
};

import { BaseSchema } from "./BaseSchema";
import { BaseSchema as AnyBase } from "./BaseSchema";

export class ArraySchema<T> extends BaseSchema<T[]> {
	private separator: string;
	private itemSchema?: BaseSchema<T>;

	constructor(envKey: string, separator = ",") {
		super(envKey);
		this.separator = separator;
	}

	public of(itemSchema: BaseSchema<T>): this {
		this.itemSchema = itemSchema;
		return this;
	}

	protected parseValue(raw: string | undefined): T[] | undefined {
		if (raw === undefined) return undefined;
		if (raw === "") return [];
		const parts = raw.split(this.separator).map((p) => p.trim());
		if (!this.itemSchema) {
			// default to string items
			return parts as unknown as T[];
		}
		// For each element, use the itemSchema.parseValue-like behavior.
		const result: T[] = [];
		for (const part of parts) {
			// we reuse resolve to allow validation; we craft a temporary source
			const tmpSource: Record<string, string | undefined> = { __TMP__: part };
			const resolved = (this.itemSchema as AnyBase<any>).resolve(tmpSource);
			if (resolved.issue) {
				throw new Error(`Array item parse error: ${resolved.issue.message}`);
			}
			// resolved.value may be undefined only if itemSchema allowed undefined -> treat as undefined element
			result.push(resolved.value as T);
		}
		return result;
	}
}

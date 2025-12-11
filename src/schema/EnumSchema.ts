import { BaseSchema } from "./BaseSchema";

export class EnumSchema<T extends string> extends BaseSchema<T> {
	private readonly values: T[];

	constructor(envKey: string, values: T[]) {
		super(envKey);
		this.values = values;
	}

	protected parseValue(raw: string | undefined): T | undefined {
		if (raw === undefined) return undefined;
		const found = this.values.find((v) => v === raw);
		if (!found) throw new Error(`Expected one of: ${this.values.join(", ")}`);
		return found;
	}
}

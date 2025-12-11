import { BaseSchema } from "./BaseSchema";

export class BooleanSchema extends BaseSchema<boolean> {
	protected parseValue(raw: string | undefined): boolean | undefined {
		if (raw === undefined) return undefined;
		const v = raw.trim().toLowerCase();
		if (["true", "1", "yes", "on"].includes(v)) return true;
		if (["false", "0", "no", "off"].includes(v)) return false;
		throw new Error("Expected boolean (true/false/1/0/yes/no/on)");
	}
}

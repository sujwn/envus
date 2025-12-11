import { BaseSchema } from "./BaseSchema";

export class JsonSchema extends BaseSchema<any> {
	protected parseValue(raw: string | undefined): any | undefined {
		if (raw === undefined) return undefined;
		try {
			return JSON.parse(raw);
		} catch (err) {
			throw new Error("Invalid JSON");
		}
	}
}

import { BaseSchema } from "./BaseSchema";

export class CustomSchema<T> extends BaseSchema<T> {
	private readonly parser: (raw: string | undefined) => T | undefined;

	constructor(
		envKey: string,
		parser: (raw: string | undefined) => T | undefined
	) {
		super(envKey);
		this.parser = parser;
	}

	protected parseValue(raw: string | undefined): T | undefined {
		return this.parser(raw);
	}
}

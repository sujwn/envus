import { ValidationIssue } from "../types";

/**
 * BaseSchema implements core behaviors and contract for schema types.
 * It's intentionally OOP so concrete schema classes implement parsing and validation.
 */
export abstract class BaseSchema<T> {
	public readonly envKey: string;
	protected isRequired = false;
	protected defaultValue?: T;
	protected descriptionText?: string;

	constructor(envKey: string) {
		this.envKey = envKey;
	}

	public required(): this {
		this.isRequired = true;
		return this;
	}

	public optional(): this {
		this.isRequired = false;
		return this;
	}

	public default(value: T): this {
		this.defaultValue = value;
		return this;
	}

	public description(text: string): this {
		this.descriptionText = text;
		return this;
	}

	/**
	 * Implemented by concrete schema: parse raw string -> typed value or throw.
	 */
	protected abstract parseValue(raw: string | undefined): T | undefined;

	/**
	 * Resolve returns parsed value or default/undefined, and collects issues.
	 */
	public resolve(source: Record<string, string | undefined>): {
		value?: T;
		issue?: ValidationIssue;
	} {
		const raw = source[this.envKey];
		try {
			const parsed = this.parseValue(raw);
			if (parsed === undefined) {
				if (this.defaultValue !== undefined) {
					return { value: this.defaultValue };
				}
				if (this.isRequired) {
					return {
						issue: {
							key: this.envKey,
							message: "Required but missing",
							description: this.descriptionText,
						},
					};
				}
				return { value: undefined };
			}
			return { value: parsed };
		} catch (err) {
			return {
				issue: {
					key: this.envKey,
					message: (err as Error).message,
					description: this.descriptionText,
					received: raw,
				},
			};
		}
	}
}

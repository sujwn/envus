import { BaseSchema } from "./BaseSchema";

export class StringSchema extends BaseSchema<string> {
	private minLen?: number;
	private maxLen?: number;
	private pat?: RegExp;
	private willTrim = false;

	public minLength(n: number): this {
		this.minLen = n;
		return this;
	}

	public maxLength(n: number): this {
		this.maxLen = n;
		return this;
	}

	public pattern(re: RegExp): this {
		this.pat = re;
		return this;
	}

	public trim(): this {
		this.willTrim = true;
		return this;
	}

	protected parseValue(raw: string | undefined): string | undefined {
		if (raw === undefined) return undefined;
		let v = raw;
		if (this.willTrim) v = v.trim();
		if (this.minLen !== undefined && v.length < this.minLen) {
			throw new Error(`String length must be >= ${this.minLen}`);
		}
		if (this.maxLen !== undefined && v.length > this.maxLen) {
			throw new Error(`String length must be <= ${this.maxLen}`);
		}
		if (this.pat && !this.pat.test(v)) {
			throw new Error(`String does not match pattern ${this.pat}`);
		}
		return v;
	}
}

import { BaseSchema } from "./BaseSchema";

export class NumberSchema extends BaseSchema<number> {
	private minVal?: number;
	private maxVal?: number;
	private mustBeInt = false;

	public min(n: number): this {
		this.minVal = n;
		return this;
	}

	public max(n: number): this {
		this.maxVal = n;
		return this;
	}

	public int(): this {
		this.mustBeInt = true;
		return this;
	}

	public positive(): this {
		this.minVal = Math.max(this.minVal ?? -Infinity, 0);
		return this;
	}

	public negative(): this {
		this.maxVal = Math.min(this.maxVal ?? Infinity, 0);
		return this;
	}

	protected parseValue(raw: string | undefined): number | undefined {
		if (raw === undefined) return undefined;
		const v = Number(raw);
		if (Number.isNaN(v)) throw new Error("Expected number");
		if (this.mustBeInt && !Number.isInteger(v))
			throw new Error("Expected integer");
		if (this.minVal !== undefined && v < this.minVal)
			throw new Error(`Number must be >= ${this.minVal}`);
		if (this.maxVal !== undefined && v > this.maxVal)
			throw new Error(`Number must be <= ${this.maxVal}`);
		return v;
	}
}

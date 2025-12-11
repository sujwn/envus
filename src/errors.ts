import { ValidationIssue } from "./types";

export class EnvValidationError extends Error {
	public issues: ValidationIssue[];

	constructor(issues: ValidationIssue[]) {
		super(EnvValidationError.buildMessage(issues));
		this.name = "EnvValidationError";
		this.issues = issues;
		// maintain proper prototype chain in ES5 transpiled code
		Object.setPrototypeOf(this, EnvValidationError.prototype);
	}

	private static buildMessage(issues: ValidationIssue[]): string {
		const header = "Environment validation failed:";
		const body = issues
			.map(
				(i) =>
					`- ${i.key}: ${i.message}${
						i.description ? ` (${i.description})` : ""
					}`
			)
			.join("\n");
		return [header, body].join("\n\n");
	}
}

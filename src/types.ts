export type Primitive = string | number | boolean | null | undefined;

export interface LoadEnvOptions {
	path?: string;
	override?: boolean;
	ignoreMissing?: boolean;
	forgiving?: boolean;
	encoding?: BufferEncoding;
	readFile?: (path: string, encoding: BufferEncoding) => string;
}

export interface DefineConfigOptions {
	strict?: boolean;
	source?: Record<string, string | undefined>;
	formatError?: (issues: ValidationIssue[]) => Error;
}

export interface ValidationIssue {
	key: string;
	message: string;
	description?: string;
	received?: any;
}

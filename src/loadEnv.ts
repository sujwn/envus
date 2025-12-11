import * as fs from "fs";
import { LoadEnvOptions } from "./types";

/**
 * Lightweight, zero-dependency .env loader.
 * Behavior intentionally minimal and predictable.
 */
export class EnvFileLoader {
	private readonly path: string;
	private readonly override: boolean;
	private readonly ignoreMissing: boolean;
	private readonly forgiving: boolean;
	private readonly encoding: BufferEncoding;
	private readonly readFile: (path: string, encoding: BufferEncoding) => string;

	constructor(options: LoadEnvOptions = {}) {
		this.path = options.path ?? ".env";
		this.override = options.override ?? false;
		this.ignoreMissing = options.ignoreMissing ?? true;
		this.forgiving = options.forgiving ?? true;
		this.encoding = options.encoding ?? "utf8";
		this.readFile =
			options.readFile ?? ((p, e) => fs.readFileSync(p, { encoding: e }));
	}

	public load(): void {
		let content: string;
		try {
			content = this.readFile(this.path, this.encoding);
		} catch (err) {
			if (this.ignoreMissing) return;
			throw new Error(
				`Failed to load .env file at ${this.path}: ${(err as Error).message}`
			);
		}

		const lines = content.split(/\r?\n/);

		for (const rawLine of lines) {
			const line = rawLine.trim();
			if (!line) continue;
			if (line.startsWith("#")) continue;

			const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
			if (!match) {
				if (this.forgiving) continue;
				throw new Error(`Invalid .env entry: "${rawLine}"`);
			}

			let [, key, value] = match;
			value = value.trim();

			// Strip surrounding quotes
			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			// Do not override unless allowed
			if (!this.override && process.env[key] !== undefined) continue;
			process.env[key] = value;
		}
	}
}

/**
 * Convenience function export matching API.
 */
export function loadEnv(options?: LoadEnvOptions): void {
	const loader = new EnvFileLoader(options);
	loader.load();
}

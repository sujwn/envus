import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/defineConfig";
import { schema } from "../src/schema/factory";

describe("Usage examples", () => {
	it("simple config", () => {
		const cfg = defineConfig(
			{
				port: schema("PORT").number().default(3000),
				env: schema("NODE_ENV").enum(["dev", "prod"]).default("dev"),
			},
			{ source: { PORT: "8080" } }
		);

		expect(cfg.port).toBe(8080);
		expect(cfg.env).toBe("dev");
	});

	it("real-world config tree", () => {
		const cfg = defineConfig(
			{
				app: {
					name: "Envus",
					port: schema("PORT").number().default(3333),
				},
				db: {
					url: schema("DB_URL").string().required(),
					pool: schema("DB_POOL").number().default(10),
				},
				auth: {
					jwt: {
						secret: schema("JWT_SECRET").string().required(),
						expires: schema("JWT_EXPIRES").number().default(3600),
					},
				},
			},
			{
				source: {
					DB_URL: "postgres://localhost/test",
					JWT_SECRET: "abc",
				},
			}
		);

		expect(cfg.app.name).toBe("Envus");
		expect(cfg.db.pool).toBe(10);
		expect(cfg.auth.jwt.secret).toBe("abc");
	});
});

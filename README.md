# envus

[![npm version](https://img.shields.io/npm/v/envus)](https://www.npmjs.com/package/envus)
![license](https://img.shields.io/npm/l/envus)

A zero-dependency environment configuration and validation library for Node.js. It provides a clear and explicit schema-based API for reading and validating environment variables, with support for nested config objects, default values, strict mode, and optional `.env` loading.

---

## Features

## API Reference

### **loadEnv(options?)**

Lightweight `.env` loader.

```ts
loadEnv({
  path?: string;        // default: '.env'
  override?: boolean;   // default: false
  ignoreMissing?: boolean; // default: true
  forgiving?: boolean;  // default: true
  encoding?: BufferEncoding;
});
```

---

### **defineConfig(tree, options?)**

Validates environment variables and returns a fully typed config object.

```ts
defineConfig(tree, {
  strict?: boolean;        // reject unknown env vars
  source?: Record<string, string | undefined>; // custom env source
  formatError?: (issues) => Error; // custom error formatter
});
```

---

### **schema(key)**

Creates a schema builder for the given environment variable.

```ts
schema("NAME").string();
schema("PORT").number();
schema("DEBUG").boolean();
schema("MODE").enum(["dev", "prod"]);
schema("LIST").array();
schema("JSON").json();
schema("CUSTOM").custom(fn);
```

### Common Modifiers

```ts
.required()
.optional()
.default(value)
.description(text)
```

---

### Type-Specific Modifiers

#### String

```ts
.minLength(n)
.maxLength(n)
.pattern(regex)
.trim()
```

#### Number

```ts
.min(n)
.max(n)
.int()
.positive()
.negative()
```

#### Array

```ts
.of(schema("X").number())
```

---

### Errors

`EnvValidationError` contains all collected validation errors.

```ts
try {
  defineConfig(...);
} catch (err) {
  console.error(err.issues);
}
```

---

* Zero runtime dependencies
* Explicit and type-friendly schema API
* Nested configuration trees
* Required, optional, defaulted, and constrained values
* Lightweight `.env` loader (optional)
* Works with both CommonJS and ESM
* Strict mode to block unknown env vars

---

## Installation

```bash
npm install envus
```

---

## Basic Usage

````ts
import { loadEnv, defineConfig, schema } from "envus";

loadEnv(); // optional

const config = defineConfig({
  app: {
    name: "MyService",
    port: schema("PORT").number().min(1000).max(9999).default(3000),
    debug: schema("DEBUG").boolean().default(false),
  },
  security: {
    apiKey: schema("API_KEY").string().minLength(10).required(),
  },
  cache: {
    ttl: schema("CACHE_TTL").number().positive().default(3600),
  },
  features: {
    admins: schema("ADMINS").array().default(["root"]),
  }
});
```ts
import { loadEnv, defineConfig, schema } from "envus";

// Optional: load .env file
loadEnv();

const config = defineConfig({
  app: {
    name: "MyService",
    port: schema("PORT").number().default(3000),
  },
  db: {
    url: schema("DB_URL").string().required(),
    pool: schema("DB_POOL").number().default(5),
  }
});

console.log(config.app.port);
````

---

## Schema Types

```ts
schema("KEY").string();
schema("KEY").number();
schema("KEY").boolean();
schema("KEY").enum(["dev", "prod"]);
schema("KEY").array();
schema("KEY").json();
schema("KEY").custom(raw => parseInt(raw || "0"));
```

### Constraints

```ts
.required()
.optional()
.default(value)
.description(text)
```

---

## Strict Mode

```ts
const config = defineConfig(schemaTree, {
  strict: true  // throws if extra env vars are present
});
```

---

## Loading .env Files

```ts
loadEnv({ path: ".env.local", override: false });
```

Works alongside external dotenv loaders:

```ts
import "dotenv/config";
```

---

## Error Handling

Errors are aggregated and thrown as `EnvValidationError`.

```ts
try {
  defineConfig({...});
} catch (err) {
  console.error(err);
}
```

---

## Migration from v1

**envus v2.0.0** is a complete rewrite of the library.
The old API:

* `validateEnv()`
* `resolveEnv()`

has been **removed**, as the new schema-based system provides a more robust and type-safe configuration workflow.

If you rely on the old behavior, you can install the legacy version:

```bash
npm install envus@1.0.0-a
```

### What's New in v2

* Explicit schema builder using `schema("KEY")`
* Rich chaining API for validation (min, max, patterns, positive, etc.)
* Nested config trees with `defineConfig()`
* Optional `.env` loader with `loadEnv()`
* Strong TypeScript inference
* Strict mode for detecting unknown environment values
* Zero runtime dependencies
* More predictable and extensible architecture

---

## License

[MIT](LICENSE)

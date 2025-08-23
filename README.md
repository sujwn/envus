# envus

A simple utility to **validate and resolve environment variables** with type safety and defaults.

## Installation
```bash
npm install envus
```

## Usage
```js
const { validateEnv, resolveEnv } = require('envus');

const config = {
  db: {
    host: { $env: 'DB_HOST', default: 'localhost', type: 'string' },
    port: { $env: 'DB_PORT', default: 5432, type: 'number' },
    ssl: { $env: 'DB_SSL', default: false, type: 'boolean' },
    options: { $env: 'DB_OPTIONS', type: 'json', default: {} },
  },
};

// Step 1: Validate environment variables
validateEnv(config);

// Step 2: Resolve config with values from process.env or defaults
const resolved = resolveEnv(config);

console.log(resolved);
/*
{
  db: {
    host: "localhost",
    port: 5432,
    ssl: false,
    options: {}
  }
}
*/
```
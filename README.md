# use-safe-params

A lightweight hook for **validating and typing route parameters** in **React Router 7**, using simple and predictable types: `int+`, `ulid`, `uuid`, `slug`.

Written in TypeScript, with zero dependencies.

---

## Installation

```
npm install use-safe-params

yarn add use-safe-params

pnpm add use-safe-params

bun add use-safe-params
```

## Test

```
npm run test

yarn run test

pnpm run test

bun run test
```

## Supported types

| Type   | Description                                 | Output type |
|--------|---------------------------------------------|-------------|
| `int+` | Positive integer only (`/^\d+$/`)            | `number`    |
| `ulid` | ULID format, Crockford base32 (26 chars)     | `string`    |
| `uuid` | UUID format (36 chars with hyphens)       | `string`    |
| `slug` | Lowercase letters, numbers, dashes, strict rules | `string` |

## Usage

Instead of doing this:

```
import { useParams } from "react-router"
...
const { userId, cartUuid } = useParams()
```

You can do this with this hook:

```
import { useSafeParams } from "use-safe-params"
...
const { userId, cartUuid } = useSafeParams({ userId: "int+", "orderUuid": "uuid" })
```

## Benefits: 
- 🚫 Throws a 404 response if a parameter does not match the expected format.
- 🔐 Ensures type safety and validation.
- 🔄 Automatically casts "int+" values to number.
- 🧼 Simplifies your components by eliminating manual checks.
- 🧪 Helps prevent bugs caused by malformed URLs or unsafe assumptions.

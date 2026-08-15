# Adapter and validation patterns

## Use one canonical parser

Centralize the ULID and prefix grammar. Reject lowercase values, wrong resource prefixes, extra separators, empty suffixes, and values with the correct prefix but an invalid ULID. Avoid permissive helpers such as `value.replace(/^.*?_/, '')`; they erase evidence of a wrong target.

Keep tagged and compatibility transformations explicit:

```ts
type Prefix = 'entity' | 'invoice';

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const parseBare = (value: string) => {
	if (!ULID_RE.test(value)) throw new Error('Invalid bare ULID');
	return value;
};

export const parseTagged = <P extends Prefix>(prefix: P, value: string) => {
	const marker = `${prefix}_`;
	if (!value.startsWith(marker)) throw new Error(`Expected ${prefix} ID`);
	parseBare(value.slice(marker.length));
	return value as `${P}_${string}`;
};

export const toStored = <P extends Prefix>(prefix: P, value: string) => {
	if (value.includes('_') && !value.startsWith(`${prefix}_`)) {
		throw new Error(`Expected bare or ${prefix} ID`);
	}
	const bare = value.startsWith(`${prefix}_`)
		? value.slice(prefix.length + 1)
		: value;
	parseBare(bare);
	return `${prefix}_${bare}` as `${P}_${string}`;
};
```

Use `parseTagged` for tagged application mode and a separate `fromStoredToBare` function for compatibility mode. Do not make an ORM adapter guess which representation the caller intended.

## Database checks

Use a check constraint for every root ID whose prefix is stable:

```sql
check (id ~ '^invoice_[0-9A-HJKMNP-TV-Z]{26}$')
```

Apply the same constraint to important prefixed foreign-key columns if raw SQL writers or multiple services can bypass the ORM. Pair the check with an actual FK; the check alone cannot prove target existence or tenant ownership.

## Test matrix

Cover at least:

| Input | Expected |
| --- | --- |
| generated `entity_` ID | accepted and round-trips |
| bare valid ULID in a storage adapter | prefixed exactly once |
| already-prefixed expected ID | unchanged |
| `workspace_` value passed to entity parser | rejected |
| lowercase or 25/27-character suffix | rejected |
| `entity_` with extra separator | rejected |
| missing parent or wrong tenant | FK rejection |
| raw SQL malformed value | database check rejection |

Test both application representation and raw stored representation. Include a migration fixture with representative old IDs, duplicate candidates, nulls, malformed values, children, JSON payloads, and external references.

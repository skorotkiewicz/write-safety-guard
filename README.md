# write-safety-guard

A pi extension: blocks the `write` tool when the target file already exists
and is not empty. New files and empty files write normally; `edit` is not
affected (it needs exact old text anyway).

## Why

The agent overwrote a hand-written file once too often. With this extension,
`write` can only create new files; changing existing ones requires `edit`
(surgical, reviewable) or an explicit delete-then-write.

## Install

Pick one:

```sh
# per-project / ad hoc:
pi --extension ./write-safety-guard.ts

# global, applies to every session:
mkdir -p ~/.pi/agent/extensions
cp write-safety-guard.ts ~/.pi/agent/extensions/
```

## How it works

Hooks the `tool_call` event, inspects `write` tool input, checks the target
file size, and returns `{ block: true, reason: ... }` for existing non-empty
files. The agent sees the reason and can adapt (use edit, or ask you first).

## Overriding when you really mean it

Delete the file first (`rm path`), then write. The guard only protects
existing non-empty files.

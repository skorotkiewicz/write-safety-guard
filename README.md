# write-safety-guard

A pi extension: when the agent wants to write over an existing non-empty file,
you get a confirmation dialog. New files and empty files write normally;
`edit` is not affected (it needs exact old text anyway).

## Why

The agent overwrote a hand-written file once too often. With this extension,
overwrites only happen after you allow them.

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

Hooks the `tool_call` event and inspects `write` tool input. If the target
file exists and is not empty, it calls `ctx.ui.confirm(...)` and asks you:
allow or block. Allowed, the write proceeds; blocked, the agent receives the
refusal and adapts (use edit, or ask you first).

## Behavior

If the agent wants to write on an existing non-empty file, it needs your
confirmation: a dialog asks allow or block. No confirmation is needed for new
or empty files, and `edit` is not affected.

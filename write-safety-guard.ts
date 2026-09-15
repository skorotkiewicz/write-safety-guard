// write-safety-guard: a pi extension that guards `write` on existing files.
// When the agent tries to write a file that already exists and is not empty,
// YOU get a confirmation dialog: allow the overwrite or block it.
//
// Install:
//   pi --extension ./write-safety-guard.ts
// or copy to your global extensions folder (~/.pi/agent/extensions/).
//
// edit is not affected: it requires exact old text, so it cannot silently
// clobber a file.
// Note: pi runs on Node.js, so this uses node:fs, not Bun APIs.
import { statSync } from "node:fs";

export default function writeSafetyGuard(pi) {
	pi.on("tool_call", async (event, ctx) => {
		if (event.toolName !== "write") return undefined;
		const path = event.input?.path;
		if (typeof path !== "string" || path.length === 0) return undefined;
		try {
			const size = statSync(path).size;
			if (size > 0) {
				const allow = await ctx.ui.confirm(
					"write-safety-guard",
					`"${path}" already exists (${size} bytes).\nAllow the agent to overwrite it?`,
				);
				if (!allow) {
					return {
						block: true,
						reason:
							`write-safety-guard: user declined overwriting "${path}". ` +
							"Use edit for targeted changes instead, or ask the user how to proceed.",
					};
				}
				// user allowed: fall through, write proceeds
			}
		} catch (err) {
			if (err?.code === "ENOENT") return undefined; // file doesn't exist: allow
			// other stat errors (permissions etc): don't block, let the tool handle it
		}
		return undefined;
	});
}

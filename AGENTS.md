<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.



# Design Patterns

1. Visual & Aesthetic Clichés ("AI Slop")

• Default LLM Styling: Overuse of signature purple-to-blue gradients, dark-mode glassmorphism, glowing borders, and generic "bento-box" grid layouts that make every app look like it was built by the same machine.
• Frankenstein Dashboards & Settings Pages: Piling dozens of random metrics, sparklines, and uncoordinated toggles onto a single screen ("Enable Feature 47") without a clear user goal.
• Visual Inconsistency: Mismatched icon libraries, conflicting CSS units, disjointed color palettes, and broken typography hierarchies across different routes.

2. Broken & Confusing UX Patterns

• Missing Core States: Completely forgetting to code or style empty states, loading skeletons, or error/fallback screens.
• Distracting Interaction Gimmicks: Unnecessary cursor-following lights, jittery auto-fade animations, or scroll-hijacking that fights natural browser behavior.
• Poor Information Hierarchy: Competing visual weights where secondary buttons scream louder than primary actions, and walls of generic placeholder text replace realistic content.

3. Performance & Technical Anti-Patterns

• React / State Chaos: Infinite loops caused by improper useEffect dependency arrays, un-debounced search inputs firing an API request on every single keystroke, and massive over-fetching of data.
• Heavy, Unoptimized Assets: Dropping uncompressed multi-megabyte images onto the page without lazy loading or table virtualization for large data grids.
• Bloated Codebase: Single frontend files ballooning past 2,000 lines of spaghetti code, duplicated utility functions, and mixed naming conventions.

4. Accessibility & Responsiveness Blind Spots

• Keyboard & Screen Reader Failure: Missing ARIA labels, non-functional click handlers on non-interactive elements, and broken focus states that make navigation impossible without a mouse.
• Desktop-Only Mindset: Interfaces that look fine on a 4K monitor but completely break, overflow, or clip on mobile viewports because responsive constraints weren't written into the prompt.


MAKE SURE TO AVOID ALL OF THE ABOVE

<!-- END:nextjs-agent-feedback -->

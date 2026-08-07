# Design page — test case catalog

Reference list of interaction scenarios for the Design page, kept alongside `DesignPage.ts` so
new e2e specs (or a reviewer checking coverage) can see what's expected without re-deriving it
from the implementation. "Unit" coverage refers to
`src/components/Design/Canvas/hooks/useSelectionTool/useSelectionTool.spec.tsx` (asserts
`store.getState()` directly, can express every branch precisely). "E2E" coverage can only assert
what's observable in the browser — DOM state (`aria-checked`) or canvas pixels (screenshot
diff/equality) — so it targets the highest-value real-integration paths, not every unit-level
branch.

## Frame drawing (Etap 3/4)

| #   | Scenario                                                                                | Unit |            E2E            |
| --- | --------------------------------------------------------------------------------------- | :--: | :-----------------------: |
| 1   | Drawing a frame with the Frame tool renders it and reverts the active tool to `default` |  —   | ✅ `create-frame.spec.ts` |

## Selection (Etap 5)

Setup shorthand: **A**, **B**, **C** are frames drawn left-to-right with a gap between each, all
with `parentId: null` (today, every frame shares the same parent — multi-selection is always a
"group selection", see [[x-draft roadmap Etap 5]]).

| #   | Scenario                                                                                                                                                                                                                                | Unit |          E2E           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: | :--------------------: |
| 1   | Plain click on an unselected node selects just that node                                                                                                                                                                                |  ✅  |           —            |
| 2   | Shift-click on an unselected node adds it to the selection                                                                                                                                                                              |  ✅  | ✅ `selection.spec.ts` |
| 3   | Shift-click on an already-selected node removes it                                                                                                                                                                                      |  ✅  |           —            |
| 4   | Plain click on a node that's part of an existing multi-selection, released **without moving**, collapses the selection to just that node                                                                                                |  ✅  |           —            |
| 5   | Plain click **+ drag** on a node that's part of an existing multi-selection moves the whole selection together; selection stays multi                                                                                                   |  ✅  |           —            |
| 6   | Plain click on a new, never-selected node while 2+ others are selected replaces the selection with just the new node                                                                                                                    |  ✅  |           —            |
| 7   | Plain click on empty canvas clears the selection                                                                                                                                                                                        |  ✅  |           —            |
| 8   | 2+ selected nodes sharing a parent render **one shared outline** spanning their combined bounds, not per-node outlines                                                                                                                  |  ✅  | ✅ `selection.spec.ts` |
| 9   | Click in the gap inside a shared multi-selection's bounds (no node there), released without moving, **deselects everything** — same as clicking empty canvas                                                                            |  ✅  |           —            |
| 10  | Click in the gap **+ drag** moves the whole multi-selection together (same as #5, entered via the gap instead of a node)                                                                                                                |  ✅  |           —            |
| 11  | Click on an **unselected node that happens to sit inside** a multi-selection's shared bounds does **not** replace the selection while the button is still held — the shared outline must stay visible for as long as the button is down |  ✅  | ✅ `selection.spec.ts` |
| 12  | Same as #11, released without moving: selection replaces to just that node (not deselected, unlike #9 — the difference is a real node was hit)                                                                                          |  ✅  | ✅ `selection.spec.ts` |
| 13  | Same setup as #11, but **dragged** instead of released in place: the original multi-selection (not the hit node) moves together, mirroring #10                                                                                          |  ✅  |           —            |

Scenarios 11–13 are today's fix — see `useSelectionTool/utils/handlePointerDown/armHitDrag.ts`.
The bug it corrected: the selection used to replace immediately on `pointerdown`, before the user
had released the button, which visibly flickered the outline away from the multi-selection the
instant the button went down on a node inside its bounds — even if the user only meant to drag the
whole group through the gap. `selection.spec.ts`'s coverage for #11/#12 asserts exactly this
timing: a screenshot taken while the button is still held must be pixel-identical to the
pre-press screenshot, and only the post-release screenshot may differ.

## Selection under a moved viewport (Etap 4 × Etap 5)

Hit-testing (`getNodeAtPoint`) runs on `screenToWorld(clickPoint, viewport)`, so a wrong or stale
`viewport` read is exactly the kind of bug the unit suite is weakest at catching:
`useSelectionTool.spec.tsx` never sets a non-default viewport, so every unit test for scenarios
1–13 above runs at the identity viewport (`{x: 0, y: 0, zoom: 1}`) and would still pass even if
selection silently ignored pan/zoom entirely. This is real browser + coordinate-math integration
territory, so it's e2e-only.

| #   | Scenario                                                                                                      | Unit |          E2E           |
| --- | ------------------------------------------------------------------------------------------------------------- | :--: | :--------------------: |
| 14  | After panning the canvas (middle-mouse drag), clicking a frame at its new on-screen position still selects it |  —   | ✅ `selection.spec.ts` |
| 15  | After zooming the canvas (Ctrl/Cmd + wheel), clicking a frame at its new on-screen position still selects it  |  —   | ✅ `selection.spec.ts` |

Both tests sidestep re-deriving the app's exact pan/zoom math inside the test: #14 pans by a known
screen-pixel delta and clicks at `originalPoint + delta` (panning is a pure offset, so this is
exact); #15 zooms with the anchor point set to the frame's own on-screen center — `applyZoom`
guarantees the anchor point maps to the same world point before and after, so clicking that exact
same screen coordinate again is guaranteed to still hit the frame regardless of the resulting zoom
factor, without the test needing to know `ZOOM_STEP_WHEEL`/`ZOOM_MIN`/`ZOOM_MAX` or do any
multiplication itself.

There is no "reset view" action anywhere in the app (checked: no keyboard shortcut, no toolbar
button — `useToolbarShortcuts.ts` only has tool-switching keys) — nothing exists yet to write a
test case for. If that's wanted, it's a product feature to build first, not a test gap.

## Why so few scenarios get e2e coverage

Most of the branches above are two-line Redux-state assertions in the unit suite — an e2e
equivalent would need a screenshot diff standing in for `expect(selectedIds).toEqual(...)`, which
is slower and less precise (a screenshot proves _something_ changed, not _what_). E2E here is
reserved for the paths where the interesting part is the real browser + canvas + timing
interaction itself (paint timing, `pointerdown`/`pointerup` ordering) rather than the selection
algorithm's branch logic, which the unit suite already pins down exhaustively.

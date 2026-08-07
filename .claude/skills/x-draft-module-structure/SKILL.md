---
name: x-draft-module-structure
description: Where a type, constant, or utility function belongs inside a feature folder in x-draft — types.ts vs constants.ts vs a utils/ folder, mirrored from x-design. Load before adding a new file to an existing feature folder (core/Routing, hooks/useX, translations, ...) or deciding where new code should live.
---

# x-draft Module Structure

Verified against x-design: 40/40 `types.ts` files contain zero `export const` (types/interfaces
only, no runtime code), and 0 `constants.ts` files export a `type`/`interface` — the two are never
mixed. 13+ folders (`core/ReduxHookForm`, `hooks/useTheme`, `store/pageBuilder`,
`shared/UI/Tooltip`, ...) keep a `types.ts` and a `utils/` folder side by side.

## Where things go, inside a feature folder

- **`types.ts`** — type/interface declarations only. No `export const`, no functions. May import
  from `./constants` (e.g. `type TLanguage = (typeof AVAILABLE_LANGUAGES)[number]`) — that
  direction is fine, just never the reverse (`constants.ts` must not import from `./types`).
- **`enums.ts`** — `enum` declarations, kept in their own file, separate from both `types.ts` and
  `constants.ts` (verified: `store/pageBuilder/`, `shared/UI/`, `types/` all keep `enums.ts`
  alongside a distinct `constants.ts`). **Both the member name and its string value are camelCase**,
  and the two match exactly — e.g. `northEast = 'northEast'` (`store/pageBuilder/enums.ts`'s
  `AnchorResize`/`AnchorRotate`), `comment = 'comment'` (x-draft's own `ToolName`). Never PascalCase,
  kebab-case, or snake_case on either side — this applies to every enum in the project, including
  ones that only ever have single-word members today (`ToolName`, `RouteName`): a later multi-word
  addition (e.g. `extraSmall = 'extraSmall'`) must stay camelCase on both sides too, not just the
  already-existing entries. `types.ts` and `constants.ts` may both import from `./enums`.
- **`constants.ts`** — runtime constant values (strings, numbers, maps) built from those enums, e.g.
  `DEFAULT_TOOL = ToolName.select`. No types/interfaces, no enum declarations themselves.
- **`utils/`** — one file per utility function, named after the function it exports
  (`utils/getRouteByName.ts` exports `getRouteByName`), not a single grab-bag `utils.ts`.
- **`hooks/`**, **`components/`** — same idea: subfolders once there's more than a trivial single
  item, each item in its own file/folder.

`types.ts` and `constants.ts` sit at the feature root; `utils/`, `hooks/`, `components/` are
subfolders.

## Example (`core/Routing/`)

```
core/Routing/
  types.ts               — TGuard, TAppRouteData, TComponent (types only)
  constants/
    routes.ts             — RouteName enum, ROUTES map (runtime values)
    appRoutesData.ts
  utils/
    getRouteByName.ts      — one function per file
    renderRoute.tsx
  components/
    ProtectedRoute/
    Title/
```

And `translations/`, same shape:

```
translations/
  types.ts                — TLanguage
  constants.ts             — AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY
  utils/
    getInitialLanguage.ts
  languages/
    en.json
    pl.json
```

## A hook with its own utils gets its own folder — utils never sit one level too high

`utils/` at a feature root (`Canvas/utils/`, `Routing/utils/`) is for helpers genuinely shared
across that feature's hooks/components. A helper used by exactly one hook does not belong there —
it belongs inside that hook's own folder, promoting the hook from a flat `hooks/useX.ts` file to
`hooks/useX/useX.ts` with a sibling `utils/`. Confirmed against x-design's
`hooks/useResizeHandler/` (`useResizeHandler.tsx` + `utils/handleMouseDown.ts`) and
`hooks/useKeyboardHandler/` (`useKeyboardHandler.tsx` + `types.ts` + `utils/handleLockBrowserEvents.ts`
+ `utils/triggerActions.ts`).

```
hooks/
  useCanvasRenderLoop/
    useCanvasRenderLoop.ts
    useCanvasRenderLoop.spec.tsx
    utils/
      drawFrame.ts
      startRenderLoop.ts
      createProgram.ts
      ...
      test/
        drawFrame.spec.ts
        startRenderLoop.spec.ts
        ...
  useCanvasResize/
    useCanvasResize.ts
    useCanvasResize.spec.tsx
    utils/
      resizeCanvas.ts
      test/resizeCanvas.spec.ts
```

Two things change once a hook gets this treatment:

- The hook's own spec **co-locates directly** beside it (`useX.spec.tsx`, no nested `test/`) — same
  as a component. The nested-`test/` rule from [[x-draft-test-conventions]] still applies, but only
  one level down, to the hook's own `utils/` (`utils/test/<functionName>.spec.ts`).
- If a util is only ever reached through another util in the same cluster (e.g. `createProgram` →
  `createShader`, `drawFrame` → `drawBackground`/`drawCornerHandles`/`drawRect`), that whole chain
  moves together — check actual usage (`grep -rl` for the export name) rather than assuming one
  util's flatness; a single hook can own a dozen `utils/` files if nothing outside that hook's tree
  imports them.

Before adding a new util under a shared feature-root `utils/`, check whether it's actually used from
more than one hook/component in that feature — if not, it belongs in the owning hook's own folder,
not the shared one.

## Related

[[x-draft-import-order]] — how imports from these files are grouped and ordered (`./types` **and**
`./enums` both get the `// types` header even via a relative path — confirmed in x-design's
`types/components/types.ts` importing `AlignmentHorizontal` from `./enums` under `// types`;
`./constants`/`./utils/*` fall under `// others` unless the alias is one of the recognized top-level
categories).
[[x-draft-test-conventions]] — how tests for these utils/hooks are structured.

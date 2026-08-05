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
  alongside a distinct `constants.ts`). Members are camelCase and match their string value exactly,
  e.g. `northEast = 'northEast'` (`store/pageBuilder/enums.ts`'s `AnchorResize`/`AnchorRotate`) —
  never PascalCase members. `types.ts` and `constants.ts` may both import from `./enums`.
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

## Related

[[x-draft-import-order]] — how imports from these files are grouped and ordered (`./types` **and**
`./enums` both get the `// types` header even via a relative path — confirmed in x-design's
`types/components/types.ts` importing `AlignmentHorizontal` from `./enums` under `// types`;
`./constants`/`./utils/*` fall under `// others` unless the alias is one of the recognized top-level
categories).
[[x-draft-test-conventions]] — how tests for these utils/hooks are structured.

---
name: x-draft-function-style
description: How functions and effects are shaped in x-draft — positive `if` guards instead of early-return negative guards, and named helper functions instead of inline closures inside useEffect/callbacks. Load before writing or reviewing a function with a null/undefined check, or a non-trivial useEffect/callback body.
---

# x-draft Function Style

## Positive guard over early-return

Prefer wrapping the dependent logic in a positive `if (x)` block instead of an early-return negative
guard (`if (!x) { return; }`) followed by unindented code below it.

Avoid:

```ts
if (!canvas) {
  return;
}

doSomething(canvas);
```

Prefer:

```ts
if (canvas) {
  doSomething(canvas);
}
```

This applies even though it costs an extra indentation level — "this block only runs when the value
is present" being visible at the `if` wins over saving an indent.

## Named functions instead of inline closures in effects/callbacks

Don't define non-trivial logic as an inline arrow function directly inside `useEffect` (or another
callback) that closes over effect-local variables. Extract it as a named function declared outside
the effect (module scope in the same file, or a dedicated file under `utils/` once it's reused),
taking the values it needs as explicit parameters instead of relying on the closure.

Avoid:

```ts
useEffect(() => {
  const canvas = canvasRef.current;

  if (canvas) {
    const resize = (): void => {
      // ...uses `canvas` via closure
    };

    resize();
  }
}, [canvasRef]);
```

Prefer:

```ts
const resizeCanvas = (canvas: HTMLCanvasElement): void => {
  // ...
};

export const useCanvasResize = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      resizeCanvas(canvas);
    }
  }, [canvasRef]);
};
```

Passing the value explicitly as a parameter (rather than reaching for it through the closure) keeps
the helper readable on its own and keeps the effect body itself short — the effect just wires
lifecycle (when to call it, when to observe/clean up), the named function holds the actual logic.

See `components/Design/Canvas/hooks/useCanvasResize.ts` for both rules applied together: the
positive `if (canvas)` guard, and `resizeCanvas` extracted to module scope above the hook.

## Related

[[x-draft-module-structure]] — once a helper like this is reused from more than one place, it moves
out of the hook's file into its own `utils/<functionName>.ts`.

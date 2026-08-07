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

### Recursive loops (`requestAnimationFrame`, `setInterval`, ...)

The same rule applies when the inline closure recurses on itself and closes over several
effect-local values (a GL context, a program, a buffer, ...), not just one. Splitting it into two
utils keeps each piece testable on its own:

- a pure "do one unit of work" function (e.g. `drawFrame(gl, program, buffer, canvas, ...)`) —
  no recursion, no scheduling, just draws/computes.
- a "run the loop" function (e.g. `startRenderLoop(gl, program, buffer, canvas, ...)`) that owns the
  `tick`/`requestAnimationFrame` recursion and returns a stop callback, mirroring the
  `resizeObserver.observe(...)` / `resizeObserver.disconnect()` shape from the resize example above.

Avoid:

```ts
useEffect(() => {
  if (canvas && gl && program && buffer) {
    let frameId: number;

    const tick = (): void => {
      // ...draws one frame using gl/program/buffer/canvas via closure
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return (): void => cancelAnimationFrame(frameId);
  }
}, [canvasRef]);
```

Prefer:

```ts
// utils/drawFrame.ts
export const drawFrame = (gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer, canvas: HTMLCanvasElement): void => {
  // ...draws one frame
};

// utils/startRenderLoop.ts
export const startRenderLoop = (gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer, canvas: HTMLCanvasElement): (() => void) => {
  let frameId: number;

  const tick = (): void => {
    drawFrame(gl, program, buffer, canvas);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  return (): void => cancelAnimationFrame(frameId);
};
```

```ts
useEffect(() => {
  if (canvas && gl && program && buffer) {
    const stopRenderLoop = startRenderLoop(gl, program, buffer, canvas);

    return (): void => stopRenderLoop();
  }
}, [canvasRef]);
```

See `components/Design/Canvas/utils/drawFrame.ts` and
`components/Design/Canvas/utils/startRenderLoop.ts`, used from
`components/Design/Canvas/hooks/useCanvasRenderLoop.ts` — the effect body no longer defines any
function itself.

The rule reapplies one level down: `startRenderLoop` itself must not nest `tick` in its own body
either — "don't keep a function inside a function" isn't just about `useEffect`, it's about any
function whose body defines another non-trivial named function. Hoist `tick` to module scope too.
Since `tick` recurses (`requestAnimationFrame` calls it again) and needs to update the current
frame id for `startRenderLoop`'s returned stop callback to cancel the right frame, pass a small
mutable ref object (`{ current: number }`) as an explicit parameter instead of closing over a `let`
declared in the outer function — the same "closure vs. explicit parameter" preference as above,
just applied to a value that changes over time instead of a static one:

```ts
type TFrameIdRef = { current: number };

const tick = (gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer, canvas: HTMLCanvasElement, frameIdRef: TFrameIdRef): void => {
  drawFrame(gl, program, buffer, canvas);
  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef));
};

export const startRenderLoop = (gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer, canvas: HTMLCanvasElement): (() => void) => {
  const frameIdRef: TFrameIdRef = { current: 0 };

  frameIdRef.current = requestAnimationFrame(() => tick(gl, program, buffer, canvas, frameIdRef));

  return (): void => cancelAnimationFrame(frameIdRef.current);
};
```

The `() => tick(...)` wrapper passed to `requestAnimationFrame` is fine to stay inline — it's pure
forwarding with no logic of its own (same as `debounce(() => resizeCanvas(canvas), ...)` in the
resize example), unlike a `tick` body that both draws and reschedules, which is exactly what must
not be nested.

## Related

[[x-draft-module-structure]] — once a helper like this is reused from more than one place, it moves
out of the hook's file into its own `utils/<functionName>.ts`.

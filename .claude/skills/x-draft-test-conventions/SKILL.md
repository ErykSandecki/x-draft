---
name: x-draft-test-conventions
description: Unit test structure and step-comment convention for x-draft, mirrored from x-design. Load before writing or reviewing any .spec.ts(x) file — covers describe/it naming and the // mock / // before / // find / // action / // wait / // result step comments.
---

# x-draft Test Conventions

Mirrors x-design, verified by grepping its spec files (~1400 `// result`, ~1400 `// before`, ~640
`// mock`, ~460 `// action`, ~85 `// find`, ~20 `// wait` occurrences), e.g.
`src/shared/UI/Button/Button.spec.tsx`, `src/shared/UI/Tooltip/Tooltip.spec.tsx`.

## `describe` / `it` naming

- `describe('<Name> snapshots', ...)` — render + `toMatchSnapshot()` tests.
- `describe('<Name> behaviors', ...)` — interaction tests (click, keyboard, hover, etc.).
- `describe('<Name> props', ...)` — occasional third bucket for components with many prop-driven
  variants (one `it` per prop).
- Every `it(...)` title starts with `'should ...'`.

## Step comments inside `it`

Each meaningful block of a test body gets a single lowercase `//` comment naming the step, with a
blank line between steps. In order — all optional except `before` and `result`, which appear in
nearly every test:

1. `// mock` — test-specific fixtures, spies, or data (skip if nothing beyond module-level consts
   is needed).
2. `// before` — arrange: render the component / `renderHook` the hook / set initial state.
3. `// find` — query the DOM for the element under test, when it isn't already returned directly
   by `before` (e.g. `container.querySelector(...)`, `getByE2EAttribute(...)`, `screen.getByRole(...)`).
4. `// action` — the interaction under test (`fireEvent.click(...)`, `user.click(...)`, dispatch).
5. `// wait` — an explicit async settle (`await sleep(100)`), only when waiting is its own step,
   separate from the action and from the assertion. Contrast with `await waitFor(() => expect(...))`
   — that stays under `// result`, since the wait and the assertion happen in the same call.
6. `// result` — the assertion(s). Always last.

## Worked example

From `Button.spec.tsx` — full chain:

```tsx
describe('Button behaviors', () => {
  it('should render rippleEffect after click', async () => {
    // before
    const { container } = customRender(<Button>{content}</Button>);

    // find
    const button = getByE2EAttribute(container, E2EAttribute.button);

    // action
    fireEvent.click(button);

    // result
    await waitFor(() => {
      expect(button.lastChild).toHaveClass(`${classNames[classNameButton].name}--${RIPPLE_EFFECT_MODIFICATOR}`);
    });
  });
});
```

No interaction, so no `find`/`action`:

```tsx
describe('Button snapshots', () => {
  it('should render Button', () => {
    // before
    const { asFragment } = customRender(<Button>{content}</Button>);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});
```

`// mock` for test-specific data, `// wait` as its own settle step (from `Tooltip.spec.tsx`):

```tsx
it('should show tooltip on hover', async () => {
  // action
  fireEvent.mouseEnter(document.getElementById('test'));

  // wait
  await sleep(100);

  // result
  expect(...).toBe(...);
});
```

## x-draft specifics

We use Vitest, not Jest — `describe`/`it`/`expect` are API-compatible, no translation needed.
Snapshots resolve to a sibling `snapshots/` folder (`vite.config.ts`'s `resolveSnapshotPath`).
See [[x-draft-import-order]] for how the imports above these tests are ordered.

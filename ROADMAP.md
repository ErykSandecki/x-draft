# x-draft — Roadmap

Cel: odtworzyć aplikację Figma 1:1, krok po kroku. Silnik rysowania: **Canvas**
(nie DOM/SVG). Wyjątek: pod czas edycji tekstu montowany jest mały DOM overlay
(`TextEditOverlay`) — cała reszta (kształty, selekcja, handle'y, guide'y)
rysowana jest na canvasie, tak jak w oryginale.

**Rendering: WebGL od samego fundamentu**, nie Canvas 2D — zdecydowane świadomie
wcześnie, bo docelowo będzie dużo obiektów na scenie i lepiej nie migrować
później. C++/WASM (tak jak w prawdziwej Figmie) to osobny, odległy temat — nie
robimy go teraz, dopiero jeśli kiedyś faktycznie będzie potrzebny (patrz sekcja
„Rendering" niżej po co WebGL i dlaczego nie WASM na starcie).

Zaznaczamy checkboxy w miarę postępu. Każdy etap = osobna, malutka porcja pracy.

## Rendering: WebGL, nie Canvas 2D

- Canvas 2D był tylko punktem startowym (Etap 0) — świadomie przeszliśmy na
  WebGL zanim zaczęliśmy rysować realne obiekty, żeby uniknąć drugiej migracji
  renderera później, gdy scena urośnie
- WASM zostaje **poza scope na razie** — dopiero jeśli/gdy realny profiling
  pokaże, że wąskim gardłem jest matematyka po stronie JS (hit-testing,
  tesselacja), a nie samo rysowanie na GPU. WebGL sam w sobie ułatwia tę
  ewentualną migrację później (te same wywołania GL da się wołać z C++ przez
  Emscripten), ale to nie jest cel na dziś

## Etap 0 — Fundament projektu

- [x] `components/Design/Canvas` — komponent React montujący jeden `<canvas>` na
      cały viewport (docelowo miało być `core/Canvas`, ale zgodnie z ustaleniami
      wszystkie komponenty widoku trzymamy w `components/Design/...`)
- [x] resize handling (dopasowanie canvasu do okna + `devicePixelRatio`) —
      `Canvas/hooks/useCanvasResize.ts`: `ResizeObserver` na elemencie canvasu +
      `canvas.width/height` liczone z `devicePixelRatio`, `gl.viewport(...)` po
      każdym resize żeby framebuffer WebGL nadążał za nowym rozmiarem
- [x] render loop (`requestAnimationFrame`) rysujący na razie puste tło —
      `Canvas/hooks/useCanvasRenderLoop.ts`: kontekst `webgl2`
      (`WEBGL_CONTEXT_ID`/`WEBGL_CONTEXT_ATTRIBUTES` z `Canvas/constants.ts`,
      `premultipliedAlpha: false` żeby alpha liczyła się w sposób intuicyjny),
      co klatkę `gl.clearColor` + `gl.clear` (`BACKGROUND_COLOR` konwertowany
      przez `Canvas/utils/hexToRgbFloat.ts`, `BACKGROUND_ALPHA`). Pod canvasem
      (przezroczyste tło) leży osobny `div.texture` z teksturką z x-design
      (`texture--dark.svg`/`texture--light.svg`, dobierana wg motywu) — dzięki
      temu jak `BACKGROUND_ALPHA` spadnie poniżej 1, teksturka będzie
      prześwitywać spod wypełnienia, tak jak w oryginale

## Etap 1 — Dolny toolbar (bieżący krok)

Referencja: zrzut z toolbarem Figmy (select / frame / rectangle / pen / text /
comment / shapes, potem osobno: draw / scale / actions / dev mode).

- [ ] `shared/UI/Toolbar` (albo `components/Toolbar`) — statyczny layout wg
      zrzutu: grupa lewa (select, frame, rectangle+dropdown, pen+dropdown,
      text+dropdown, comment, shapes) + separator + grupa prawa (draw, scale,
      actions, code/dev mode)
- [ ] stan aktywnego narzędzia (`activeTool`) — jeden wybrany na raz, podświetlenie
      jak na zrzucie (niebieskie tło aktywnej ikony)
- [ ] ikony wg konwencji projektu ([[x-draft-icons]] — SVG przez
      `vite-plugin-svgr`)
- [ ] na razie tylko UI, bez realnej logiki narzędzi poza zaznaczeniem stanu

## Etap 2 — Model danych sceny

- [ ] `SceneNode` jako discriminated union (`type: 'frame' | 'rectangle' | ...`)
      zamiast hierarchii klas czy komponentów React
- [ ] store sceny (lista/drzewo node'ów + relacje parent/children po `id`)
- [ ] viewport state: pan (x, y) + zoom (scale) jako jedno źródło prawdy dla
      transformacji world → screen

## Etap 3 — Narzędzie Frame

- [ ] aktywacja narzędzia „Frame" z toolbaru
- [ ] interakcja: click-drag na canvasie tworzy `FrameNode` (rysowanie
      prostokąta w trakcie przeciągania)
- [ ] po puszczeniu przycisku myszy: frame trafia do store'u, narzędzie wraca
      do „Select"
- [ ] renderowanie frame'a na canvasie (obrys + nazwa nad frame'em, jak w Figmie)

## Etap 4 — Pan & zoom

- [ ] scroll = pan, ctrl/cmd+scroll (lub pinch) = zoom wokół kursora
- [ ] wszystkie rysowane node'y respektują transformację viewportu

## Etap 5 — Selekcja

- [ ] hit-testing (klik w canvas → który node trafiony, z uwzględnieniem
      zagnieżdżenia we frame'ach)
- [ ] rysowanie selection outline + resize handles na canvasie
- [ ] przeciąganie (move) i skalowanie (resize) zaznaczonego node'a

## Etap 6 — Kolejne narzędzia rysujące

- [ ] Rectangle
- [ ] Ellipse
- [ ] Text (tworzenie node'a — sama edycja treści to Etap 7)
- [ ] Pen / vector (najbardziej złożony, na później)

## Etap 7 — Edycja tekstu (DOM overlay)

- [ ] `TextEditOverlay` — montowany warunkowo tylko dla aktualnie edytowanego
      node'a, pozycjonowany na podstawie world → screen transform
- [ ] synchronizacja treści z powrotem do `SceneNode` po zakończeniu edycji

## Etap 8 — Panele boczne

- [ ] panel warstw (drzewo node'ów, zawsze zwykły DOM/React)
- [ ] panel właściwości zaznaczonego node'a (x/y/w/h, fill, itd.)

---

Etapy dalej w przyszłości (grupy, komponenty/instancje, auto-layout, itd.) —
dopiszemy jak dojdziemy do tego miejsca, żeby nie planować na zapas.

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
      każdym resize żeby framebuffer WebGL nadążał za nowym rozmiarem.
      Przeliczanie jest debounce'owane (`lodash/debounce`, `RESIZE_DEBOUNCE_MS`
      z `Canvas/constants.ts`) — bez tego `canvas.width/height` resetowało cały
      bitmap/kontekst WebGL na każdy pojedynczy event z `ResizeObserver`
      (a tych lecą dziesiątki podczas przeciągania okna), stąd migotanie
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

- [x] `components/Design/Toolbar` — statyczny layout, floating na dole canvasu
      (nie `shared/UI/Toolbar` — trzymamy wszystkie komponenty widoku pod
      `components/Design/...`)
- [x] stan aktywnego narzędzia (`activeTool`) — Redux (`store/design`), nie
      lokalny stan; podświetlenie aktywnej ikony przez Radix `ToggleGroup`
      (`data-state="on"` → `background-color: var(--color-blue-1)`)
- [x] ikony wg konwencji projektu ([[x-draft-icons]])
- [x] pierwsze 3 przyciski od lewej: Select/Move (`default`), Frame, Comment —
      realna logika (dispatch `setActiveTool`), nie tylko UI
- [x] dropdown-chevron (16×32, hover taki sam jak reszta przycisków) przy
      Select i Frame — `MouseModes/ToolDropdown` (Radix `DropdownMenu`), na
      razie pokazuje jedną, aktualnie aktywną opcję (checkmark + ikona + label + skrót klawiszowy); realne warianty (Hand tool, Scale, Slice...) dojdą
      later jako osobny krok
- [ ] rectangle / pen / text (z dropdownami wariantów) — kolejny krok
- [ ] shapes (assets), prawa grupa (draw / scale / actions / dev mode)

## Etap 2 — Model danych sceny

- [x] `TSceneNode` jako discriminated union (`types/design/types.ts`) —
      `TBaseNode` (id/name/x/y/width/height/rotation/parentId) + `TFrameNode`
      (`type: NodeType.frame`) jako jedyny na razie wariant; `TSceneNode = TFrameNode`
      — reszta (rectangle/ellipse/text/vector) dojdzie w Etapie 6, kiedy realnie
      powstaną te narzędzia, nie wcześniej
- [x] store sceny — `store/design`: `nodes: Record<string, TSceneNode>` +
      `rootOrder: string[]` (kolejność/z-index, nie polegamy na kolejności
      kluczy obiektu). Reducery: `addNode` (id generowany przez `nanoid()` z
      `@reduxjs/toolkit` w `prepare`, nie w reducerze — reducer zostaje czystą
      funkcją), `updateNode` (częściowy patch po id, no-op na nieznane id)
- [x] viewport state: `TViewport { x, y, zoom }` w `store/design`, reducer
      `setViewport` — jedno źródło prawdy pod transformację world → screen,
      realne sterowanie pan/zoom (scroll/pinch) to Etap 4

## Etap 3 — Narzędzie Frame

- [x] aktywacja narzędzia „Frame" z toolbaru — już działało od Etapu 1
      (`activeTool` w Redux), `useFrameTool` po prostu nasłuchuje na nie
- [x] interakcja: click-drag na canvasie tworzy frame — `Canvas/hooks/useFrameTool.ts`,
      natywne listenery `pointerdown/move/up` na elemencie canvasu (nie JSX
      props, spójnie z resztą hooków canvasu), `setPointerCapture` żeby drag
      działał nawet gdy kursor wyjdzie poza canvas. Draft (w trakcie
      przeciągania) trzymany w `useRef` w `Canvas.tsx`, **nie** w Reduxie —
      render loop czyta go bezpośrednio co klatkę, żeby przeciąganie nie
      dispatchowało do store'u przy każdym pixelu
- [x] po puszczeniu przycisku myszy: `addNode` (tylko jeśli przeciągnięty
      obszar ≥ `MIN_FRAME_SIZE`, żeby zwykły klik nie tworzył 0×0 frame'a) +
      `setActiveTool(default)` — narzędzie zawsze wraca do Select po puszczeniu,
      niezależnie czy coś powstało
- [x] renderowanie frame'a na canvasie — `Canvas/utils/{createShader,createProgram,drawRect}.ts`:
      pierwszy realny WebGL rendering (dotąd był tylko `gl.clear`), prosty
      shader (`VERTEX_SHADER_SOURCE`/`FRAGMENT_SHADER_SOURCE` w `constants.ts`)
      rysujący wypełnienie (2 trójkąty) + obrys (`LINE_LOOP`). Każdy nowy frame
      dostaje losowy kolor wypełnienia (`getRandomColor.ts`) — na razie zamiast
      realnego systemu fill/stylingu. **Nazwa nad frame'em pominięta na razie**
      — tekst w WebGL to osobny, spory temat (atlas glifów/SDF), wraca jako
      osobny krok przy Etapie 6/7, kiedy i tak trzeba będzie rozwiązać
      renderowanie tekstu (Text tool + edycja)

## Etap 4 — Pan & zoom

- [x] scroll = pan, ctrl/cmd+scroll (lub pinch) = zoom wokół kursora —
      `Canvas/hooks/useCanvasPanZoom/useCanvasPanZoom.ts`: natywny listener `wheel` (bez gate'a na
      `activeTool` — działa niezależnie od aktywnego narzędzia), `{ passive: false }` +
      `preventDefault()` żeby nie walczyć z natywnym scrollem/pinch-zoomem strony.
      `event.ctrlKey` rozróżnia zoom (Ctrl/Cmd+scroll **i** pinch trackpada — przeglądarki
      raportują pinch jako `wheel` z `ctrlKey: true`) od zwykłego pan. Czysta matematyka w
      `utils/applyPan.ts`/`utils/applyZoom.ts` — zoom dociskany do `[ZOOM_MIN, ZOOM_MAX]`
      (`lodash/clamp`) i przeliczany tak, żeby punkt świata pod kursorem został w tym samym
      miejscu na ekranie po zmianie zoomu
- [x] wszystkie rysowane node'y respektują transformację viewportu — transformacja liczona
      **na GPU**, nie w JS: `VERTEX_SHADER_SOURCE` dostał `u_viewportOffset`/`u_zoom`/`u_resolution`
      i sam liczy clip-space; `drawRect.ts` przestał robić to po stronie CPU (`toClipSpace`
      usunięte), wysyła surowe współrzędne świata i nowe uniformy. Świadomy wybór GPU zamiast JS —
      to dokładnie ten sam typ decyzji co wybór WebGL zamiast Canvas 2D w Etapie 0 (per-vertex
      transform przechodzi przez każdy draw call, więc lepiej raz zrobić to dobrze niż migrować
      później przy większej scenie). Przy okazji naprawiony `useFrameTool.ts` — pozycja kursora
      konwertowana przez nowy `Canvas/utils/screenToWorld.ts` zanim trafi do `addNode`, inaczej
      nowe frame'y powstawałyby w złym miejscu przy niezerowym pan/zoom.
      **Znany, świadomy kompromis**: uchwyty narożne (`CORNER_HANDLE_SIZE`) skalują się teraz razem
      z zoomem, bo idą przez tę samą transformację co realne node'y — stały rozmiar na ekranie
      wymagałby osobnej warstwy screen-space UI, zostawione na później, nie blokuje żadnego z
      dwóch punktów tego etapu

## Etap 5 — Selekcja

- [x] hit-testing (klik w canvas → który node trafiony, z uwzględnieniem
      zagnieżdżenia we frame'ach) — `useSelectionTool/utils/getNodeAtPoint.ts`, AABB w world
      space (po `screenToWorld`), topmost wygrywa (ostatni w `rootOrder` = ostatnio narysowany).
      Zagnieżdżenie we frame'ach nieaktualne na razie — jest tylko jeden typ node'a (frame),
      `parentId` zawsze `null`, więc hit-test operuje na płaskiej liście; wraca jako temat przy
      grupach/nested frames
- [x] rysowanie selection outline + resize handles na canvasie — `drawFrame/drawSelectionOutline.ts`
      (wywoływane z `drawFrame.ts` po narysowaniu node'ów) rysuje outline po `selectSelectedNodes`,
      reużywając bez zmian `drawRect`/`drawCornerHandles` z Etapu 3/4 (już przyjmowały `viewport`,
      więc zadziałały na dowolnym node'ie, nie tylko na draft-rekcie draw-in-progress)
- [x] przeciąganie (move) zaznaczonego node'a (lub kilku naraz) — `useSelectionTool.ts`.
      **Skalowanie (resize) uchwytami świadomie odłożone** — to osobny kawałek roboty
      (hit-testing per-uchwyt, matematyka resize w 8 kierunkach, zmiana kursora), nie było
      częścią tego, co zostało opisane do zrobienia teraz; uchwyty są już rysowane (patrz wyżej),
      samo przeciąganie ich do zmiany rozmiaru to naturalny następny mikro-krok
- [x] **wspólny outline dla zaznaczenia 2+** — gdy zaznaczone są 2+ node'y **i mają ten sam
      `parentId`** (`Canvas/utils/haveSameParent.ts` + `isGroupSelection.ts` — dziś zawsze `true`,
      bo `parentId` jest zawsze `null`, wraca do gry przy grupach/nested frames),
      `drawFrame/drawGroupSelectionOutline.ts` rysuje **jeden wspólny outline**
      (`Canvas/utils/getSelectionBounds.ts` — combined AABB) + 4 uchwyty zamiast osobnych per node
      (`drawFrame/drawPerNodeSelectionOutlines.ts`), wybierane przez `drawSelectionOutline.ts` na
      podstawie `isGroupSelection`.
      Hit-test w `useSelectionTool.ts` rozszerzony o `utils/isPointInGroupBounds.ts`: kliknięcie
      **gdziekolwiek w polu wspólnego bboxa** — nawet w pustym miejscu między zaznaczonymi
      node'ami, gdzie `getNodeAtPoint` nic nie trafia — łapie i przeciąga całą grupę naraz.
      Puszczenie bez ruchu w tej luce **czyści całe zaznaczenie** — nie trafiono w żaden
      konkretny node, więc traktowane jak klik na pusty canvas, inaczej niż klik na konkretny,
      zaznaczony node z Etapu 5 wyżej (ten zwija do jednego node'a)

  Pełna semantyka zaznaczania 1:1 z Figmy/x-design (`Element/utils/handleSelectElement.ts` +
  `MultipleElementsArea/ClickableArea/*`), ale spleciona w **jeden** hit-test-driven handler
  zamiast dwuwarstwowego systemu DOM-owego z x-design (`Element`-level handler +
  `ClickableArea` overlay z `stopPropagation`) — x-draft nie ma DOM-u per node (jeden canvas,
  ręczny hit-test), więc dwuwarstwowość x-design nie miała się w co przełożyć 1:1; ten sam efekt
  wychodzi z jednej funkcji z `dragStateRef` (`pendingClickAction` — `{ kind: 'collapse', id }` /
  `{ kind: 'deselect' }` / `null` — + `hasMoved`, ustalane na pointerdown, rozstrzygane na
  pointerup):
  - klik (bez shift) na niezaznaczony node → zaznacza tylko jego
  - shift+klik na niezaznaczony → dokłada do zaznaczenia; shift+klik na zaznaczony → zdejmuje
  - klik (bez shift) na node będący częścią zaznaczenia 2+, puszczony **bez ruchu** → zwija
    zaznaczenie do tego jednego node'a (`pendingClickAction.kind === 'collapse'`)
  - klik+**przeciągnięcie** (bez shift) node'a z zaznaczenia 2+ → cała grupa przesuwa się
    razem, zaznaczenie **zostaje** nietknięte (nie zwija się do jednego)
  - klik na nowy, nigdy niezaznaczony node przy istniejącym zaznaczeniu 2+ → zastępuje całe
    zaznaczenie tym jednym (ta sama ścieżka co zwykły klik)
  - klik na pusty obszar canvasu → czyści całe zaznaczenie (shift+klik na pustym → no-op)
  - klik (bez shift) w lukę wewnątrz wspólnego bboxa zaznaczenia 2+ (nie trafiając w żaden
    node), puszczony **bez ruchu** → czyści całe zaznaczenie
    (`pendingClickAction.kind === 'deselect'`); z ruchem → przeciąga całą grupę, zaznaczenie
    nietknięte

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

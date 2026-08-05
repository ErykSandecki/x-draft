# x-draft — Roadmap

Cel: odtworzyć aplikację Figma 1:1, krok po kroku. Silnik rysowania: **Canvas**
(nie DOM/SVG). Wyjątek: pod czas edycji tekstu montowany jest mały DOM overlay
(`TextEditOverlay`) — cała reszta (kształty, selekcja, handle'y, guide'y)
rysowana jest na canvasie, tak jak w oryginale.

Zaznaczamy checkboxy w miarę postępu. Każdy etap = osobna, malutka porcja pracy.

## Etap 0 — Fundament projektu

- [ ] `core/Canvas` — komponent React montujący jeden `<canvas>` na cały viewport
- [ ] resize handling (dopasowanie canvasu do okna + `devicePixelRatio`)
- [ ] render loop (`requestAnimationFrame`) rysujący na razie puste tło

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

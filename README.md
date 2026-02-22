# MoodLens

MoodLens es una aplicación web construida con **SvelteKit + Tailwind CSS** que detecta emociones faciales en tiempo real usando la cámara. La arquitectura usa una **Máquina de Estados Finita (FSM)** como núcleo de control, desacoplada del framework.

---

## Stack

| Capa          | Tecnología                         |
| ------------- | ----------------------------------- |
| Framework     | SvelteKit                           |
| Estilos       | Tailwind CSS                        |
| Estado        | FSM pura (clase JS) + Svelte stores |
| (Próximo) IA | face-api.js / TensorFlow.js         |

---

## Flujo de la aplicación

```plaintext
┌─────────────────────────────────────────────────────────┐
│                     +page.svelte                        │
│  (orquesta layout, importa stores, pasa props)          │
└────────────────────┬────────────────────────────────────┘
                     │ importa y suscribe
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  moodLens.js  (store)                   │
│                                                         │
│  fsmState ──► isIdle / isScanning (derived)             │
│  emotion  ──► datos de emoción actual                   │
│  history  ──► array de emociones pasadas                │
│                                                         │
│  actions.start() ──► machine.send('START')              │
│  actions.stop()  ──► machine.send('STOP')               │
└────────────────────┬────────────────────────────────────┘
                     │ wrappea y escucha
                     ▼
┌─────────────────────────────────────────────────────────┐
│              moodLensMachine.js  (FSM pura)             │
│                                                         │
│   STATES        EVENTS        TRANSITIONS               │
│   ───────       ──────        ─────────────────────     │
│   idle    ◄──── STOP ──────── scanning                  │
│   idle    ──── START ───────► scanning                  │
│                                                         │
│   _onEnter(state)  ← hook de entrada por estado         │
│   _onExit(state)   ← hook de salida por estado          │
│   validEvents()    ← eventos válidos desde estado actual│
└─────────────────────────────────────────────────────────┘
                     │ appState / emotion / history (props)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Componentes UI                        │
│                                                         │
│  CameraFeed.svelte     ← video + scan overlay           │
│  EmotionPanel.svelte   ← emoción + ConfidenceBar        │
│  EmotionOrb.svelte     ← esfera animada por emoción     │
│  EmotionHistory.svelte ← chips scrolleables             │
└─────────────────────────────────────────────────────────┘
```

## Estados actuales de la FSM

```plaintext
         START
  ┌──── ────────► ─────────┐
  │                        │
[idle]                 [scanning]
  │                        │
  └──── ◄──────── ─────────┘
          STOP
```

| Estado       | Descripción                         |
| ------------ | ------------------------------------ |
| `idle`     | Cámara apagada, UI en reposo        |
| `scanning` | Cámara activa, analizando emociones |

---

## Cómo añadir un estado nuevo

## Ejemplo: añadir `requesting_permission`

**Paso 1 — `moodLensMachine.js`**

```js
// 1. Amplía el objeto TRANSITIONS
const TRANSITIONS = {
  idle: {
    START: 'requesting_permission', // cambia el destino
  },
  requesting_permission: {
    PERMISSION_GRANTED: 'scanning',
    PERMISSION_DENIED:  'error',
  },
  scanning: {
    STOP: 'idle',
  },
  error: {
    RETRY: 'idle',
  },
};

// 2. Añade side-effects en los hooks si los necesitas
_onEnter(state) {
  if (state === 'requesting_permission') {
    // aquí irá getUserMedia() en el futuro
  }
}

```

**Paso 2 — `moodLens.js`**

```js
// 3. Añade los eventos nuevos
export const EVENTS = {
  START:              'START',
  STOP:               'STOP',
  PERMISSION_GRANTED: 'PERMISSION_GRANTED', // nuevo
  PERMISSION_DENIED:  'PERMISSION_DENIED',  // nuevo
  RETRY:              'RETRY',              // nuevo
}

// 4. Añade derived stores si los componentes los necesitan
export const isRequesting = derived(_fsmState, s => s === 'requesting_permission')
export const isError      = derived(_fsmState, s => s === 'error')

// 5. Añade las acciones públicas
export const actions = {
  start()             { machine.send(EVENTS.START) },
  stop()              { machine.send(EVENTS.STOP) },
  permissionGranted() { machine.send(EVENTS.PERMISSION_GRANTED) }, // nuevo
  permissionDenied()  { machine.send(EVENTS.PERMISSION_DENIED) },  // nuevo
  retry()             { machine.send(EVENTS.RETRY) },              // nuevo
}
```

Paso 3 — Componentes UI

```plaintext
<!-- Solo añades el bloque visual para el estado nuevo -->
<!-- Los demás estados NO se tocan -->
{#if $isRequesting}
  <!-- UI de "solicitando permisos..." -->
{:else if $isError}
  <!-- UI de error con botón retry -->
{/if}
```

> ✅ **Regla de oro:** los componentes nunca llaman `machine.send()` directamente. Solo usan `actions.*` del store. Así la FSM es la única fuente de verdad.

---

## Estructura de archivos

```plaintext
src/
├── lib/
│   ├── fsm/
│   │   └── moodLensMachine.js   ← FSM pura, sin Svelte
│   ├── stores/
│   │   └── moodLens.js          ← puente FSM ↔ Svelte
│   └── components/
│       ├── CameraFeed.svelte
│       ├── EmotionPanel.svelte
│       ├── ConfidenceBar.svelte
│       ├── EmotionOrb.svelte
│       └── EmotionHistory.svelte
└── routes/
    └── +page.svelte
```

---

## Próximos pasos planeados

* [ ] Añadir estado `requesting_permission` con `getUserMedia()`
* [ ] Añadir estado `error` con mensaje y botón retry
* [ ] Conectar **face-api.js** o **TensorFlow.js** y reemplazar `mockEmotion`
* [ ] Implementar `actions.setEmotion(data)` y `actions.addToHistory(item)` en el store
* [ ] Añadir estado `face_lost` cuando no hay rostro en frame

<style>#mermaid-1771799212509{font-family:sans-serif;font-size:16px;fill:#333;}#mermaid-1771799212509 .error-icon{fill:#552222;}#mermaid-1771799212509 .error-text{fill:#552222;stroke:#552222;}#mermaid-1771799212509 .edge-thickness-normal{stroke-width:2px;}#mermaid-1771799212509 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1771799212509 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1771799212509 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1771799212509 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1771799212509 .marker{fill:#333333;}#mermaid-1771799212509 .marker.cross{stroke:#333333;}#mermaid-1771799212509 svg{font-family:sans-serif;font-size:16px;}#mermaid-1771799212509 .label{font-family:sans-serif;color:#333;}#mermaid-1771799212509 .label text{fill:#333;}#mermaid-1771799212509 .node rect,#mermaid-1771799212509 .node circle,#mermaid-1771799212509 .node ellipse,#mermaid-1771799212509 .node polygon,#mermaid-1771799212509 .node path{fill:#ECECFF;stroke:#9370DB;stroke-width:1px;}#mermaid-1771799212509 .node .label{text-align:center;}#mermaid-1771799212509 .node.clickable{cursor:pointer;}#mermaid-1771799212509 .arrowheadPath{fill:#333333;}#mermaid-1771799212509 .edgePath .path{stroke:#333333;stroke-width:1.5px;}#mermaid-1771799212509 .flowchart-link{stroke:#333333;fill:none;}#mermaid-1771799212509 .edgeLabel{background-color:#e8e8e8;text-align:center;}#mermaid-1771799212509 .edgeLabel rect{opacity:0.5;background-color:#e8e8e8;fill:#e8e8e8;}#mermaid-1771799212509 .cluster rect{fill:#ffffde;stroke:#aaaa33;stroke-width:1px;}#mermaid-1771799212509 .cluster text{fill:#333;}#mermaid-1771799212509 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:sans-serif;font-size:12px;background:hsl(80,100%,96.2745098039%);border:1px solid #aaaa33;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1771799212509:root{--mermaid-font-family:sans-serif;}#mermaid-1771799212509:root{--mermaid-alt-font-family:sans-serif;}#mermaid-1771799212509 flowchart{fill:apa;}</style>

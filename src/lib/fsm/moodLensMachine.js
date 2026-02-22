// ─── Definición de la máquina ───────────────────────────────────────────────
//
// Para agregar un nuevo estado en el futuro:
//   1. Añádelo a STATES
//   2. Añade sus transiciones en TRANSITIONS
//   3. Si tiene side-effects de entrada/salida, añádelos en _onEnter / _onExit
//
// Para agregar un nuevo evento:
//   1. Añádelo a EVENTS
//   2. Úsalo como clave en las transiciones del estado correspondiente

export const STATES = {
  IDLE:     'idle',
  SCANNING: 'scanning',
  // Futuros: REQUESTING_PERMISSION, PAUSED, ERROR, FACE_LOST...
}

export const EVENTS = {
  START: 'START',
  STOP:  'STOP',
  // Futuros: PERMISSION_GRANTED, PERMISSION_DENIED, PAUSE, FACE_LOST...
}

// Tabla de transiciones: { [estado]: { [evento]: siguienteEstado } }
const TRANSITIONS = {
  [STATES.IDLE]: {
    [EVENTS.START]: STATES.SCANNING,
  },
  [STATES.SCANNING]: {
    [EVENTS.STOP]: STATES.IDLE,
  },
}

// ─── Clase FSM ───────────────────────────────────────────────────────────────

export class MoodLensMachine {
  #state
  #listeners

  constructor() {
    this.#state     = STATES.IDLE
    this.#listeners = []
  }

  // Estado actual (lectura)
  get state() {
    return this.#state
  }

  // Suscripción a cambios: fn({ from, to, event })
  // Retorna una función para desuscribirse
  subscribe(fn) {
    this.#listeners.push(fn)
    return () => {
      this.#listeners = this.#listeners.filter(l => l !== fn)
    }
  }

  // Dispara un evento y realiza la transición si es válida
  send(event) {
    const currentTransitions = TRANSITIONS[this.#state]

    if (!currentTransitions || !(event in currentTransitions)) {
      console.warn(
        `[MoodLensFSM] Evento "${event}" ignorado — no válido en estado "${this.#state}"`
      )
      return false
    }

    const from = this.#state
    const to   = currentTransitions[event]

    this.#onExit(from)
    this.#state = to
    this.#onEnter(to)

    // Notifica a todos los suscriptores
    this.#listeners.forEach(fn => fn({ from, to, event }))

    return true
  }

  // Comprueba si un evento es válido desde el estado actual
  can(event) {
    return !!(TRANSITIONS[this.#state]?.[event])
  }

  // Verifica si la máquina está en un estado concreto
  is(stateName) {
    return this.#state === stateName
  }

  // ── Hooks de ciclo de vida (extiende aquí con lógica real en el futuro) ──

  #onEnter(state) {
    // Ejemplo futuro: if (state === STATES.REQUESTING_PERMISSION) requestCameraAccess()
    if (import.meta.env.DEV) {
      console.log(`[MoodLensFSM] → Entrando a: "${state}"`)
    }
  }

  #onExit(state) {
    // Ejemplo futuro: if (state === STATES.SCANNING) stopStream()
    if (import.meta.env.DEV) {
      console.log(`[MoodLensFSM] ← Saliendo de: "${state}"`)
    }
  }
}

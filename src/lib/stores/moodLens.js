import { writable, derived } from 'svelte/store'
import { MoodLensMachine, STATES, EVENTS } from '$lib/fsm/moodLensMachine.js'

// ─── Instancia única de la FSM ───────────────────────────────────────────────
const machine = new MoodLensMachine({
  async requestPermission(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}, audio: false})

      machine.send(EVENTS.PERMISSION_GRANTED, {stream})
    } catch (err) {
      machine.send(EVENTS.PERMISSION_DENIED, {error: err})
    }
  }
})

// ─── Store interno del estado FSM ────────────────────────────────────────────
const _fsmState = writable(machine.state)

// Sincroniza la FSM con el store cada vez que hay una transición
// machine.subscribe(({ to }) => {
//   _fsmState.set(to)
// })

machine.subscribe(({ to, event, payload }) => {
  _fsmState.set(to)

  if (event === EVENTS.PERMISSION_GRANTED && payload?.stream) {
    _stream.set(payload.stream)
  }

  if (event === EVENTS.PERMISSION_DENIED) {
    _stream.set(null)
  }

  if (event === EVENTS.STOP) {
    _stream.update((s) => {
      if (s) s.getTracks().forEach(t => t.stop())
      return null
    })
  }
})

// ─── Store de datos de UI ────────────────────────────────────────────────────
const _emotion = writable({
  label:      'Happy',
  confidence: 87,
  emoji:      '😊',
  color:      'yellow',
})

const _history = writable([
  { label: 'Happy',     emoji: '😊', color: 'yellow', time: '11:58 PM' },
  { label: 'Surprised', emoji: '😲', color: 'orange', time: '11:57 PM' },
  { label: 'Neutral',   emoji: '😐', color: 'slate',  time: '11:56 PM' },
  { label: 'Sad',       emoji: '😢', color: 'blue',   time: '11:55 PM' },
  { label: 'Angry',     emoji: '😠', color: 'red',    time: '11:54 PM' },
  { label: 'Fearful',   emoji: '😨', color: 'purple', time: '11:53 PM' },
  { label: 'Disgusted', emoji: '🤢', color: 'green',  time: '11:52 PM' },
])

const _stream = writable(null)

// ─── Stores públicos (solo lectura para los componentes) ─────────────────────

// El estado FSM como string: 'idle' | 'scanning' | ...
export const fsmState = { subscribe: _fsmState.subscribe }

// El stream de video (si se ha concedido permiso)
export const stream = { subscribe: _stream.subscribe }

// Datos derivados de conveniencia
export const isIdle = derived(_fsmState, s => s === STATES.IDLE)
export const isScanning = derived(_fsmState, s => s === STATES.SCANNING)

// Datos de emoción e historial
export const emotion = { subscribe: _emotion.subscribe }
export const history = { subscribe: _history.subscribe }

// ─── Acciones públicas (los componentes solo llaman estas) ───────────────────
export const actions = {
  start() {
    machine.send(EVENTS.START)
  },
  stop() {
    machine.send(EVENTS.STOP)
  },
  // Futuro: setEmotion(data) { _emotion.set(data) }
  // Futuro: addToHistory(item) { _history.update(h => [item, ...h].slice(0, 20)) }
}

// ─── Debug export (solo para DevPanel) ──────────────────────────────────────

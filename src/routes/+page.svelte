<script>
  import CameraFeed      from '$lib/components/CameraFeed.svelte'
  import EmotionPanel    from '$lib/components/EmotionPanel.svelte'
  import EmotionOrb      from '$lib/components/EmotionOrb.svelte'
  import EmotionHistory  from '$lib/components/EmotionHistory.svelte'

  import { stream, fsmState, isScanning, emotion, history, actions } from '$lib/stores/moodLens.js'
</script>

<div class="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">

  <!-- ── Header ── -->
  <header class="flex items-center justify-between px-6 py-4
                 border-b border-slate-200 dark:border-slate-800
                 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
    <div class="flex items-center gap-2">
      <span class="text-2xl" aria-hidden="true">🔍</span>
      <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Mood<span class="text-violet-600 dark:text-violet-400">Lens</span>
      </span>
    </div>

    <div class="flex items-center gap-3">
      <!-- Badge de estado -->
      <span class="text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-300
        {$isScanning
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
          : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}">
        {$isScanning ? '● Live' : '○ Idle'}
      </span>

      <!-- Botón principal — usa acciones del store, no lógica local -->
      <button
        on:click={() => $isScanning ? actions.stop() : actions.start()}
        class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all
               bg-violet-600 hover:bg-violet-700 active:scale-95 text-white
               focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        {$isScanning ? 'Stop' : 'Start Camera'}
      </button>
    </div>
  </header>

  <!-- ── Main ── -->
  <main class="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">

    <!-- Zona central: Panel | Cámara | Orb -->
    <div class="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6">

      <div class="w-full md:w-56 flex-shrink-0">
        <EmotionPanel emotion={$emotion} appState={$fsmState} />
      </div>

      <div class="flex-1 w-full max-w-2xl">
        <CameraFeed emotion={$emotion} appState={$fsmState} stream={$stream} />
      </div>

      <div class="w-full md:w-56 flex-shrink-0 flex justify-center">
        <EmotionOrb emotion={$emotion} appState={$fsmState} />
      </div>

    </div>

    <!-- Historial -->
    <div class="w-full max-w-5xl">
      <EmotionHistory history={$history} />
    </div>

  </main>
</div>

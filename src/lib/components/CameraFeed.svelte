<script>
	import { onMount, onDestroy } from 'svelte'
  import * as faceapi from 'face-api.js'
  import { ensureModelsLoaded } from '$lib/vision/faceapiModels.js'
  import { actions } from '$lib/stores/moodLens.js'

  export let appState = 'idle';
  export let emotion = null;
  export let stream = null;

  let videoEl;

  const borderColorMap = {
    yellow: 'ring-yellow-400',
    orange: 'ring-orange-400',
    blue:   'ring-blue-400',
    red:    'ring-red-400',
    purple: 'ring-purple-400',
    green:  'ring-green-500',
    slate:  'ring-slate-400',
  };

  $: ringColor = appState === 'scanning' && emotion
    ? (borderColorMap[emotion.color] ?? 'ring-violet-500')
    : 'ring-slate-300 dark:ring-slate-700';

    $: if (videoEl) {
      videoEl.srcObject = stream || null;
    }

  let timer = null
  let busy = false

  let lastLabel = null
  let stableCount = 0
  const REQUIRED_TICKS = 3


  function pickTopExpression(expressions) {
    const entries = Object.entries(expressions ?? {})
    if (!entries.length) return null
    entries.sort((a, b) => b[1] - a[1])
    const [label, score] = entries[0]
    return { label, confidence: Math.round(score * 100) }
  }

  async function tickDetect() {
    if (!videoEl || appState !== 'scanning') return
    if (busy) return
    if (videoEl.readyState < 2) return // no frame todavía

    busy = true
    try {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 160,
        scoreThreshold: 0.5
      })

      const result = await faceapi
        .detectSingleFace(videoEl, options)
        .withFaceExpressions()

      if (result?.expressions) {
        const top = pickTopExpression(result.expressions)
        // if (top) actions.setEmotionFromVision(top)

        if (top) {
          const label = String(top.label).toLowerCase()

          if (label === lastLabel) stableCount += 1
          else { lastLabel = label; stableCount = 1 }

          if (stableCount >= REQUIRED_TICKS) {
            actions.setEmotionFromVision({ label, confidence: top.confidence })
        }
}
      }
      // si no hay cara, podrías setear un estado "no_face" (solo UI) más adelante
    } catch (e) {
      // por ahora solo consola
      console.error(e)
    } finally {
      busy = false
    }
  }

  function startLoop() {
    if (timer) return
    timer = setInterval(tickDetect, 200)
  }

  function stopLoop() {
    if (!timer) return
    clearInterval(timer)
    timer = null
  }

  // Importante: onMount NO debe ser async si vas a retornar cleanup sin problemas [web:400]
  onMount(() => {
    let cancelled = false

    ;(async () => {
      try {
        await ensureModelsLoaded()
        if (cancelled) return
        if (appState === 'scanning') startLoop()
      } catch (e) {
        console.error('Model load failed', e)
      }
    })()

    return () => {
      cancelled = true
      stopLoop()
    }
  })

  // Reaccionar a cambios de estado
  $: if (appState === 'scanning') {
    // si modelos ya cargaron, arranca loop
    startLoop()
  } else {
    stopLoop()
  }

  onDestroy(() => {
    stopLoop()
  })
</script>

<div class="relative w-full aspect-video rounded-2xl overflow-hidden
            ring-4 transition-all duration-700 shadow-xl {ringColor}">

  <!-- Video placeholder / real video -->
  {#if appState === 'idle'}
    <!-- IDLE STATE -->
    <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center gap-4">
      <div class="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-4xl">
        📷
      </div>
      <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Camera is off</p>
      <p class="text-slate-400 dark:text-slate-500 text-xs">Press "Start Camera" to begin</p>
    </div>

  {:else}
    <!-- SCANNING STATE -->
    <!-- Real implementation: bind video element to getUserMedia stream -->
    <div class="absolute inset-0 bg-slate-900 flex items-center justify-center">
      <!-- Placeholder for real <video> element -->
      <video
        bind:this={videoEl}
        class="w-full h-full object-cover"
        autoplay
        muted
        playsinline
        aria-label="Camera feed"
      ></video>

      <!-- Scanning overlay animation -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Scan line -->
        <div class="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent animate-scan-line"></div>

        <!-- Corner brackets -->
        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-violet-400 rounded-tl-lg opacity-70"></div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-violet-400 rounded-tr-lg opacity-70"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-violet-400 rounded-bl-lg opacity-70"></div>
        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-violet-400 rounded-br-lg opacity-70"></div>
      </div>

      <!-- Emotion label pill over video top -->
      {#if emotion}
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10
                    px-5 py-2 rounded-full backdrop-blur-md
                    bg-white/20 dark:bg-slate-900/40 border border-white/30
                    flex items-center gap-2 shadow-lg">
          <span class="text-lg" aria-hidden="true">{emotion.emoji}</span>
          <span class="text-white font-semibold text-sm tracking-wide drop-shadow">{emotion.label}</span>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @keyframes scan-line {
    0%   { top: 0%; opacity: 0.8; }
    50%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  .animate-scan-line {
    animation: scan-line 2.5s linear infinite;
  }
</style>

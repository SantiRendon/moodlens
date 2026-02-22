<script>
  import ConfidenceBar from './ConfidenceBar.svelte';

  export let emotion = null;
  export let appState = 'idle';

  const emotionMeta = {
    Happy:     { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-300 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', label: 'Feeling joyful ✨' },
    Sad:       { bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-300 dark:border-blue-700',     text: 'text-blue-700 dark:text-blue-300',     label: 'A bit down 💧' },
    Angry:     { bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-300 dark:border-red-700',       text: 'text-red-700 dark:text-red-300',       label: 'Feeling intense 🔥' },
    Surprised: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', label: 'Whoa, what?! ⚡' },
    Fearful:   { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', label: 'Stay calm 🌿' },
    Disgusted: { bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-300 dark:border-green-700',   text: 'text-green-700 dark:text-green-300',   label: 'Not a fan 😬' },
    Neutral:   { bg: 'bg-slate-50 dark:bg-slate-800/40',   border: 'border-slate-300 dark:border-slate-600',   text: 'text-slate-600 dark:text-slate-300',   label: 'Cool and collected 🧊' },
  };

  $: meta = emotion ? (emotionMeta[emotion.label] ?? emotionMeta['Neutral']) : null;
</script>

<div class="w-full rounded-2xl border bg-white dark:bg-slate-900 shadow-md
            transition-all duration-500 overflow-hidden
            {meta ? meta.border : 'border-slate-200 dark:border-slate-700'}">

  <!-- Top color band -->
  <div class="h-1.5 w-full transition-all duration-700
    {appState === 'scanning' && meta ? meta.bg.split(' ')[0] : 'bg-slate-200 dark:bg-slate-700'}">
  </div>

  <div class="p-5 flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Detected Emotion
      </span>
    </div>

    <!-- Emotion display -->
    {#if appState === 'idle' || !emotion}
      <div class="flex flex-col items-center gap-2 py-4">
        <div class="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
          😶
        </div>
        <p class="text-sm text-slate-400 dark:text-slate-500 text-center">
          No data yet
        </p>
      </div>

    {:else}
      <!-- Scanning: show emotion -->
      <div class="flex flex-col items-center gap-1 py-2">
        <div class="w-16 h-16 rounded-full flex items-center justify-center text-4xl
                    {meta.bg} border-2 {meta.border} transition-all duration-500 shadow-sm">
          {emotion.emoji}
        </div>
        <h2 class="text-2xl font-bold mt-2 {meta.text} transition-colors duration-500">
          {emotion.label}
        </h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 text-center italic">
          {meta.label}
        </p>
      </div>

      <!-- Confidence Bar -->
      <ConfidenceBar value={emotion.confidence} color={emotion.color} />
    {/if}

    <!-- Scanning pulse indicator -->
    {#if appState === 'scanning'}
      <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
        </span>
        Analyzing in real-time
      </div>
    {/if}
  </div>
</div>

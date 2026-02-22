<script>
  export let emotion = null;
  export let appState = 'idle';

  // Orb glow colors per emotion
  const orbMap = {
    Happy:     { from: '#fde047', to: '#f97316', shadow: '255, 200, 50' },
    Sad:       { from: '#60a5fa', to: '#3b82f6', shadow: '96, 165, 250' },
    Angry:     { from: '#f87171', to: '#dc2626', shadow: '248, 113, 113' },
    Surprised: { from: '#fb923c', to: '#f97316', shadow: '251, 146, 60' },
    Fearful:   { from: '#c084fc', to: '#9333ea', shadow: '192, 132, 252' },
    Disgusted: { from: '#4ade80', to: '#16a34a', shadow: '74, 222, 128' },
    Neutral:   { from: '#94a3b8', to: '#64748b', shadow: '148, 163, 184' },
  };

  $: orb = appState === 'scanning' && emotion
    ? (orbMap[emotion.label] ?? orbMap['Neutral'])
    : null;
</script>

<div class="flex flex-col items-center gap-4">
  <span class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
    Mood Aura
  </span>

  <!-- Orb container -->
  <div class="relative flex items-center justify-center w-36 h-36">

    <!-- Outer glow ring (animated) -->
    {#if orb}
      <div
        class="absolute inset-0 rounded-full animate-pulse opacity-30 blur-xl transition-all duration-700"
        style="background: radial-gradient(circle, rgb({orb.shadow}) 0%, transparent 70%);"
      ></div>
      <div
        class="absolute inset-2 rounded-full animate-pulse opacity-20 blur-lg transition-all duration-700"
        style="background: radial-gradient(circle, rgb({orb.shadow}) 0%, transparent 80%);"
      ></div>
    {/if}

    <!-- Orb sphere -->
    <div
      class="relative w-28 h-28 rounded-full transition-all duration-700 shadow-2xl
             flex items-center justify-center"
      style={orb
        ? `background: radial-gradient(circle at 35% 35%, ${orb.from}, ${orb.to}); box-shadow: 0 0 40px rgba(${orb.shadow}, 0.5), 0 0 80px rgba(${orb.shadow}, 0.2);`
        : 'background: radial-gradient(circle at 35% 35%, #e2e8f0, #94a3b8);'}
    >
      <!-- Inner highlight -->
      <div class="absolute top-3 left-4 w-5 h-3 rounded-full bg-white/40 blur-sm rotate-[-20deg]"></div>
      <!-- Idle icon -->
      {#if appState === 'idle'}
        <span class="text-3xl opacity-40">🌑</span>
      {:else if emotion}
        <span class="text-3xl drop-shadow-md select-none">{emotion.emoji}</span>
      {/if}
    </div>

  </div>

  <!-- Emotion name under orb -->
  {#if appState === 'scanning' && emotion}
    <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all duration-500">
      {emotion.label}
    </p>
  {:else}
    <p class="text-sm text-slate-400 dark:text-slate-600">Waiting…</p>
  {/if}
</div>

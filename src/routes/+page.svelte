
<script>
  import CameraFeed from '$lib/components/CameraFeed.svelte';
  import EmotionPanel from '$lib/components/EmotionPanel.svelte';
  import EmotionOrb from '$lib/components/EmotionOrb.svelte';
  import EmotionHistory from '$lib/components/EmotionHistory.svelte';

  // UI state only — no real logic
  let appState = 'idle'; // 'idle' | 'scanning'

  const mockEmotion = {
    label: 'Happy',
    confidence: 87,
    emoji: '😊',
    color: 'yellow',
  };

  const mockHistory = [
    { label: 'Happy',    emoji: '😊', color: 'yellow', time: '11:58 PM' },
    { label: 'Surprised',emoji: '😲', color: 'orange', time: '11:57 PM' },
    { label: 'Neutral',  emoji: '😐', color: 'slate',  time: '11:56 PM' },
    { label: 'Sad',      emoji: '😢', color: 'blue',   time: '11:55 PM' },
    { label: 'Angry',    emoji: '😠', color: 'red',    time: '11:54 PM' },
    { label: 'Fearful',  emoji: '😨', color: 'purple', time: '11:53 PM' },
    { label: 'Disgusted',emoji: '🤢', color: 'green',  time: '11:52 PM' },
  ];

  function toggleState() {
    appState = appState === 'idle' ? 'scanning' : 'idle';
  }
</script>

<div class="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">

  <!-- ── Header ── -->
  <header class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🔍</span>
      <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Mood<span class="text-violet-600 dark:text-violet-400">Lens</span>
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs font-medium px-2.5 py-1 rounded-full
        {appState === 'scanning'
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
          : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}">
        {appState === 'scanning' ? '● Live' : '○ Idle'}
      </span>
      <button
        on:click={toggleState}
        class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all
          bg-violet-600 hover:bg-violet-700 active:scale-95 text-white
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        {appState === 'idle' ? 'Start Camera' : 'Stop'}
      </button>
    </div>
  </header>

  <!-- ── Main Content ── -->
  <main class="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">

    <!-- Central Zone: Panel | Camera | Orb -->
    <div class="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6">

      <!-- Left: Emotion Panel -->
      <div class="w-full md:w-56 flex-shrink-0">
        <EmotionPanel emotion={mockEmotion} {appState} />
      </div>

      <!-- Center: Camera -->
      <div class="flex-1 w-full max-w-2xl">
        <CameraFeed {appState} emotion={mockEmotion} />
      </div>

      <!-- Right: Orb -->
      <div class="w-full md:w-56 flex-shrink-0 flex justify-center">
        <EmotionOrb emotion={mockEmotion} {appState} />
      </div>

    </div>

    <!-- Bottom: History -->
    <div class="w-full max-w-5xl">
      <EmotionHistory history={mockHistory} />
    </div>

  </main>
</div>

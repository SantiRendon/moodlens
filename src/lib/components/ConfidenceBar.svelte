<script>
  export let value = 0;   // 0–100
  export let color = 'violet';

  const trackMap = {
    yellow: 'bg-yellow-400',
    orange: 'bg-orange-400',
    blue:   'bg-blue-400',
    red:    'bg-red-400',
    purple: 'bg-purple-500',
    green:  'bg-green-500',
    slate:  'bg-slate-400',
    violet: 'bg-violet-500',
  };

  $: barColor = trackMap[color] ?? trackMap['violet'];
  $: clampedValue = Math.min(100, Math.max(0, value));
  $: label = clampedValue >= 80 ? 'High' : clampedValue >= 50 ? 'Medium' : 'Low';
</script>

<div class="w-full flex flex-col gap-1.5" role="meter" aria-valuenow={clampedValue} aria-valuemin="0" aria-valuemax="100" aria-label="Confidence level">
  <div class="flex items-center justify-between text-xs font-medium">
    <span class="text-slate-500 dark:text-slate-400">Confidence</span>
    <span class="text-slate-700 dark:text-slate-300 tabular-nums">{clampedValue}% <span class="text-slate-400">· {label}</span></span>
  </div>

  <!-- Track -->
  <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
    <!-- Fill -->
    <div
      class="h-full rounded-full transition-all duration-700 ease-out {barColor}"
      style="width: {clampedValue}%"
    ></div>
  </div>
</div>

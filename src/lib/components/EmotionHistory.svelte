<script>
  export let history = [];

  const chipColorMap = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    orange: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    blue:   'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    red:    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    purple: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    green:  'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    slate:  'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  };
</script>

<div class="w-full">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      Emotion History
    </h3>
    {#if history.length > 0}
      <span class="text-xs text-slate-400 dark:text-slate-600">{history.length} detected</span>
    {/if}
  </div>

  {#if history.length === 0}
    <!-- Empty state -->
    <div class="flex items-center justify-center py-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-sm gap-2">
      <span>🕑</span> No history yet
    </div>

  {:else}
    <!-- Scrollable chips row -->
    <div class="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory" role="list">
      {#each history as item, i}
        <div
          role="listitem"
          class="flex-shrink-0 snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl border
                 text-sm font-medium transition-all duration-300 shadow-sm
                 hover:scale-105 hover:shadow-md cursor-default
                 {chipColorMap[item.color] ?? chipColorMap['slate']}"
        >
          <span class="text-base" aria-hidden="true">{item.emoji}</span>
          <div class="flex flex-col leading-tight">
            <span class="font-semibold text-xs">{item.label}</span>
            <span class="text-[10px] opacity-60 tabular-nums">{item.time}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type VibeMode = 'friendly' | 'competitive';
  type Phase = 0 | 1 | 2 | 3 | 4;
  type NodeVibe = 'friendly' | 'competitive' | 'dual';

  const EMERALD      = '#10B981';
  const EMERALD_DARK = '#059669';
  const AMBER        = '#F59E0B';
  const AMBER_DARK   = '#D97706';

  interface PlayerNode { id: string; x: number; y: number; label: string; rating: string; vibe: NodeVibe; }
  interface EdgeDef    { fromId: string; toId: string; weight: number; label?: string; }

  // ─── Data ──────────────────────────────────────────────────────────────────

  const ALL_PLAYERS: PlayerNode[] = [
    { id: 'you',    x: 125, y: 80,  label: 'You',    rating: '3.5', vibe: 'dual' },
    { id: 'sam',    x: 163, y: 28,  label: 'Sam',    rating: '3.4', vibe: 'friendly' },
    { id: 'jordan', x: 150, y: 132, label: 'Jordan', rating: '3.6', vibe: 'friendly' },
    { id: 'alex',   x: 195, y: 80,  label: 'Alex',   rating: '3.8', vibe: 'dual' },
    { id: 'mia',    x: 228, y: 28,  label: 'Mia',    rating: '4.2', vibe: 'competitive' },
    { id: 'leo',    x: 235, y: 132, label: 'Leo',    rating: '4.0', vibe: 'competitive' },
  ];

  const EDGES: Record<VibeMode, EdgeDef[]> = {
    friendly: [
      { fromId: 'you', toId: 'sam',    weight: 0.95, label: 'vibe 94%' },
      { fromId: 'you', toId: 'jordan', weight: 0.90, label: 'vibe 91%' },
      { fromId: 'you', toId: 'alex',   weight: 0.85, label: 'vibe 87%' },
      { fromId: 'sam',    toId: 'jordan', weight: 0.5 },
      { fromId: 'sam',    toId: 'alex',   weight: 0.4 },
      { fromId: 'jordan', toId: 'alex',   weight: 0.35 },
      { fromId: 'you', toId: 'mia', weight: 0.08 },
      { fromId: 'you', toId: 'leo', weight: 0.08 },
    ],
    competitive: [
      { fromId: 'you', toId: 'mia',  weight: 0.95, label: 'skill +0.7' },
      { fromId: 'you', toId: 'leo',  weight: 0.90, label: 'skill +0.5' },
      { fromId: 'you', toId: 'alex', weight: 0.80, label: 'skill +0.3' },
      { fromId: 'mia',  toId: 'leo',  weight: 0.5 },
      { fromId: 'mia',  toId: 'alex', weight: 0.4 },
      { fromId: 'leo',  toId: 'alex', weight: 0.35 },
      { fromId: 'you', toId: 'sam',    weight: 0.08 },
      { fromId: 'you', toId: 'jordan', weight: 0.08 },
    ],
  };

  const SQUAD_IDS: Record<VibeMode, string[]> = {
    friendly:    ['you', 'sam', 'jordan', 'alex'],
    competitive: ['you', 'mia', 'leo', 'alex'],
  };

  const BOOKING = {
    friendly:    { title: 'Social Doubles', time: 'Saturday 10:00am', venue: 'Padel Club Central', tagline: 'No group chat required. Just show up and play.' },
    competitive: { title: 'Ranked Match',   time: 'Thursday 7:00pm',  venue: 'Arena Sports',       tagline: 'No ladder drama required. The AI finds your challenge.' },
  };

  const PHASE_DELAYS: Record<number, number> = { 0: 0, 1: 0, 2: 1300, 3: 1500, 4: 1300 };
  const STEP_LABELS = ['Set your vibe', 'AI finds squad', 'Court booked'];
  const PHASE_TO_STEP: Record<number, number> = { 0: -1, 1: 0, 2: 1, 3: 1, 4: 2 };

  // ─── State ─────────────────────────────────────────────────────────────────

  let vibeMode: VibeMode = 'friendly';
  let phase: Phase = 0;
  let isPlaying = false;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let containerEl: HTMLDivElement;
  let hasAutoStarted = false;
  let observer: IntersectionObserver | null = null;

  const playerMap = Object.fromEntries(ALL_PLAYERS.map(p => [p.id, p]));

  $: accent    = vibeMode === 'friendly' ? EMERALD      : AMBER;
  $: accentDark = vibeMode === 'friendly' ? EMERALD_DARK : AMBER_DARK;
  $: squadIds  = new Set(SQUAD_IDS[vibeMode]);
  $: edges     = EDGES[vibeMode];
  $: activeStep = PHASE_TO_STEP[phase];
  $: booking   = BOOKING[vibeMode];
  $: showTagline = phase >= 4;

  // ─── Phase machine ─────────────────────────────────────────────────────────

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function runAutoPlay(fromPhase: Phase = 1) {
    clearTimers();
    phase = fromPhase;
    isPlaying = true;
    const seq = ([2, 3, 4] as Phase[]).filter(p => p > fromPhase);
    let elapsed = 0;
    seq.forEach(p => {
      elapsed += PHASE_DELAYS[p];
      const t = setTimeout(() => { phase = p; if (p === 4) isPlaying = false; }, elapsed);
      timers.push(t);
    });
  }

  function play() {
    if (phase === 4) { clearTimers(); phase = 0; timers.push(setTimeout(() => runAutoPlay(1), 80)); }
    else runAutoPlay(phase === 0 ? 1 : phase as Phase);
  }

  function pause() { clearTimers(); isPlaying = false; }

  function goToStep(step: number) {
    clearTimers(); isPlaying = false;
    const m: Record<number, Phase> = { 0: 1, 1: 3, 2: 4 };
    phase = m[step] ?? 0;
  }

  function stepBack() {
    clearTimers(); isPlaying = false;
    if (phase >= 4) phase = 3;
    else if (phase >= 2) phase = 1;
    else phase = 0;
  }

  function stepForward() {
    clearTimers(); isPlaying = false;
    if (phase === 0) phase = 1;
    else if (phase === 1) phase = 3;
    else if (phase >= 3) phase = 4;
  }

  function reset(autoStart = false) {
    clearTimers(); phase = 0; isPlaying = false;
    if (autoStart) timers.push(setTimeout(() => runAutoPlay(1), 80));
  }

  function handleVibeChange(v: VibeMode) {
    vibeMode = v;
    if (phase === 0) reset(true);
  }

  // ─── SVG helpers ───────────────────────────────────────────────────────────

  function nodeOpacity(id: string): number {
    if (phase < 2) return 0;
    return squadIds.has(id) ? 1 : 0.3;
  }
  function nodeScale(): number { return phase >= 2 ? 1 : 0.4; }
  function nodeDelay(i: number): string { return phase >= 2 ? `${i * 0.07}s` : '0s'; }

  function edgeOpacity(e: EdgeDef): number {
    if (phase < 3 || e.weight <= 0.1) return 0;
    return 0.15 + e.weight * 0.5;
  }
  function edgeSW(e: EdgeDef): number { return 0.5 + e.weight * 1.5; }
  function edgeLabelOpacity(e: EdgeDef): number { return phase >= 3 && e.weight > 0.1 ? 1 : 0; }

  function vibeColor(v: NodeVibe): string { return v === 'competitive' ? AMBER : EMERALD; }
  function vibeStroke(v: NodeVibe): string { return v === 'competitive' ? AMBER_DARK : EMERALD_DARK; }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !hasAutoStarted) { hasAutoStarted = true; play(); }
      }, { rootMargin: '-80px' });
      if (containerEl) observer.observe(containerEl);
    }
  });

  onDestroy(() => { clearTimers(); observer?.disconnect(); });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class="padel-flow"
  on:click|stopPropagation
  on:keydown|stopPropagation
>
  <!-- Header row -->
  <div class="flow-header">
    <span class="flow-label">How it works</span>
    <div class="vibe-toggle" role="group" aria-label="Match Vibe">
      {#each (['friendly', 'competitive'] as VibeMode[]) as v}
        <button
          class="vibe-btn"
          class:active={vibeMode === v}
          style={vibeMode === v ? `background:${accent};color:#fff;` : ''}
          on:click={() => handleVibeChange(v)}
        >{v === 'friendly' ? 'Friendly' : 'Competitive'}</button>
      {/each}
    </div>
  </div>

  <!-- Main SVG diagram -->
  <svg viewBox="0 0 360 160" class="flow-svg" aria-label="Padel match booking flow">

    <!-- Phase 1: Vibe box (left) -->
    <g style="opacity:{phase>=1?1:0};transition:opacity .5s ease">
      <rect x="8" y="56" width="72" height="48" rx="8"
        fill={vibeMode==='friendly' ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)'}
        stroke={accent} stroke-width="1" />
      <text x="44" y="74" text-anchor="middle" font-size="5.5" font-weight="600" fill={accent}>
        {vibeMode === 'friendly' ? 'Friendly' : 'Competitive'}
      </text>
      <text x="44" y="86" text-anchor="middle" font-size="4.5" fill="#9ca3af">match vibe</text>
      <circle cx="44" cy="100" r="3" fill={accent} opacity="0.7" />
    </g>

    <!-- Arrow 1 -->
    <g style="opacity:{phase>=2?0.5:0};transition:opacity .3s ease">
      <line x1="82" y1="80" x2="112" y2="80" stroke={accent} stroke-width="1.5" stroke-dasharray="3 2" />
      <polygon points="112,76 119,80 112,84" fill={accent} />
    </g>

    <!-- Edges -->
    {#each edges as edge}
      {@const from = playerMap[edge.fromId]}
      {@const to   = playerMap[edge.toId]}
      {@const mx   = (from.x + to.x) / 2}
      {@const my   = (from.y + to.y) / 2}
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={accent} stroke-dasharray="3 2"
        style="opacity:{edgeOpacity(edge)};stroke-width:{edgeSW(edge)};transition:opacity .5s,stroke-width .5s"
      />
      {#if edge.label}
        <g style="opacity:{edgeLabelOpacity(edge)};transition:opacity .4s .15s">
          <rect x={mx-18} y={my-6} width="36" height="10" rx="4" fill={accent} opacity="0.15" />
          <text x={mx} y={my+2} text-anchor="middle" font-size="4.5" font-weight="600" fill={accent}>{edge.label}</text>
        </g>
      {/if}
    {/each}

    <!-- Nodes — translate wrapper keeps position; inner g handles scale around center -->
    {#each ALL_PLAYERS as node, i}
      {@const r = node.id === 'you' ? 12 : 10}
      <g
        style="opacity:{nodeOpacity(node.id)};transition:opacity .45s {nodeDelay(i)} ease"
      >
        <!-- inner g centered at (0,0), translated to node position via SVG transform -->
        <g
          transform="translate({node.x} {node.y})"
          style="transform-box:fill-box;transform-origin:0 0;transform:scale({nodeScale()});transition:transform .45s {nodeDelay(i)} cubic-bezier(.175,.885,.32,1.275)"
        >
          {#if node.vibe === 'dual'}
            <clipPath id="dual-l-{node.id}"><rect x={-r} y={-r} width={r} height={r*2} /></clipPath>
            <clipPath id="dual-r-{node.id}"><rect x={0}  y={-r} width={r} height={r*2} /></clipPath>
            <circle r={r} fill={EMERALD} clip-path="url(#dual-l-{node.id})" />
            <circle r={r} fill={AMBER}   clip-path="url(#dual-r-{node.id})" />
            <circle r={r} fill="none" stroke="#fff" stroke-width="1" opacity="0.3" />
          {:else}
            <circle r={r} fill={vibeColor(node.vibe)} stroke={vibeStroke(node.vibe)} stroke-width="1.5" />
          {/if}
          <text y="1"  text-anchor="middle" font-size={node.id==='you'?'5.5':'5'} font-weight="700" fill="white">{node.label}</text>
          <text y="8"  text-anchor="middle" font-size="4"  font-weight="600" fill="rgba(255,255,255,.8)">{node.rating}</text>
        </g>
      </g>
    {/each}

    <!-- Squad found label -->
    <text
      x="182" y="78" text-anchor="middle" font-size="6" font-weight="700" fill={accent}
      style="opacity:{phase>=3?1:0};transform:translateY({phase>=3?0:5}px);transition:opacity .4s .45s,transform .4s .45s"
    >Squad found ✓</text>

    <!-- Arrow 2 -->
    <g style="opacity:{phase>=4?0.5:0};transition:opacity .3s ease">
      <line x1="250" y1="80" x2="265" y2="80" stroke={accent} stroke-width="1.5" stroke-dasharray="3 2" />
      <polygon points="265,76 272,80 265,84" fill={accent} />
    </g>

    <!-- Booking card -->
    <g style="opacity:{phase>=4?1:0};transition:opacity .5s ease">
      <rect x="270" y="18" width="82" height="94" rx="8"
        fill="var(--color-bg-surface, #1a1a1f)" stroke={accent} stroke-width="1.5" />
      <!-- header strip -->
      <rect x="270" y="18" width="82" height="20" rx="8" fill={accent} />
      <rect x="270" y="30" width="82" height="8" fill={accent} />
      <text x="311" y="31" text-anchor="middle" font-size="6.5" font-weight="700" fill="white">{booking.title}</text>
      <!-- details -->
      <text x="311" y="50" text-anchor="middle" font-size="5.5" font-weight="600" fill={accentDark}>{booking.time}</text>
      <text x="311" y="61" text-anchor="middle" font-size="5"   fill="#9ca3af">{booking.venue}</text>
      <line x1="278" y1="67" x2="344" y2="67" stroke="rgba(255,255,255,.1)" stroke-width="0.75" />
      <!-- squad list -->
      {#each SQUAD_IDS[vibeMode] as id, i}
        {@const p = playerMap[id]}
        {#if p}
          <circle cx="283" cy={76+i*9} r="2.5" fill={accent} />
          <text x="289" y={79+i*9} font-size="4.8" fill="#e5e7eb" font-weight="500">{p.label}</text>
        {/if}
      {/each}
      <!-- check badge (scale in) -->
      <g style="transform-box:fill-box;transform-origin:344px 18px;transform:scale({phase>=4?1:0});transition:transform .4s .3s cubic-bezier(.175,.885,.32,1.275)">
        <circle cx="344" cy="18" r="9" fill={accentDark} />
        <text x="344" y="22" text-anchor="middle" font-size="10" fill="white">✓</text>
      </g>
    </g>

  </svg>

  <!-- Step controls -->
  <div class="step-controls">
    <button class="ctrl-btn" on:click={stepBack} disabled={phase===0} title="Previous step" aria-label="Previous step">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <div class="steps-row">
      {#each STEP_LABELS as label, i}
        {@const active = i === activeStep}
        <button class="step-item" on:click={() => goToStep(i)} title={label} aria-label={label}>
          <span class="step-dot" style={active ? `background:${accent};transform:scale(1.35)` : ''}></span>
          <span class="step-label" style={active ? `color:${accent}` : ''}>{label}</span>
        </button>
      {/each}
    </div>

    <button class="ctrl-btn" on:click={stepForward} disabled={phase===4} title="Next step" aria-label="Next step">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <button
      class="ctrl-btn"
      on:click={() => { if (isPlaying) pause(); else if (phase===4) reset(true); else play(); }}
      title={isPlaying ? 'Pause' : phase===4 ? 'Replay' : 'Play'}
      aria-label={isPlaying ? 'Pause' : phase===4 ? 'Replay' : 'Play'}
    >
      {#if isPlaying}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      {:else if phase === 4}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/></svg>
      {:else}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      {/if}
    </button>
  </div>

  <!-- Tagline -->
  {#if showTagline}
    <p class="tagline">{booking.tagline}</p>
  {/if}
</div>

<style>
  .padel-flow {
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-bg-surface);
    padding: 0.9rem;
    width: 100%;
    box-sizing: border-box;
  }

  .flow-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .flow-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
  }

  .vibe-toggle {
    display: flex;
    background: var(--color-bg-hover);
    border-radius: 999px;
    padding: 2px;
    gap: 2px;
  }

  .vibe-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .flow-svg {
    width: 100%;
    height: auto;
    overflow: visible;
    display: block;
  }

  .step-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
    margin-top: 0.4rem;
  }

  .ctrl-btn {
    border-radius: 50%;
    padding: 0.35rem;
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ctrl-btn:hover:not(:disabled) {
    color: var(--color-text-primary);
    background: var(--color-bg-hover);
  }

  .ctrl-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .steps-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-border);
    display: block;
    transition: background 0.25s, transform 0.25s;
  }

  .step-label {
    font-size: 9px;
    font-weight: 500;
    color: var(--color-text-muted);
    transition: color 0.2s;
    white-space: nowrap;
  }

  .tagline {
    text-align: center;
    font-size: 11px;
    color: var(--color-text-muted);
    margin: 0.5rem 0 0;
    animation: fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>

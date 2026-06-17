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

  let vibeMode: VibeMode = 'friendly';
  let phase: Phase = 0;
  let isPlaying = false;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let containerEl: HTMLDivElement;
  let hasAutoStarted = false;
  let observer: IntersectionObserver | null = null;

  const playerMap = Object.fromEntries(ALL_PLAYERS.map(p => [p.id, p]));

  $: accent     = vibeMode === 'friendly' ? EMERALD      : AMBER;
  $: accentDark = vibeMode === 'friendly' ? EMERALD_DARK : AMBER_DARK;
  $: squadIds   = new Set(SQUAD_IDS[vibeMode]);
  $: edges      = EDGES[vibeMode];
  $: activeStep = PHASE_TO_STEP[phase];
  $: booking    = BOOKING[vibeMode];

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
      const t = setTimeout(() => { phase = p as Phase; if (p === 4) isPlaying = false; }, elapsed);
      timers.push(t);
    });
  }

  function play() {
    if (phase === 4) { clearTimers(); phase = 0; timers.push(setTimeout(() => runAutoPlay(1), 80)); }
    else runAutoPlay(phase === 0 ? 1 : phase as Phase);
  }
  function pause()         { clearTimers(); isPlaying = false; }
  function goToStep(s: number) { clearTimers(); isPlaying = false; phase = ({ 0: 1, 1: 3, 2: 4 } as Record<number,Phase>)[s] ?? 0; }
  function stepBack()      { clearTimers(); isPlaying = false; phase = phase >= 4 ? 3 : phase >= 2 ? 1 : 0; }
  function stepForward()   { clearTimers(); isPlaying = false; phase = phase === 0 ? 1 : phase === 1 ? 3 : phase >= 3 ? 4 : phase; }
  function reset(autoStart = false) {
    clearTimers(); phase = 0; isPlaying = false;
    if (autoStart) timers.push(setTimeout(() => runAutoPlay(1), 80));
  }
  function handleVibeChange(v: VibeMode) { vibeMode = v; if (phase === 0) reset(true); }

  // ─── SVG derived values ────────────────────────────────────────────────────
  // Pass `phase` and `squadIds` explicitly so Svelte tracks them in templates.

  function nodeOp(p: Phase, sIds: Set<string>, id: string) { return p < 2 ? 0 : sIds.has(id) ? 1 : 0.3; }
  function nodeScaleFn(p: Phase)    { return p >= 2 ? 1 : 0.01; }
  function nodeDelayFn(p: Phase, i: number) { return p >= 2 ? `${i * 0.07}s` : '0s'; }
  function edgeOpFn(p: Phase, e: EdgeDef)   { return p < 3 || e.weight <= 0.1 ? 0 : 0.15 + e.weight * 0.5; }
  function edgeSW(e: EdgeDef)       { return 0.5 + e.weight * 1.5; }
  function edgeLabelOpFn(p: Phase, e: EdgeDef) { return p >= 3 && e.weight > 0.1 ? 1 : 0; }
  function nodeColor(v: NodeVibe)   { return v === 'competitive' ? AMBER   : EMERALD; }
  function nodeStroke(v: NodeVibe)  { return v === 'competitive' ? AMBER_DARK : EMERALD_DARK; }

  // dual-color semicircle paths (centered at 0,0)
  function leftHalf(r: number)  { return `M 0,${-r} A ${r},${r} 0 0,0 0,${r} Z`; }
  function rightHalf(r: number) { return `M 0,${-r} A ${r},${r} 0 0,1 0,${r} Z`; }

  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !hasAutoStarted) { hasAutoStarted = true; play(); }
      }, { rootMargin: '-40px' });
      if (containerEl) observer.observe(containerEl);
    }
  });
  onDestroy(() => { clearTimers(); observer?.disconnect(); });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={containerEl} class="padel-flow" on:click|stopPropagation on:keydown|stopPropagation>

  <!-- Header -->
  <div class="flow-header">
    <span class="flow-label">How it works</span>
    <div class="vibe-toggle" role="group">
      {#each (['friendly', 'competitive'] as VibeMode[]) as v}
        <button
          class="vibe-btn"
          class:active={vibeMode === v}
          style={vibeMode === v ? `background:${accent};color:#fff` : ''}
          on:click={() => handleVibeChange(v)}
        >{v === 'friendly' ? 'Friendly' : 'Competitive'}</button>
      {/each}
    </div>
  </div>

  <!-- SVG — viewBox fully contains all elements including booking card (x=352) and node radii -->
  <svg viewBox="-14 -16 382 192" class="flow-svg">

    <!-- Phase 1: Vibe box -->
    <g style="opacity:{phase>=1?1:0};transition:opacity .5s">
      <rect x="8" y="56" width="72" height="48" rx="8"
        fill={vibeMode==='friendly'?'rgba(16,185,129,.1)':'rgba(245,158,11,.1)'}
        stroke={accent} stroke-width="1"/>
      <text x="44" y="74" text-anchor="middle" font-size="5.5" font-weight="600" fill={accent}>
        {vibeMode==='friendly'?'Friendly':'Competitive'}
      </text>
      <text x="44" y="86" text-anchor="middle" font-size="4.5" fill="#9ca3af">match vibe</text>
      <circle cx="44" cy="100" r="3" fill={accent} opacity="0.7"/>
    </g>

    <!-- Arrow 1 -->
    <g style="opacity:{phase>=2?.5:0};transition:opacity .3s">
      <line x1="82" y1="80" x2="112" y2="80" stroke={accent} stroke-width="1.5" stroke-dasharray="3 2"/>
      <polygon points="112,76 119,80 112,84" fill={accent}/>
    </g>

    <!-- Edges -->
    {#each edges as edge (edge.fromId + edge.toId)}
      {@const from = playerMap[edge.fromId]}
      {@const to   = playerMap[edge.toId]}
      {@const mx   = (from.x + to.x) / 2}
      {@const my   = (from.y + to.y) / 2}
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={accent} stroke-dasharray="3 2"
        style="opacity:{edgeOpFn(phase, edge)};stroke-width:{edgeSW(edge)};transition:opacity .5s,stroke-width .5s"
      />
      {#if edge.label}
        <g style="opacity:{edgeLabelOpFn(phase, edge)};transition:opacity .4s .15s">
          <rect x={mx-18} y={my-6} width="36" height="10" rx="4" fill={accent} opacity="0.15"/>
          <text x={mx} y={my+2} text-anchor="middle" font-size="4.5" font-weight="600" fill={accent}>{edge.label}</text>
        </g>
      {/if}
    {/each}

    <!-- Nodes -->
    {#each ALL_PLAYERS as node, i}
      {@const r = node.id === 'you' ? 12 : 10}
      {@const sc = nodeScaleFn(phase)}
      {@const dl = nodeDelayFn(phase, i)}
      <g style="transform:translate({node.x}px,{node.y}px);opacity:{nodeOp(phase, squadIds, node.id)};transition:opacity .45s {dl}">
        <g style="transform:scale({sc});transform-origin:0 0;transition:transform .45s {dl} cubic-bezier(.175,.885,.32,1.275)">
          {#if node.vibe === 'dual'}
            <path d={leftHalf(r)}  fill={EMERALD}/>
            <path d={rightHalf(r)} fill={AMBER}/>
            <circle r={r} fill="none" stroke="#fff" stroke-width="1" opacity="0.3"/>
          {:else}
            <circle r={r} fill={nodeColor(node.vibe)} stroke={nodeStroke(node.vibe)} stroke-width="1.5"/>
          {/if}
          <text y="1"  text-anchor="middle" font-size={node.id==='you'?'5.5':'5'} font-weight="700" fill="white" dominant-baseline="middle">{node.label}</text>
          <text y="8.5" text-anchor="middle" font-size="4" font-weight="600" fill="rgba(255,255,255,.75)">{node.rating}</text>
        </g>
      </g>
    {/each}

    <!-- Squad found label -->
    <text x="182" y="78" text-anchor="middle" font-size="6" font-weight="700" fill={accent}
      style="opacity:{phase>=3?1:0};transition:opacity .4s .45s">
      Squad found ✓
    </text>

    <!-- Arrow 2 -->
    <g style="opacity:{phase>=4?.5:0};transition:opacity .3s">
      <line x1="250" y1="80" x2="265" y2="80" stroke={accent} stroke-width="1.5" stroke-dasharray="3 2"/>
      <polygon points="265,76 272,80 265,84" fill={accent}/>
    </g>

    <!-- Booking card -->
    <g style="opacity:{phase>=4?1:0};transition:opacity .5s">
      <rect x="270" y="18" width="82" height="94" rx="8"
        fill="var(--color-bg-surface,#111)" stroke={accent} stroke-width="1.5"/>
      <rect x="270" y="18" width="82" height="20" rx="8" fill={accent}/>
      <rect x="270" y="30" width="82" height="8"  fill={accent}/>
      <text x="311" y="31" text-anchor="middle" font-size="6.5" font-weight="700" fill="white">{booking.title}</text>
      <text x="311" y="50" text-anchor="middle" font-size="5.5" font-weight="600" fill={accentDark}>{booking.time}</text>
      <text x="311" y="61" text-anchor="middle" font-size="5"   fill="#9ca3af">{booking.venue}</text>
      <line x1="278" y1="67" x2="344" y2="67" stroke="rgba(255,255,255,.1)" stroke-width="0.75"/>
      {#each SQUAD_IDS[vibeMode] as id, i}
        {@const p = playerMap[id]}
        {#if p}
          <circle cx="283" cy={76+i*9} r="2.5" fill={accent}/>
          <text x="289" y={79+i*9} font-size="4.8" fill="#e5e7eb" font-weight="500">{p.label}</text>
        {/if}
      {/each}
      <!-- Check badge -->
      <g style="transform:translate(344px,18px)">
        <g style="transform:scale({phase>=4?1:0.01});transform-origin:0 0;transition:transform .4s .3s cubic-bezier(.175,.885,.32,1.275)">
          <circle r="9" fill={accentDark}/>
          <text y="3.5" text-anchor="middle" font-size="10" fill="white" dominant-baseline="middle">✓</text>
        </g>
      </g>
    </g>

  </svg>

  <!-- Controls -->
  <div class="step-controls">
    <button class="ctrl-btn" on:click={stepBack} disabled={phase===0} aria-label="Previous step">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="steps-row">
      {#each STEP_LABELS as label, i}
        {@const active = i === activeStep}
        <button class="step-item" on:click={() => goToStep(i)} title={label}>
          <span class="step-dot" style={active?`background:${accent};transform:scale(1.35)`:''}></span>
          <span class="step-label" style={active?`color:${accent}`:''}>{label}</span>
        </button>
      {/each}
    </div>
    <button class="ctrl-btn" on:click={stepForward} disabled={phase===4} aria-label="Next step">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <button class="ctrl-btn"
      on:click={() => { if(isPlaying) pause(); else if(phase===4) reset(true); else play(); }}
      aria-label={isPlaying?'Pause':phase===4?'Replay':'Play'}
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

  {#if phase >= 4}
    <p class="tagline">{booking.tagline}</p>
  {:else}
    <p class="tagline tagline--hidden" aria-hidden="true">&nbsp;</p>
  {/if}

</div>

<style>
  .padel-flow {
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-bg-hover);
    padding: 0.875rem;
    width: 100%;
    box-sizing: border-box;
  }

  .flow-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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
    background: var(--color-bg-surface);
    border-radius: 999px;
    padding: 2px;
    gap: 2px;
  }

  .vibe-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    line-height: 1.4;
  }

  .flow-svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  .step-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
    margin-top: 0.25rem;
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
  .ctrl-btn:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-bg-surface); }
  .ctrl-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  .steps-row { display: flex; align-items: center; gap: 1rem; }

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

  .tagline--hidden {
    animation: none;
    visibility: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>

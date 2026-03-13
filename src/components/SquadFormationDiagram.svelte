<script lang="ts">
  let mode: 'friendly' | 'competitive' = 'friendly';
  let squadGoal: 'social' | 'levelup' = 'social';
  let squadFound = false;
  let animating = false;

  const allPlayers = [
    { name: 'Sam',    level: 3.4, vibeScore: 94, wouldPlayAgain: true },
    { name: 'Jordan', level: 3.6, vibeScore: 91, wouldPlayAgain: true },
    { name: 'Alex',   level: 3.8, vibeScore: 87, wouldPlayAgain: false },
    { name: 'Mia',    level: 4.2, vibeScore: 72, wouldPlayAgain: true },
    { name: 'Leo',    level: 4.0, vibeScore: 68, wouldPlayAgain: false },
  ];

  function getSquad() {
    if (squadGoal === 'social') {
      return allPlayers.filter(p => p.wouldPlayAgain).slice(0, 3);
    } else {
      return [...allPlayers].sort((a, b) => b.level - a.level).slice(0, 3);
    }
  }

  function findSquad() {
    if (animating) return;
    animating = true;
    squadFound = false;
    setTimeout(() => {
      squadFound = true;
      animating = false;
    }, 900);
  }

  $: squad = getSquad();
  $: userLevel = mode === 'friendly' ? 3.5 : 3.5;
</script>

<div class="squad-diagram" on:click|stopPropagation role="presentation">
  <div class="diagram-header">
    <span class="diagram-label">How it works</span>
    <div class="mode-toggle" role="group" aria-label="Match vibe">
      <button
        class="toggle-btn"
        class:active={mode === 'friendly'}
        on:click={() => { mode = 'friendly'; squadFound = false; }}
      >Friendly</button>
      <button
        class="toggle-btn"
        class:active={mode === 'competitive'}
        on:click={() => { mode = 'competitive'; squadFound = false; }}
      >Competitive</button>
    </div>
  </div>

  <div class="goal-toggle" role="group" aria-label="Squad goal">
    <button
      class="goal-btn"
      class:active={squadGoal === 'social'}
      on:click={() => { squadGoal = 'social'; squadFound = false; }}
    >
      <span class="goal-icon">🤝</span> Social Vibe
    </button>
    <button
      class="goal-btn"
      class:active={squadGoal === 'levelup'}
      on:click={() => { squadGoal = 'levelup'; squadFound = false; }}
    >
      <span class="goal-icon">🎯</span> Level Up
    </button>
  </div>

  <div class="player-pool">
    <div class="you-card">
      <span class="player-name">You</span>
      <span class="player-level">{userLevel}</span>
    </div>
    <div class="candidates">
      {#each allPlayers as player}
        {@const inSquad = squad.some(s => s.name === player.name)}
        <div class="candidate" class:in-squad={inSquad && squadFound} class:faded={!inSquad && squadFound}>
          <span class="candidate-name">{player.name}</span>
          <span class="candidate-level">{player.level}</span>
          {#if squadGoal === 'social'}
            <span class="candidate-vibe vibe-{Math.round(player.vibeScore / 10) * 10}">{player.vibeScore}%</span>
          {:else}
            <span class="candidate-vibe level-tag">+{(player.level - 3.5).toFixed(1)}</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <button class="find-btn" on:click={findSquad} disabled={animating}>
    {#if animating}
      <span class="spinner"></span> Matching…
    {:else if squadFound}
      ✓ Re-match Squad
    {:else}
      Find My Squad
    {/if}
  </button>

  {#if squadFound}
    <div class="squad-result">
      <div class="squad-badge">Squad found ✓</div>
      <div class="squad-info">
        <span class="match-type">{squadGoal === 'social' ? 'Social Doubles' : 'Stretch Match'}</span>
        <span class="match-detail">Saturday 10:00am · Padel Club Central</span>
      </div>
      <div class="squad-players">
        <div class="squad-you">You <span class="squad-level">{userLevel}</span></div>
        {#each squad as p}
          <div class="squad-player">{p.name} <span class="squad-level">{p.level}</span></div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="steps">
    <div class="step" class:active-step={!squadFound && !animating}>
      <span class="step-num">1</span>
      <span>Set your vibe</span>
    </div>
    <div class="step-arrow">→</div>
    <div class="step" class:active-step={animating}>
      <span class="step-num">2</span>
      <span>AI finds squad</span>
    </div>
    <div class="step-arrow">→</div>
    <div class="step" class:active-step={squadFound}>
      <span class="step-num">3</span>
      <span>Court booked</span>
    </div>
  </div>
</div>

<style>
  .squad-diagram {
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1rem;
    margin-top: 1rem;
    user-select: none;
  }

  .diagram-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .diagram-label {
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
  }

  .mode-toggle {
    display: flex;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .toggle-btn {
    font-size: 11px;
    padding: 0.2rem 0.6rem;
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-btn.active {
    background: var(--color-accent);
    color: var(--color-bg-primary);
  }

  .goal-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .goal-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    font-size: 11px;
    padding: 0.35rem 0.5rem;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .goal-btn.active {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-accent-glow);
  }

  .goal-icon {
    font-size: 12px;
  }

  .player-pool {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .you-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--color-accent);
    color: var(--color-bg-primary);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.5rem;
    min-width: 44px;
    font-size: 11px;
    font-weight: 700;
    gap: 0.1rem;
    flex-shrink: 0;
    align-self: center;
  }

  .player-name {
    font-weight: 700;
  }

  .player-level {
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .candidates {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    flex: 1;
  }

  .candidate {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0.3rem 0.45rem;
    min-width: 46px;
    font-size: 11px;
    gap: 0.1rem;
    transition: all 0.35s ease;
  }

  .candidate.in-squad {
    border-color: var(--color-accent);
    background: var(--color-accent-glow);
    box-shadow: 0 0 8px var(--color-accent-glow);
  }

  .candidate.faded {
    opacity: 0.35;
  }

  .candidate-name {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .candidate-level {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-muted);
  }

  .candidate-vibe {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
  }

  .vibe-90, .vibe-100 {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.12);
  }
  .vibe-80 {
    color: #86efac;
    background: rgba(134, 239, 172, 0.1);
  }
  .vibe-70, .vibe-60 {
    color: var(--color-text-muted);
    background: var(--color-bg-hover);
  }

  .level-tag {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.12);
  }

  .find-btn {
    width: 100%;
    padding: 0.5rem;
    background: var(--color-accent);
    color: var(--color-bg-primary);
    border: none;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }

  .find-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .find-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: var(--color-bg-primary);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .squad-result {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-sm);
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.75rem;
    animation: popIn 0.3s ease;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .squad-badge {
    font-size: 11px;
    font-weight: 700;
    color: #4ade80;
    margin-bottom: 0.3rem;
    letter-spacing: 0.02em;
  }

  .squad-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    margin-bottom: 0.4rem;
  }

  .match-type {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .match-detail {
    font-size: 10px;
    color: var(--color-text-muted);
  }

  .squad-players {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .squad-you, .squad-player {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 11px;
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0.2rem 0.4rem;
    color: var(--color-text-secondary);
  }

  .squad-you {
    border-color: var(--color-accent);
    color: var(--color-accent);
    font-weight: 700;
  }

  .squad-level {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-text-muted);
  }

  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 10px;
    color: var(--color-text-muted);
    transition: color 0.3s ease;
  }

  .step.active-step {
    color: var(--color-accent);
  }

  .step-num {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .step.active-step .step-num {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-bg-primary);
  }

  .step-arrow {
    font-size: 10px;
    color: var(--color-border);
  }
</style>

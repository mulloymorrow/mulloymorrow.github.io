<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Mirrors PadelMobileDiscoverDemo from firebase-chat: a vertical-snap
  // discovery feed showing the 5 panel kinds (profile/match/clinic/tournament/
  // party). Auto-scrolls through the panels on first viewport entry then hands
  // control over to the user. Audio anthem playback is intentionally omitted
  // for a static portfolio embed.

  type PanelKind = 'profile' | 'match' | 'clinic' | 'tournament' | 'party';

  interface BasePanel {
    id: string;
    kind: PanelKind;
    bg: string;
    label: string;     // kind label rendered in the top-right pill
  }

  interface ProfilePanel extends BasePanel {
    kind: 'profile';
    name: string;
    initials: string;
    accent: string;
    level: string;
    values: string[];
    anthemTitle: string;
    anthemArtist: string;
    photoBg: string;
  }

  interface MatchPanel extends BasePanel {
    kind: 'match';
    court: string;
    dateLabel: string;
    timeLabel: string;
    spotsLeft: number;
    levelRange: string;
    players: { initials: string; color: string }[];
  }

  interface ClinicPanel extends BasePanel {
    kind: 'clinic';
    name: string;
    coach: string;
    dateLabel: string;
    spotsLeft: number;
    price: string;
    levelRange: string;
  }

  interface TournamentPanel extends BasePanel {
    kind: 'tournament';
    name: string;
    court: string;
    dateLabel: string;
    format: string;
    entry: string;
    levelRange: string;
  }

  interface PartyPanel extends BasePanel {
    kind: 'party';
    name: string;
    venue: string;
    dateLabel: string;
    going: number;
    avatars: { initials: string; color: string }[];
  }

  type Panel = ProfilePanel | MatchPanel | ClinicPanel | TournamentPanel | PartyPanel;

  // Nalya brand colors (mirrors src/lib/branding/nalya-tokens.ts in firebase-chat)
  const C = {
    coral:    '#E88B8B',
    coralDeep:'#D47A7A',
    sand:     '#D4A574',
    teal:     '#6ABAB6',
    tealDeep: '#3D8F8C',
    pink:     '#F67280',
    purple:   '#8B5CF6',
    stone900: '#1E1712',
  };

  const PANELS: Panel[] = [
    {
      id: 'profile-riley',
      kind: 'profile',
      bg: `linear-gradient(160deg, ${C.coral} 0%, ${C.sand} 60%, ${C.stone900} 100%)`,
      label: 'Player',
      name: 'Riley',
      initials: 'R',
      accent: C.coral,
      level: '3.6',
      values: ['Joy', 'Spontaneity', 'Honesty'],
      anthemTitle: 'Boys of Summer',
      anthemArtist: 'Don Henley',
      photoBg: `linear-gradient(135deg, ${C.coral}, ${C.coralDeep})`,
    },
    {
      id: 'match-sb',
      kind: 'match',
      bg: `linear-gradient(160deg, ${C.tealDeep} 0%, ${C.teal} 60%, ${C.stone900} 100%)`,
      label: 'Match',
      court: 'South Beach Padel Club',
      dateLabel: 'Sat · May 10',
      timeLabel: '2:00 PM',
      spotsLeft: 2,
      levelRange: '3.0 – 4.0',
      players: [
        { initials: 'JD', color: C.teal },
        { initials: 'SM', color: C.sand },
      ],
    },
    {
      id: 'clinic-doubles',
      kind: 'clinic',
      bg: `linear-gradient(160deg, ${C.sand} 0%, ${C.coralDeep} 45%, ${C.stone900} 100%)`,
      label: 'Clinic',
      name: 'Doubles Tactics Masterclass',
      coach: 'Coach Marco',
      dateLabel: 'Sat · 10 AM',
      spotsLeft: 2,
      price: '$35',
      levelRange: '2.5 – 4.0',
    },
    {
      id: 'tournament-brickell',
      kind: 'tournament',
      bg: `linear-gradient(160deg, ${C.tealDeep} 0%, ${C.sand} 60%, ${C.stone900} 100%)`,
      label: 'Tournament',
      name: 'Brickell Open',
      court: 'Brickell Padel Club',
      dateLabel: 'Sun · May 11',
      format: 'Mixed Doubles',
      entry: '$40',
      levelRange: '3.0 – 4.5',
    },
    {
      id: 'party-sb',
      kind: 'party',
      bg: `linear-gradient(160deg, ${C.pink} 0%, ${C.coral} 45%, ${C.stone900} 100%)`,
      label: 'Social',
      name: 'South Beach Padel Social',
      venue: 'Flamingo Park Courts',
      dateLabel: 'Fri · 7 PM',
      going: 18,
      avatars: [
        { initials: 'JD', color: C.teal },
        { initials: 'RM', color: C.sand },
        { initials: 'KC', color: C.coral },
        { initials: 'AL', color: C.coralDeep },
      ],
    },
  ];

  const PANEL_DURATION = 2600; // ms — matches firebase-chat PadelMobileDiscoverDemo

  let containerEl: HTMLDivElement;
  let scrollEl:    HTMLDivElement;
  let activeIndex = 0;
  let phase: 'idle' | 'auto' | 'interactive' = 'idle';
  let observer: IntersectionObserver | null = null;
  let hasStarted = false;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let scrollHandler: (() => void) | null = null;
  let gen = 0;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function startAuto() {
    if (phase !== 'idle') return;
    phase = 'auto';
    const g = ++gen;
    for (let i = 1; i < PANELS.length; i++) {
      timers.push(setTimeout(() => {
        if (g !== gen || !scrollEl) return;
        scrollEl.scrollTo({ top: i * scrollEl.clientHeight, behavior: 'smooth' });
      }, i * PANEL_DURATION));
    }
    timers.push(setTimeout(() => {
      if (g !== gen) return;
      phase = 'interactive';
    }, PANELS.length * PANEL_DURATION));
  }

  function restart() {
    clearTimers();
    phase = 'idle';
    activeIndex = 0;
    if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => startAuto(), 250);
  }

  onMount(() => {
    if (scrollEl) {
      scrollHandler = () => {
        const h = scrollEl.clientHeight;
        if (h === 0) return;
        const idx = Math.round(scrollEl.scrollTop / h);
        activeIndex = Math.max(0, Math.min(idx, PANELS.length - 1));
      };
      scrollEl.addEventListener('scroll', scrollHandler, { passive: true });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !hasStarted) {
          hasStarted = true;
          startAuto();
        }
      }, { rootMargin: '-40px' });
      if (containerEl) observer.observe(containerEl);
    } else {
      hasStarted = true;
      startAuto();
    }
  });

  onDestroy(() => {
    clearTimers();
    observer?.disconnect();
    if (scrollHandler && scrollEl) scrollEl.removeEventListener('scroll', scrollHandler);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class="discover-phone"
  on:click|stopPropagation
  on:keydown|stopPropagation
>
  <!-- Header -->
  <div class="discover-topbar">
    <span class="topbar-title">Discover</span>
    <span class="topbar-city">Miami</span>
    <span class="topbar-filter" aria-hidden>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 4h18M6 8h12M9 12h6"/>
      </svg>
    </span>
  </div>

  <!-- Snap feed -->
  <div class="discover-feed-wrap">
    <div bind:this={scrollEl} class="discover-feed">
      {#each PANELS as panel (panel.id)}
        <div class="panel" style:background={panel.bg}>
          <!-- Decorative court lines -->
          <svg class="court-lines" viewBox="0 0 200 380" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <rect x="20" y="40" width="160" height="300" stroke="white" stroke-width="1.5" rx="2" />
            <line x1="20" y1="190" x2="180" y2="190" stroke="white" stroke-width="1.5" />
            <line x1="100" y1="40" x2="100" y2="190" stroke="white" stroke-width="0.8" />
            <line x1="55" y1="190" x2="55" y2="340" stroke="white" stroke-width="0.8" />
            <line x1="145" y1="190" x2="145" y2="340" stroke="white" stroke-width="0.8" />
            <circle cx="100" cy="190" r="12" stroke="white" stroke-width="1" />
          </svg>

          <!-- Kind badge -->
          <span class="kind-badge" style:--badge-color={panel.kind === 'profile' || panel.kind === 'match' ? C.teal : panel.kind === 'tournament' ? C.tealDeep : panel.kind === 'clinic' ? C.sand : C.coral}>
            {panel.label}
          </span>

          {#if panel.kind === 'profile'}
            <div class="profile-stack">
              <div class="profile-card">
                <div class="profile-photo" style:background={panel.photoBg}>
                  <span class="profile-initials">{panel.initials}</span>
                  <span class="profile-level">{panel.level}</span>
                </div>
                <div class="profile-name">{panel.name}</div>
                <div class="anthem">
                  <span class="anthem-icon" aria-hidden>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/></svg>
                  </span>
                  <span class="anthem-title">{panel.anthemTitle}</span>
                  <span class="anthem-artist">{panel.anthemArtist}</span>
                </div>
                <div class="values">
                  {#each panel.values as v}
                    <span class="value-chip">{v}</span>
                  {/each}
                </div>
              </div>
              <div class="profile-cta-row">
                <button class="cta cta--ghost" type="button">Chat</button>
                <button class="cta cta--solid" type="button" style:background={C.tealDeep}>Play</button>
              </div>
            </div>
          {:else}
            <div class="overlay-card">
              {#if panel.kind === 'match'}
                <div class="row-badges">
                  <span class="mini-icon" style:background="{C.teal}30" style:color={C.teal} aria-hidden>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1"/><path d="M3 3l1 1"/><circle cx="6.5" cy="6.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/></svg>
                  </span>
                  <span class="mini-label" style:color={C.teal}>Open Match</span>
                  <span class="spots-pill" class:hot={panel.spotsLeft === 1}>{panel.spotsLeft} {panel.spotsLeft === 1 ? 'spot' : 'spots'} left</span>
                </div>
                <div class="title">{panel.court}</div>
                <div class="meta-row">
                  <span class="meta-item"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{panel.dateLabel}</span>
                  <span class="meta-item">{panel.timeLabel}</span>
                  <span class="meta-level">{panel.levelRange}</span>
                </div>
                <div class="player-row">
                  {#each panel.players as p}
                    <span class="mini-avatar" style:background={p.color}>{p.initials}</span>
                  {/each}
                  <span class="open-spots">+{4 - panel.players.length} open</span>
                </div>
                <button type="button" class="cta cta--solid" style:background={C.tealDeep}>Play</button>
              {:else if panel.kind === 'clinic'}
                <div class="row-badges">
                  <span class="mini-icon" style:background="{C.sand}30" style:color={C.sand} aria-hidden>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  <span class="mini-label" style:color={C.sand}>Clinic</span>
                  <span class="spots-pill">{panel.spotsLeft} spots left</span>
                </div>
                <div class="title">{panel.name}</div>
                <div class="subtitle">Coach: {panel.coach}</div>
                <div class="meta-row">
                  <span class="meta-item">{panel.dateLabel}</span>
                  <span class="meta-level">{panel.levelRange}</span>
                </div>
                <div class="price-row">
                  <span class="price">{panel.price}</span>
                  <span class="price-sub">per person</span>
                </div>
                <button type="button" class="cta cta--solid" style:background={C.sand}>Reserve</button>
              {:else if panel.kind === 'tournament'}
                <div class="row-badges">
                  <span class="mini-icon" style:background="{C.tealDeep}30" style:color={C.tealDeep} aria-hidden>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  </span>
                  <span class="mini-label" style:color={C.tealDeep}>Tournament</span>
                </div>
                <div class="title">{panel.name}</div>
                <div class="subtitle">{panel.court}</div>
                <div class="meta-row">
                  <span class="meta-item">{panel.dateLabel}</span>
                  <span class="meta-level">{panel.levelRange}</span>
                </div>
                <div class="kv-row">
                  <div><span class="kv-label">Format</span><span class="kv-value">{panel.format}</span></div>
                  <div><span class="kv-label">Entry</span><span class="kv-value strong">{panel.entry}</span></div>
                </div>
                <button type="button" class="cta cta--solid" style:background={C.tealDeep}>Register</button>
              {:else if panel.kind === 'party'}
                <div class="row-badges">
                  <span class="mini-icon" style:background="{C.coral}30" style:color={C.coral} aria-hidden>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M22 2 17 7l3 3 5-5z"/></svg>
                  </span>
                  <span class="mini-label" style:color={C.coral}>Social Event</span>
                  <span class="going-pill">{panel.going} going</span>
                </div>
                <div class="title">{panel.name}</div>
                <div class="subtitle">{panel.venue}</div>
                <div class="meta-row"><span class="meta-item">{panel.dateLabel}</span></div>
                <div class="avatar-stack">
                  {#each panel.avatars as a, i}
                    <span class="stacked-avatar" style:background={a.color} style:z-index={panel.avatars.length - i}>{a.initials}</span>
                  {/each}
                  <span class="more-going">+{panel.going - panel.avatars.length}</span>
                </div>
                <button type="button" class="cta cta--solid" style:background={C.coral}>RSVP</button>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Story progress pills -->
    <div class="progress-pills">
      {#each PANELS as _, i}
        <span class="pill">
          <span
            class="pill-fill"
            class:past={i < activeIndex}
            class:current={i === activeIndex && phase === 'auto'}
            style:--fill-duration="{PANEL_DURATION}ms"
          ></span>
        </span>
      {/each}
    </div>

    <!-- Live-feed indicator (auto phase) / swipe hint (interactive phase) -->
    {#if phase === 'auto'}
      <div class="live-indicator">
        <span class="live-dot" style:background={C.teal}></span>
        <span>Live feed</span>
      </div>
    {:else if phase === 'interactive'}
      <div class="swipe-hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9l-7 7-7-7"/></svg>
        <span>Swipe &amp; tap to book</span>
      </div>
    {/if}
  </div>

  <!-- Bottom nav strip -->
  <div class="discover-bottom">
    <div class="tab tab-active" style:color={C.teal}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
      <span>Discover</span>
    </div>
    <div class="tab"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>Connect</span></div>
    <div class="tab"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Lumi</span></div>
  </div>

  {#if phase === 'interactive'}
    <button class="replay-fab" type="button" on:click={restart} aria-label="Replay">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/></svg>
      Replay
    </button>
  {/if}
</div>

<style>
  /* ── Phone shell ──────────────────────────────────────── */
  .discover-phone {
    position: relative;
    width: 260px;
    height: 420px;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: #0c0a08;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    flex-shrink: 0;
  }

  /* ── Header ──────────────────────────────────────────── */
  .discover-topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    background: rgba(0,0,0,0.55);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .topbar-title {
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex: 1;
  }

  .topbar-city {
    font-size: 9px;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
  }

  .topbar-filter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
  }

  /* ── Feed wrap ───────────────────────────────────────── */
  .discover-feed-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .discover-feed {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
  }

  .discover-feed::-webkit-scrollbar { display: none; }
  .discover-feed { scrollbar-width: none; }

  /* ── Panel ───────────────────────────────────────────── */
  .panel {
    position: relative;
    width: 100%;
    height: 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    overflow: hidden;
    flex-shrink: 0;
  }

  .court-lines {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.10;
    pointer-events: none;
  }

  /* ── Kind badge top-right ───────────────────────────── */
  .kind-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 8.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fff;
    padding: 3px 7px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--badge-color, #6ABAB6) 60%, transparent);
    background: color-mix(in srgb, var(--badge-color, #6ABAB6) 30%, transparent);
  }

  /* ── Profile panel ───────────────────────────────────── */
  .profile-stack {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px 14px 14px 14px;
  }

  .profile-card {
    width: 100%;
    border-radius: 14px;
    background: rgba(20,15,12,0.55);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .profile-photo {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
  }

  .profile-initials {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .profile-level {
    position: absolute;
    bottom: -3px;
    right: -3px;
    font-size: 9px;
    font-weight: 700;
    color: #1E1712;
    background: #fff;
    padding: 2px 6px;
    border-radius: 999px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.35);
  }

  .profile-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
  }

  .anthem {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 9.5px;
    color: rgba(255,255,255,0.85);
  }

  .anthem-icon { display: flex; color: #6ABAB6; }
  .anthem-title { font-weight: 600; }
  .anthem-artist { color: rgba(255,255,255,0.55); }

  .values {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
  }

  .value-chip {
    font-size: 9px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
  }

  .profile-cta-row {
    display: flex;
    gap: 6px;
    width: 100%;
  }

  /* ── Bottom-anchored frosted overlay card ───────────── */
  .overlay-card {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    padding: 11px;
    border-radius: 14px;
    background: rgba(10,7,5,0.78);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .row-badges {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mini-icon {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
  }

  .mini-icon svg { stroke: currentColor; }

  .mini-label {
    font-size: 8.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .spots-pill,
  .going-pill {
    margin-left: auto;
    font-size: 8.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(74, 222, 128, 0.18);
    color: #6EE7B7;
  }

  .spots-pill.hot {
    background: rgba(251, 146, 60, 0.18);
    color: #FBA98A;
  }

  .going-pill {
    background: rgba(232, 139, 139, 0.18);
    color: #F2B8B8;
  }

  .title {
    font-size: 12.5px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 10px;
    color: rgba(255,255,255,0.65);
    margin-top: -3px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    color: rgba(255,255,255,0.7);
  }

  .meta-item svg { color: rgba(255,255,255,0.5); }

  .meta-level {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    color: #93C5FD;
  }

  .player-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mini-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8.5px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .open-spots {
    margin-left: 2px;
    font-size: 9.5px;
    color: rgba(255,255,255,0.5);
  }

  .price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .price {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
  }

  .price-sub {
    font-size: 9px;
    color: rgba(255,255,255,0.5);
  }

  .kv-row {
    display: flex;
    gap: 14px;
  }

  .kv-row > div {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .kv-label {
    font-size: 8.5px;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .kv-value {
    font-size: 10.5px;
    color: #fff;
    font-weight: 500;
  }

  .kv-value.strong { font-weight: 700; }

  .avatar-stack {
    display: flex;
    align-items: center;
  }

  .stacked-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #1E1712;
    margin-left: -7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8.5px;
    font-weight: 700;
    color: #fff;
  }

  .stacked-avatar:first-child { margin-left: 0; }

  .more-going {
    margin-left: 6px;
    font-size: 9.5px;
    color: rgba(255,255,255,0.55);
  }

  /* ── CTA buttons ─────────────────────────────────────── */
  .cta {
    flex: 1;
    height: 32px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.01em;
  }

  .cta--ghost {
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .cta--solid { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

  .cta:hover { opacity: 0.9; }
  .cta:active { transform: translateY(1px); }

  /* ── Story progress pills ────────────────────────────── */
  .progress-pills {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 5;
    pointer-events: none;
  }

  .pill {
    width: 3px;
    height: 18px;
    border-radius: 999px;
    background: rgba(255,255,255,0.25);
    overflow: hidden;
    display: block;
  }

  .pill-fill {
    display: block;
    width: 100%;
    height: 0%;
    background: #fff;
    border-radius: 999px;
    transform-origin: top;
  }

  .pill-fill.past { height: 100%; }
  .pill-fill.current {
    height: 100%;
    animation: fillPill var(--fill-duration, 2600ms) linear forwards;
  }

  @keyframes fillPill {
    from { height: 0%; }
    to   { height: 100%; }
  }

  /* ── Live indicator / swipe hint ─────────────────────── */
  .live-indicator,
  .swipe-hint {
    position: absolute;
    left: 10px;
    top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    font-size: 9px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    pointer-events: none;
    z-index: 5;
  }

  .live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    animation: livePulse 1.2s ease-in-out infinite;
  }

  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .swipe-hint {
    left: 50%;
    top: auto;
    bottom: 14px;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.7);
  }

  /* ── Bottom nav strip ────────────────────────────────── */
  .discover-bottom {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 7px 8px 8px;
    background: rgba(0,0,0,0.7);
    border-top: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    color: rgba(255,255,255,0.4);
    font-size: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .tab svg { color: currentColor; }

  /* ── Replay FAB ──────────────────────────────────────── */
  .replay-fab {
    position: absolute;
    right: 8px;
    bottom: 50px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(0,0,0,0.55);
    color: rgba(255,255,255,0.85);
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
    z-index: 6;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  .replay-fab:hover { color: #6ABAB6; border-color: rgba(106,186,182,0.4); }

  /* ── Theme-warm overrides ────────────────────────────── */
  :global(html.theme-warm) .discover-phone {
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  }
</style>

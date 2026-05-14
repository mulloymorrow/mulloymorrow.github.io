<script lang="ts">
  import LumiMessagingDemo from './LumiMessagingDemo.svelte';
  import LumiDiscoverDemo from './LumiDiscoverDemo.svelte';

  // Mirrors the sliding-pill tab toggle used on /play-with-lumi in firebase-chat:
  //   Play     → Lumi SMS coordination demo
  //   Discover → vertical-snap padel discover feed

  type Tab = 'play' | 'discover';

  export let initialTab: Tab = 'play';
  export let intro: string | null = "Two surfaces, one loop: Discover finds your people; Lumi makes the match happen.";

  let activeTab: Tab = initialTab;
  // Track the highest-rendered tab so each demo only mounts once we've seen it
  // (preserves their internal "play once on view" autoplay state when switching).
  let mountedTabs: Set<Tab> = new Set([initialTab]);

  function setTab(tab: Tab) {
    if (tab === activeTab) return;
    activeTab = tab;
    if (!mountedTabs.has(tab)) {
      mountedTabs = new Set([...mountedTabs, tab]);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="demo-tabs" on:click|stopPropagation on:keydown|stopPropagation>
  {#if intro}
    <div class="demo-intro">
      <img src="/logos/lumi-logo.svg" alt="Lumi" class="demo-intro__avatar" />
      <span class="demo-intro__name">Lumi</span>
      <span class="demo-intro__badge">AI Agent</span>
      <p class="demo-intro__text">{intro}</p>
    </div>
  {/if}

  <div class="tab-toggle" role="tablist" aria-label="Demo selector">
    <span class="tab-pill" class:right={activeTab === 'discover'} aria-hidden></span>
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'play'}
      class="tab-btn"
      class:active={activeTab === 'play'}
      on:click={() => setTab('play')}
    >Play</button>
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'discover'}
      class="tab-btn"
      class:active={activeTab === 'discover'}
      on:click={() => setTab('discover')}
    >Discover</button>
  </div>

  <div class="demo-stage">
    <!-- Mount-on-first-view, then show/hide via display so each demo's
         IntersectionObserver autoplay fires exactly once when it first enters
         the visible tab (matches firebase-chat behavior). -->
    {#if mountedTabs.has('play')}
      <div class="demo-slot" class:hidden={activeTab !== 'play'}>
        <LumiMessagingDemo />
      </div>
    {/if}
    {#if mountedTabs.has('discover')}
      <div class="demo-slot" class:hidden={activeTab !== 'discover'}>
        <LumiDiscoverDemo />
      </div>
    {/if}
  </div>
</div>

<style>
  .demo-tabs {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* ── Intro card (matches LumiIntroCard styling in TimelineCard) ────────── */
  .demo-intro {
    width: 260px;
    border-radius: 14px;
    border: 1px solid rgba(106, 186, 182, 0.28);
    background: linear-gradient(135deg, rgba(106, 186, 182, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 10px 12px 10px;
    margin-bottom: 8px;
    box-shadow: 0 2px 16px rgba(106, 186, 182, 0.18);
    display: grid;
    grid-template-columns: auto auto auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 7px;
    row-gap: 4px;
    align-items: center;
  }

  .demo-intro__avatar {
    grid-column: 1;
    grid-row: 1;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(106, 186, 182, 0.45);
  }

  .demo-intro__name {
    grid-column: 2;
    grid-row: 1;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1;
  }

  .demo-intro__badge {
    grid-column: 4;
    grid-row: 1;
    justify-self: end;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6ABAB6;
    background: rgba(106, 186, 182, 0.1);
    border: 1px solid rgba(106, 186, 182, 0.3);
    border-radius: 4px;
    padding: 2px 5px;
  }

  .demo-intro__text {
    grid-column: 1 / -1;
    grid-row: 2;
    margin: 2px 0 0;
    font-size: 10.5px;
    color: var(--color-text-muted);
    line-height: 1.55;
  }

  :global(html.theme-warm) .demo-intro {
    border-color: rgba(106, 186, 182, 0.35);
    background: linear-gradient(135deg, rgba(106, 186, 182, 0.09) 0%, rgba(139, 92, 246, 0.06) 100%);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  }

  /* ── Sliding pill toggle ──────────────────────────────────────────────── */
  .tab-toggle {
    position: relative;
    display: flex;
    align-items: center;
    width: 200px;
    padding: 3px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 12px;
    overflow: hidden;
  }

  :global(html.theme-warm) .tab-toggle {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .tab-pill {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: calc(50% - 3px);
    border-radius: 999px;
    background: linear-gradient(135deg, #6ABAB6 0%, #3D8F8C 100%);
    transition: transform 280ms cubic-bezier(0.34, 1.4, 0.6, 1);
    z-index: 0;
    box-shadow: 0 2px 8px rgba(106, 186, 182, 0.35);
  }

  .tab-pill.right {
    transform: translateX(100%);
  }

  .tab-btn {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 6px 0;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--color-text-muted);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 180ms ease;
  }

  .tab-btn.active {
    color: #fff;
  }

  /* ── Stage ─────────────────────────────────────────────────────────────── */
  .demo-stage {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .demo-slot { display: contents; }
  .demo-slot.hidden { display: none; }
</style>

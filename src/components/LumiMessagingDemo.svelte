<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Msg {
    id: string;
    from: 'user' | 'lumi';
    text?: string;
    card?: boolean;
    delayMs: number;
    typingMs?: number;
  }

  const MESSAGES: Msg[] = [
    { id: 'm1', from: 'user',  text: 'Friendly padel Saturday morning 🎾',                            delayMs: 600 },
    { id: 'm2', from: 'lumi',  text: 'Found it! Sat 9:00am · Eastside Courts · Court 2 · $14',        delayMs: 400, typingMs: 1200 },
    { id: 'm3', from: 'lumi',  text: 'Squad: Sam (3.4) + Jordan (3.6) + Alex (3.8) — all free, matched to your vibe.', delayMs: 200, typingMs: 1100 },
    { id: 'm4', from: 'user',  text: 'Book it',                                                       delayMs: 700 },
    { id: 'm5', from: 'lumi',  text: '✓ Done! Court booked, wallet charged $14. Invites sent.',       delayMs: 400, typingMs: 1500 },
    { id: 'm6', from: 'lumi',  card: true,                                                             delayMs: 150, typingMs: 0 },
    { id: 'm7', from: 'lumi',  text: '⏰ Reminder: Padel tomorrow 9am at Eastside Courts. Court 2 — see you there!', delayMs: 1200, typingMs: 900 },
    { id: 'm8', from: 'lumi',  text: 'Match in 1 hr. Jordan & Alex confirmed. Sam is on the way 🎾', delayMs: 800,  typingMs: 900 },
  ];

  let visibleCount = 0;
  let showTyping = false;
  let isDone = false;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let gen = 0;

  let containerEl: HTMLDivElement;
  let scrollEl: HTMLDivElement;
  let observer: IntersectionObserver | null = null;
  let hasStarted = false;

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function scrollToBottom() {
    if (scrollEl) requestAnimationFrame(() => { scrollEl.scrollTop = scrollEl.scrollHeight; });
  }

  function runStep(index: number, g: number) {
    if (g !== gen) return;
    if (index >= MESSAGES.length) { isDone = true; return; }

    const msg = MESSAGES[index];
    const typing = msg.from === 'lumi' && msg.typingMs ? msg.typingMs : 0;

    timers.push(setTimeout(() => {
      if (g !== gen) return;
      if (typing > 0) {
        showTyping = true;
        scrollToBottom();
        timers.push(setTimeout(() => {
          if (g !== gen) return;
          showTyping = false;
          visibleCount = index + 1;
          scrollToBottom();
          runStep(index + 1, g);
        }, typing));
      } else {
        visibleCount = index + 1;
        scrollToBottom();
        runStep(index + 1, g);
      }
    }, msg.delayMs));
  }

  function restart() {
    gen += 1;
    const g = gen;
    clearTimers();
    visibleCount = 0;
    showTyping = false;
    isDone = false;
    timers.push(setTimeout(() => runStep(0, g), 400));
  }

  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !hasStarted) {
          hasStarted = true;
          runStep(0, gen);
        }
      }, { rootMargin: '-40px' });
      if (containerEl) observer.observe(containerEl);
    } else {
      runStep(0, gen);
    }
  });

  onDestroy(() => { clearTimers(); observer?.disconnect(); });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class="lumi-phone"
  on:click|stopPropagation
  on:keydown|stopPropagation
>
  <!-- Phone header -->
  <div class="phone-header">
    <div class="lumi-avatar">L</div>
    <div class="lumi-info">
      <span class="lumi-name">Lumi</span>
      <span class="lumi-sub">AI Activity Agent · via SMS</span>
    </div>
    <div class="lumi-status">
      <span class="status-dot"></span>
      <span class="status-label">Active</span>
    </div>
  </div>

  <!-- Message thread -->
  <div bind:this={scrollEl} class="phone-thread">
    {#if visibleCount === 0 && !showTyping}
      <div class="thread-placeholder">Scroll into view to start</div>
    {/if}

    {#each MESSAGES.slice(0, visibleCount) as msg (msg.id)}
      {#if msg.card}
        <!-- Booking confirmation card -->
        <div class="msg-row msg-row--lumi">
          <div class="lumi-dot">L</div>
          <div class="booking-card">
            <div class="booking-card__header">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Match Confirmed
            </div>
            <div class="booking-card__body">
              <div class="booking-row">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="booking-strong">Saturday 9:00am · Court 2</span>
              </div>
              <div class="booking-row">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Eastside Courts</span>
              </div>
              <div class="booking-row">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>You · Sam · Jordan · Alex</span>
              </div>
              <div class="booking-card__footer">
                <span>Wallet charged</span>
                <span class="booking-price">$14.00</span>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="msg-row msg-row--{msg.from}">
          {#if msg.from === 'lumi'}
            <div class="lumi-dot">L</div>
          {/if}
          <div class="bubble bubble--{msg.from}">{msg.text}</div>
        </div>
      {/if}
    {/each}

    {#if showTyping}
      <div class="msg-row msg-row--lumi">
        <div class="lumi-dot">L</div>
        <div class="bubble bubble--lumi bubble--typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="phone-footer">
    <span class="footer-text">
      {isDone ? 'Booking, reminders, updates — all via SMS.' : 'Booking your match…'}
    </span>
    {#if isDone}
      <button class="replay-btn" on:click={restart}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/></svg>
        Replay
      </button>
    {/if}
  </div>
</div>

{#if isDone}
  <a
    href="https://nalya.ai/for/padel?lumi=from-mulloy-morrow"
    target="_blank"
    rel="noopener noreferrer"
    class="lumi-cta"
    on:click|stopPropagation
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Message Lumi
  </a>
{/if}

<style>
  /* ── Phone shell ─────────────────────────────── */
  .lumi-phone {
    width: 260px;
    height: 420px;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: var(--color-bg-surface, #111);
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    flex-shrink: 0;
  }

  /* ── Header ──────────────────────────────────── */
  .phone-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    flex-shrink: 0;
  }

  .lumi-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #6ABAB6;
    color: #fff;
    font-weight: 900;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lumi-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  .lumi-name {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-primary, #f0f0f0);
    line-height: 1.2;
  }

  .lumi-sub {
    font-size: 9px;
    color: var(--color-text-muted, #888);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lumi-status {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    animation: pulse 2s ease-in-out infinite;
  }

  .status-label {
    font-size: 9px;
    color: #34d399;
    font-weight: 600;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── Message thread ──────────────────────────── */
  .phone-thread {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    scroll-behavior: smooth;
  }

  .phone-thread::-webkit-scrollbar { width: 3px; }
  .phone-thread::-webkit-scrollbar-track { background: transparent; }
  .phone-thread::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .thread-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--color-text-muted, #555);
  }

  /* ── Message rows ────────────────────────────── */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    animation: msgIn 0.22s ease both;
  }

  .msg-row--user {
    flex-direction: row-reverse;
  }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lumi-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(106,186,182,0.2);
    color: #6ABAB6;
    font-weight: 900;
    font-size: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── Bubbles ─────────────────────────────────── */
  .bubble {
    max-width: 78%;
    padding: 7px 11px;
    border-radius: 16px;
    font-size: 11px;
    line-height: 1.45;
    word-break: break-word;
  }

  .bubble--user {
    background: #6ABAB6;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .bubble--lumi {
    background: rgba(255,255,255,0.06);
    color: var(--color-text-secondary, #ccc);
    border: 1px solid rgba(255,255,255,0.08);
    border-bottom-left-radius: 4px;
  }

  /* Typing dots */
  .bubble--typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 9px 13px;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-text-muted, #888);
    animation: bounce 1.1s ease-in-out infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.18s; }
  .dot:nth-child(3) { animation-delay: 0.36s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-4px); opacity: 1; }
  }

  /* ── Booking card ────────────────────────────── */
  .booking-card {
    border-radius: 14px;
    border: 1px solid rgba(106,186,182,0.3);
    background: rgba(20,20,20,0.9);
    overflow: hidden;
    width: 168px;
    animation: msgIn 0.3s ease both;
  }

  .booking-card__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    background: rgba(106,186,182,0.12);
    color: #6ABAB6;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .booking-card__body {
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .booking-row {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: var(--color-text-muted, #aaa);
  }

  .booking-row svg {
    flex-shrink: 0;
    color: rgba(106,186,182,0.7);
  }

  .booking-strong {
    font-weight: 600;
    color: var(--color-text-secondary, #ccc);
  }

  .booking-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 6px;
    margin-top: 2px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 10px;
    color: var(--color-text-muted, #aaa);
  }

  .booking-price {
    font-weight: 700;
    color: #6ABAB6;
  }

  /* ── Footer ──────────────────────────────────── */
  .phone-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    flex-shrink: 0;
    gap: 8px;
  }

  .footer-text {
    font-size: 9px;
    color: var(--color-text-muted, #888);
    flex: 1;
    min-width: 0;
  }

  .replay-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    font-weight: 600;
    color: var(--color-text-muted, #888);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
    flex-shrink: 0;
  }

  .replay-btn:hover {
    color: #6ABAB6;
    background: rgba(106,186,182,0.1);
  }

  /* ── CTA below phone ─────────────────────────── */
  .lumi-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    padding: 8px 16px;
    border-radius: 999px;
    background: #6ABAB6;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.03em;
    transition: background 0.2s, transform 0.15s;
    animation: msgIn 0.3s ease both;
  }

  .lumi-cta:hover {
    background: #5aa9a5;
    transform: translateY(-1px);
  }

  .lumi-cta:active {
    transform: translateY(0);
  }
</style>

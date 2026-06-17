<script lang="ts">
  import { onMount } from 'svelte';

  // 'light' = warm/light theme (theme-warm class), 'dark' = default dark
  let theme = $state<'light' | 'dark'>('dark');
  let mounted = $state(false);

  function applyTheme(t: 'light' | 'dark') {
    const html = document.documentElement;
    if (t === 'light') {
      html.classList.add('theme-warm');
    } else {
      html.classList.remove('theme-warm');
    }
  }

  onMount(() => {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
      // @ts-expect-error - global flag consumed by Layout's scroll script
      window.__themeLocked = true;
    } else {
      // Reflect whatever the scroll-driven script has set on <html>
      theme = document.documentElement.classList.contains('theme-warm') ? 'light' : 'dark';
    }
    applyTheme(theme);
    mounted = true;
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('site-theme', theme);
    // @ts-expect-error - global flag consumed by Layout's scroll script
    window.__themeLocked = true;
    applyTheme(theme);
  }
</script>

<div class="theme-toggle-wrapper" class:mounted>
  <button
    class="theme-toggle"
    type="button"
    onclick={toggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  >
    {#if theme === 'dark'}
      <svg
        class="theme-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
      </svg>
    {:else}
      <svg
        class="theme-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    {/if}
  </button>
</div>

<style>
  .theme-toggle-wrapper {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 1001;
    opacity: 0;
    transform: translateY(-6px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .theme-toggle-wrapper.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: rgba(20, 20, 25, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border, rgba(63, 63, 70, 0.6));
    border-radius: 999px;
    color: var(--color-text-primary, #e4e4e7);
    cursor: pointer;
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease,
      transform 0.2s ease,
      box-shadow 0.25s ease;
  }

  .theme-toggle:hover {
    color: var(--color-accent, #14b8a6);
    border-color: var(--color-accent, #14b8a6);
    box-shadow: 0 0 16px var(--color-accent-glow, rgba(20, 184, 166, 0.2));
    transform: translateY(-1px);
  }

  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-accent, #14b8a6);
    outline-offset: 2px;
  }

  .theme-icon {
    display: block;
  }

  /* Light/warm theme styling for the toggle itself */
  :global(html.theme-warm) .theme-toggle {
    background: rgba(255, 253, 251, 0.85);
    border-color: var(--color-border, #e8e2d9);
    color: var(--color-text-primary, #2d3436);
  }

  :global(html.theme-warm) .theme-toggle:hover {
    color: var(--color-accent, #e07b54);
    border-color: var(--color-accent, #e07b54);
    box-shadow: 0 0 16px var(--color-accent-glow, rgba(224, 123, 84, 0.2));
  }

  @media (max-width: 768px) {
    .theme-toggle-wrapper {
      top: 14px;
      right: 14px;
    }

    .theme-toggle {
      width: 36px;
      height: 36px;
    }
  }
</style>

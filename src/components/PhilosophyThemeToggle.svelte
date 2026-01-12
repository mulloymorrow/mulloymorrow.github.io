<script>
  import { onMount } from 'svelte';
  
  let theme = $state('light');
  let mounted = $state(false);
  
  onMount(() => {
    // Load saved theme from localStorage, default to light
    const saved = localStorage.getItem('philosophy-theme');
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
    } else {
      theme = 'light'; // Default to light theme
    }
    applyTheme(theme);
    mounted = true;
    
    // Cleanup when component unmounts (navigating away)
    return () => {
      document.body?.classList.remove('philosophy-theme-light', 'philosophy-theme-dark');
    };
  });
  
  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('philosophy-theme', theme);
    applyTheme(theme);
  }
  
  function applyTheme(t) {
    // Apply to both the page element and body for footer theming
    const page = document.querySelector('.philosophy-page');
    const body = document.body;
    
    if (t === 'light') {
      page?.classList.add('theme-light');
      page?.classList.remove('theme-dark');
      body?.classList.add('philosophy-theme-light');
      body?.classList.remove('philosophy-theme-dark');
    } else {
      page?.classList.add('theme-dark');
      page?.classList.remove('theme-light');
      body?.classList.add('philosophy-theme-dark');
      body?.classList.remove('philosophy-theme-light');
    }
  }
</script>

<div class="theme-toggle-wrapper" class:mounted>
  <button 
    class="theme-toggle" 
    onclick={toggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  >
    <span class="toggle-track">
      <span class="toggle-icon toggle-icon--sun" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </span>
      <span class="toggle-icon toggle-icon--moon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
      <span class="toggle-thumb" class:light={theme === 'light'}></span>
    </span>
    <span class="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
  </button>
</div>

<style>
  .theme-toggle-wrapper {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 100;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .theme-toggle-wrapper.mounted {
    opacity: 1;
    transform: translateY(0);
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 6px;
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border, rgba(39, 39, 42, 1));
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
    border-color: var(--color-accent, #14b8a6);
    box-shadow: 0 0 20px rgba(20, 184, 166, 0.15);
  }
  
  .toggle-track {
    position: relative;
    width: 52px;
    height: 28px;
    background: var(--color-bg-elevated, #1a1a22);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
  }
  
  .toggle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    z-index: 1;
    transition: color 0.3s ease;
  }
  
  .toggle-icon--sun {
    color: var(--color-text-muted, #71717a);
  }
  
  .toggle-icon--moon {
    color: var(--color-accent, #14b8a6);
  }
  
  .toggle-thumb {
    position: absolute;
    left: 4px;
    width: 20px;
    height: 20px;
    background: var(--color-accent, #14b8a6);
    border-radius: 50%;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-thumb.light {
    transform: translateX(24px);
  }
  
  .toggle-label {
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary, #a1a1aa);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 36px;
  }

  /* Light theme styles when toggle is set to light */
  :global(.philosophy-page.theme-light) {
    --color-bg-primary: #faf7f2;
    --color-bg-secondary: #fff9f0;
    --color-bg-surface: #ffffff;
    --color-bg-elevated: #fffdfb;
    --color-bg-hover: #fef3e2;
    --color-accent: #e07b54;
    --color-accent-dim: #c96a45;
    --color-accent-glow: rgba(224, 123, 84, 0.12);
    --color-text-primary: #2d3436;
    --color-text-secondary: #5a6169;
    --color-text-muted: #8b9198;
    --color-border: #e8e2d9;
    --color-border-hover: #d4cdc2;
    background-color: var(--color-bg-primary);
  }
  
  /* Apply light theme to body for footer and other elements */
  :global(body.philosophy-theme-light) {
    --color-bg-primary: #faf7f2;
    --color-bg-secondary: #fff9f0;
    --color-bg-surface: #ffffff;
    --color-bg-elevated: #fffdfb;
    --color-bg-hover: #fef3e2;
    --color-accent: #e07b54;
    --color-accent-dim: #c96a45;
    --color-accent-glow: rgba(224, 123, 84, 0.12);
    --color-text-primary: #2d3436;
    --color-text-secondary: #5a6169;
    --color-text-muted: #8b9198;
    --color-border: #e8e2d9;
    --color-border-hover: #d4cdc2;
    background-color: var(--color-bg-primary);
    background-image: linear-gradient(135deg, #faf7f2 0%, #fff9f0 50%, #fef6ec 100%);
  }
  
  :global(.philosophy-page.theme-light) .theme-toggle,
  :global(body.philosophy-theme-light) .theme-toggle {
    background: rgba(250, 247, 242, 0.9);
    border-color: #e8e2d9;
  }
  
  :global(.philosophy-page.theme-light) .toggle-track,
  :global(body.philosophy-theme-light) .toggle-track {
    background: #fff9f0;
  }
  
  :global(.philosophy-page.theme-light) .toggle-icon--sun,
  :global(body.philosophy-theme-light) .toggle-icon--sun {
    color: #e07b54;
  }
  
  :global(.philosophy-page.theme-light) .toggle-icon--moon,
  :global(body.philosophy-theme-light) .toggle-icon--moon {
    color: #8b9198;
  }
  
  :global(.philosophy-page.theme-light) .toggle-thumb,
  :global(body.philosophy-theme-light) .toggle-thumb {
    background: #e07b54;
  }
  
  :global(.philosophy-page.theme-light) .toggle-label,
  :global(body.philosophy-theme-light) .toggle-label {
    color: #5a6169;
  }

  /* Ensure primary button text is always white in both themes */
  :global(.philosophy-page .btn--primary),
  :global(.philosophy-page.theme-light .btn--primary),
  :global(.philosophy-page.theme-dark .btn--primary) {
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
  }

  @media (max-width: 768px) {
    .theme-toggle-wrapper {
      top: 16px;
      right: 16px;
    }
    
    .toggle-label {
      display: none;
    }
    
    .theme-toggle {
      padding: 6px;
    }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  
  let expanded = $state(false);
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
    
    // Close on escape key
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        expanded = false;
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
  
  function toggle() {
    expanded = !expanded;
  }
  
  function close() {
    expanded = false;
  }
  
  // Close on click outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (expanded && !target.closest('.nav-floating')) {
      close();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<nav class="nav-floating" class:expanded class:mounted aria-label="Main navigation">
  <button 
    class="nav-trigger" 
    onclick={toggle}
    aria-expanded={expanded}
    aria-controls="nav-menu"
    aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
  >
    <span class="nav-icon" aria-hidden="true">M</span>
  </button>
  
  {#if expanded}
    <div class="nav-menu" id="nav-menu" role="menu">
      <a href="/" class="nav-link" role="menuitem" onclick={close}>
        <span>Home</span>
      </a>
      <a href="/ai-mulloy/" class="nav-link" role="menuitem" onclick={close}>
        <span>ai-Mulloy</span>
      </a>
      <a href="/blog" class="nav-link" role="menuitem" onclick={close}>
        <span>Blog</span>
      </a>
      <a href="/#contact" class="nav-link" role="menuitem" onclick={close}>
        <span>Contact</span>
      </a>
    </div>
  {/if}
</nav>

<style>
  .nav-floating {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0;
    
    /* Glass morphism */
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--color-border, rgba(39, 39, 42, 1));
    border-radius: 28px;
    padding: 4px;
    
    /* Smooth expansion */
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  
  .nav-floating.mounted {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  .nav-floating:hover {
    border-color: var(--color-accent, #14b8a6);
    box-shadow: 0 0 30px rgba(20, 184, 166, 0.2);
  }
  
  .nav-floating.expanded {
    gap: 4px;
  }
  
  .nav-trigger {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 50%;
    background: var(--color-accent-glow, rgba(20, 184, 166, 0.15));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
  
  .nav-trigger:hover {
    background: var(--color-accent, #14b8a6);
    transform: scale(1.05);
  }
  
  .nav-trigger:hover .nav-icon {
    color: white;
  }
  
  .nav-trigger:focus-visible {
    outline: 2px solid var(--color-accent, #14b8a6);
    outline-offset: 2px;
  }
  
  .nav-icon {
    font-family: var(--font-heading, 'Space Grotesk', sans-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-accent, #14b8a6);
    transition: color 0.3s ease;
    line-height: 1;
  }
  
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-right: 8px;
    overflow: hidden;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    color: var(--color-text-secondary, #a1a1aa);
    font-family: var(--font-body, 'Inter', sans-serif);
    font-weight: 500;
    font-size: 0.9rem;
    white-space: nowrap;
    text-decoration: none;
    border-radius: 20px;
    transition: all 0.2s ease;
    
    /* Staggered fade-in animation */
    animation: fadeSlideIn 0.3s ease-out backwards;
  }
  
  .nav-link:nth-child(1) { animation-delay: 0.05s; }
  .nav-link:nth-child(2) { animation-delay: 0.1s; }
  .nav-link:nth-child(3) { animation-delay: 0.15s; }
  .nav-link:nth-child(4) { animation-delay: 0.2s; }
  
  .nav-link:hover {
    color: var(--color-accent, #14b8a6);
    background: var(--color-accent-glow, rgba(20, 184, 166, 0.15));
  }
  
  .nav-link:focus-visible {
    outline: 2px solid var(--color-accent, #14b8a6);
    outline-offset: -2px;
  }
  
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Theme awareness - warm theme */
  :global(.theme-warm) .nav-floating {
    background: rgba(250, 247, 242, 0.9);
    border-color: var(--color-border, #e8e2d9);
  }
  
  :global(.theme-warm) .nav-trigger {
    background: rgba(224, 123, 84, 0.12);
  }
  
  :global(.theme-warm) .nav-trigger:hover {
    background: var(--color-accent, #e07b54);
  }
  
  :global(.theme-warm) .nav-icon {
    color: var(--color-accent, #e07b54);
  }
  
  :global(.theme-warm) .nav-link {
    color: var(--color-text-secondary, #5a6169);
  }
  
  :global(.theme-warm) .nav-link:hover {
    color: var(--color-accent, #e07b54);
    background: rgba(224, 123, 84, 0.12);
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .nav-floating {
      bottom: 16px;
      right: 16px;
    }
    
    .nav-link {
      padding: 8px 12px;
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 480px) {
    .nav-floating.expanded {
      left: 16px;
      right: 16px;
      justify-content: flex-start;
    }
    
    .nav-menu {
      flex: 1;
      justify-content: space-around;
    }
    
    .nav-link span {
      font-size: 0.8rem;
    }
  }
</style>

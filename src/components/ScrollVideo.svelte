<script lang="ts">
  import { onMount } from 'svelte';
  
  export let src: string;
  export let poster: string = '';
  
  let videoElement: HTMLVideoElement;
  
  onMount(() => {
    if (!videoElement) return;
    
    // Autoplay when ready
    const handleCanPlay = () => {
      videoElement.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    };
    
    if (videoElement.readyState >= 3) {
      handleCanPlay();
    } else {
      videoElement.addEventListener('canplay', handleCanPlay);
    }
    
    return () => {
      videoElement?.removeEventListener('canplay', handleCanPlay);
    };
  });
</script>

<div class="video-container">
  <a href="https://pika.art/" target="_blank" rel="noopener noreferrer" class="video-wrapper">
    <video
      bind:this={videoElement}
      {src}
      poster={poster || undefined}
      muted
      playsinline
      loop
      autoplay
      preload="auto"
      class="video-player"
    >
      <track kind="captions" />
    </video>
    <span class="video-link-hint">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      pika.art
    </span>
  </a>
</div>

<style>
  .video-container {
    width: 100%;
    margin: var(--space-8) 0;
    display: flex;
    justify-content: center;
  }
  
  .video-wrapper {
    position: relative;
    display: block;
    max-width: 360px;
    width: 100%;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .video-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
  
  .video-player {
    display: block;
    width: 100%;
    height: auto;
    background: var(--color-bg-elevated);
    pointer-events: none;
  }
  
  .video-link-hint {
    position: absolute;
    bottom: var(--space-3);
    right: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: var(--radius-full);
    color: white;
    font-size: var(--text-xs);
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .video-wrapper:hover .video-link-hint {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    .video-container {
      margin: var(--space-6) 0;
    }
    
    .video-wrapper {
      max-width: 280px;
      border-radius: var(--radius-lg);
    }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  
  export let src: string;
  export let className: string = '';
  export let size: number = 22;
  
  let videoElement: HTMLVideoElement;
  
  onMount(() => {
    if (!videoElement) return;

    // Older iOS Safari needs webkit-playsinline (non-standard attribute)
    videoElement.setAttribute('webkit-playsinline', '');
    
    let isReversing = false;
    let rafId: number;
    const frameTime = 1000 / 30; // 30fps
    let lastFrameTime = 0;
    
    const startReverse = () => {
      if (!videoElement || isReversing) return;
      
      // Guard: Safari can return NaN/Infinity before metadata loads
      const duration = videoElement.duration;
      const currentTime = videoElement.currentTime;
      if (!Number.isFinite(duration) || !Number.isFinite(currentTime)) return;
      
      isReversing = true;
      videoElement.pause();
      lastFrameTime = performance.now();
      
      const tick = (now: number) => {
        if (!videoElement || !isReversing) return;
        
        const elapsed = now - lastFrameTime;
        lastFrameTime = now;
        
        const newTime = videoElement.currentTime - (elapsed / 1000);
        
        if (newTime <= 0) {
          // Reached start, play forward again
          isReversing = false;
          videoElement.currentTime = 0;
          videoElement.play().catch(() => {});
          return;
        }
        
        videoElement.currentTime = newTime;
        rafId = requestAnimationFrame(tick);
      };
      
      rafId = requestAnimationFrame(tick);
    };
    
    // Monitor video time to detect end
    const handleTimeUpdate = () => {
      if (!videoElement || isReversing) return;
      
      const duration = videoElement.duration;
      const currentTime = videoElement.currentTime;
      
      // Safari: guard against NaN/Infinity
      if (!Number.isFinite(duration) || !Number.isFinite(currentTime)) return;
      
      if (currentTime >= duration - 0.1) {
        startReverse();
      }
    };
    
    const handleEnded = () => {
      if (!isReversing) {
        startReverse();
      }
    };
    
    const startPlay = () => {
      if (!videoElement) return;
      // Safari: wait for seekable ranges before play
      if (videoElement.seekable.length > 0 || videoElement.readyState >= 2) {
        videoElement.play().catch(() => {});
      }
    };
    
    const handleLoadedMetadata = () => startPlay();
    const handleCanPlay = () => startPlay();
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('canplay', handleCanPlay);
    
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }
    
    return () => {
      isReversing = false;
      if (rafId) cancelAnimationFrame(rafId);
      videoElement?.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement?.removeEventListener('ended', handleEnded);
      videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement?.removeEventListener('canplay', handleCanPlay);
    };
  });
</script>

<video
  bind:this={videoElement}
  {src}
  muted
  playsinline
  preload="auto"
  class={className}
  style="width: {size}px; height: {size}px; object-fit: cover; display: block; border-radius: 50%; pointer-events: none;"
  tabindex="-1"
  aria-hidden="true"
>
  <track kind="captions" />
</video>

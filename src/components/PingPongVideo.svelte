<script lang="ts">
  import { onMount } from 'svelte';
  
  export let src: string;
  export let className: string = '';
  export let size: number = 22;
  
  let videoElement: HTMLVideoElement;
  
  onMount(() => {
    if (!videoElement) return;
    
    let isReversing = false;
    let intervalId: number;
    const frameTime = 1000 / 30; // 30fps
    
    const startReverse = () => {
      isReversing = true;
      videoElement.pause();
      
      intervalId = window.setInterval(() => {
        if (!videoElement) return;
        
        // Step backward by frame time equivalent
        const newTime = videoElement.currentTime - (frameTime / 1000);
        
        if (newTime <= 0) {
          // Reached start, play forward again
          clearInterval(intervalId);
          videoElement.currentTime = 0;
          isReversing = false;
          videoElement.play().catch(() => {});
        } else {
          videoElement.currentTime = newTime;
        }
      }, frameTime);
    };
    
    // Monitor video time to detect end
    const handleTimeUpdate = () => {
      if (!videoElement || isReversing) return;
      
      // Check if near end (within 100ms)
      if (videoElement.duration && videoElement.currentTime >= videoElement.duration - 0.1) {
        startReverse();
      }
    };
    
    // Also handle the ended event as backup
    const handleEnded = () => {
      if (!isReversing) {
        startReverse();
      }
    };
    
    const handleLoadedMetadata = () => {
      videoElement.play().catch(() => {});
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      videoElement?.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement?.removeEventListener('ended', handleEnded);
      videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
  style="width: {size}px; height: {size}px; object-fit: cover; display: block; border-radius: 50%;"
>
  <track kind="captions" />
</video>

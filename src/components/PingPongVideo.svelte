<script lang="ts">
  import { onMount } from 'svelte';
  
  export let src: string;
  export let className: string = '';
  export let size: number = 22;
  
  let videoElement: HTMLVideoElement;
  let isReversing = false;
  let lastTime = 0;
  let animationId: number;
  
  onMount(() => {
    if (!videoElement) return;
    
    let duration = 0;
    
    const reversePlay = (timestamp: number) => {
      if (!isReversing || !videoElement) return;
      
      // Calculate delta time for smooth 1x speed playback
      const delta = (timestamp - lastTime) / 1000; // Convert to seconds
      lastTime = timestamp;
      
      // Decrement time (1x speed in reverse)
      const newTime = videoElement.currentTime - delta;
      
      if (newTime <= 0) {
        // Reached beginning, play forward
        videoElement.currentTime = 0;
        isReversing = false;
        videoElement.play();
      } else {
        videoElement.currentTime = newTime;
        animationId = requestAnimationFrame(reversePlay);
      }
    };
    
    const handleEnded = () => {
      // Video ended, start reverse playback
      isReversing = true;
      videoElement.pause();
      lastTime = performance.now();
      animationId = requestAnimationFrame(reversePlay);
    };
    
    const handleLoadedMetadata = () => {
      duration = videoElement.duration;
      // Start playing forward
      videoElement.play().catch(() => {});
    };
    
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If already loaded
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }
    
    return () => {
      videoElement?.removeEventListener('ended', handleEnded);
      videoElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationId) cancelAnimationFrame(animationId);
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

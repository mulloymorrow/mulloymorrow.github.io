<script>
  import { onMount, onDestroy } from 'svelte';
  
  let mounted = false;
  let container;
  let mouseX = -500;
  let mouseY = -500;
  let targetX = -500;
  let targetY = -500;
  let blobPath = '';
  let animationFrame;
  let time = 0;
  let isHovering = false;
  
  // Generate organic blob path using noise-like distortion
  function generateBlobPath(cx, cy, baseRadius, t) {
    const points = 12; // More points for smoother organic shape
    const pathPoints = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Multiple sine waves for organic, amoeba-like variation
      const noise1 = Math.sin(angle * 2 + t * 1.2) * 0.18;
      const noise2 = Math.sin(angle * 3 - t * 0.9) * 0.12;
      const noise3 = Math.cos(angle * 4 + t * 0.6) * 0.1;
      const noise4 = Math.sin(angle * 5 - t * 1.5) * 0.06;
      const radiusVariation = 1 + noise1 + noise2 + noise3 + noise4;
      
      const r = baseRadius * radiusVariation;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      pathPoints.push({ x, y });
    }
    
    // Create smooth bezier curve through points
    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    
    for (let i = 0; i < points; i++) {
      const current = pathPoints[i];
      const next = pathPoints[(i + 1) % points];
      const nextNext = pathPoints[(i + 2) % points];
      const prev = pathPoints[(i - 1 + points) % points];
      
      // Calculate control points for smooth curve
      const cp1x = current.x + (next.x - prev.x) * 0.3;
      const cp1y = current.y + (next.y - prev.y) * 0.3;
      const cp2x = next.x - (nextNext.x - current.x) * 0.3;
      const cp2y = next.y - (nextNext.y - current.y) * 0.3;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    path += ' Z';
    return path;
  }
  
  function animate() {
    if (!mounted) return;
    
    time += 0.025;
    
    // Smooth follow with easing - faster when hovering
    const easing = isHovering ? 0.12 : 0.06;
    targetX += (mouseX - targetX) * easing;
    targetY += (mouseY - targetY) * easing;
    
    // Generate morphing blob path - larger radius
    const radius = 220;
    blobPath = generateBlobPath(targetX, targetY, radius, time);
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  function handleMouseMove(e) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovering = true;
  }
  
  function handleMouseLeave() {
    mouseX = -500;
    mouseY = -500;
    isHovering = false;
  }
  
  onMount(() => {
    mounted = true;
    animate();
  });
  
  onDestroy(() => {
    mounted = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<div 
  class="cursor-reveal"
  bind:this={container}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  role="presentation"
>
  <!-- SVG mask with halftone reveal -->
  <svg class="cursor-reveal__svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="blob-clip">
        <path d={blobPath} />
      </clipPath>
      
      <!-- Primary halftone pattern - larger dots -->
      <pattern id="halftone-primary" patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="4" cy="4" r="3" fill="#e76f51" />
      </pattern>
      
      <!-- Secondary halftone - smaller, offset dots -->
      <pattern id="halftone-secondary" patternUnits="userSpaceOnUse" width="6" height="6">
        <circle cx="3" cy="3" r="1.8" fill="#f4a261" />
      </pattern>
      
      <!-- Tertiary accent dots -->
      <pattern id="halftone-accent" patternUnits="userSpaceOnUse" width="12" height="12">
        <circle cx="6" cy="6" r="2" fill="#2a9d8f" />
      </pattern>
      
      <!-- Soft edge blur -->
      <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>
      
      <!-- Noise texture filter for organic feel -->
      <filter id="noise-filter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    
    <!-- The revealed layer with collage texture -->
    <g clip-path="url(#blob-clip)">
      <!-- Base gradient - coral to terracotta -->
      <rect x="0" y="0" width="100%" height="100%" fill="#d95b43" />
      
      <!-- Layered halftone patterns for depth -->
      <rect x="0" y="0" width="100%" height="100%" fill="url(#halftone-primary)" opacity="0.7" />
      <rect x="0" y="0" width="100%" height="100%" fill="url(#halftone-secondary)" opacity="0.5" style="transform: translate(3px, 3px)" />
      <rect x="0" y="0" width="100%" height="100%" fill="url(#halftone-accent)" opacity="0.25" style="transform: translate(-2px, 2px)" />
      
      <!-- Inner radial highlight -->
      <ellipse cx="50%" cy="50%" rx="35%" ry="35%" fill="rgba(255, 220, 180, 0.2)" />
    </g>
    
    <!-- Outer glow for depth -->
    <path 
      d={blobPath} 
      fill="none" 
      stroke="#f4a261"
      stroke-width="4"
      opacity="0.5"
      filter="url(#blob-blur)"
    />
    
    <!-- Crisp edge highlight -->
    <path 
      d={blobPath} 
      fill="none" 
      stroke="rgba(255, 255, 255, 0.25)"
      stroke-width="1.5"
    />
  </svg>
  
  <!-- Content slot -->
  <div class="cursor-reveal__content">
    <slot />
  </div>
</div>

<style>
  .cursor-reveal {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    cursor: crosshair;
  }
  
  .cursor-reveal__svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    /* Performance optimization */
    will-change: contents;
    contain: layout paint;
  }
  
  .cursor-reveal__content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }
  
  /* Ensure links and buttons inside content are clickable */
  .cursor-reveal__content :global(a),
  .cursor-reveal__content :global(button) {
    cursor: pointer;
  }
  
  /* Hide on mobile/touch devices where cursor following doesn't make sense */
  @media (hover: none), (max-width: 768px) {
    .cursor-reveal {
      cursor: auto;
    }
    .cursor-reveal__svg {
      display: none;
    }
  }
</style>


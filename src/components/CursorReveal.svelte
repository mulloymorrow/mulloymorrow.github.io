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
  let mazePath = '';
  let mazeData = { startX: 0, startY: 0, endX: 0, endY: 0, cellSize: 16, cols: 75, rows: 50, startCellX: 0, startCellY: 0, endCellX: 0, endCellY: 0 };
  let mazeGrid = []; // Store grid for pathfinding
  
  // Feature flags from URL parameters
  let revealMaze = false;
  let solveMaze = false;
  
  // BFS solving animation state
  let visitedCells = []; // Cells visited during BFS (for visualization)
  let solutionPath = []; // Final solution path
  let solveAnimationFrame = 0;
  let isSolving = false;
  let solveInterval = null;
  
  // Generate a solvable maze using recursive backtracking
  function generateMaze() {
    const cellSize = 16;
    const cols = 75;
    const rows = 50;
    
    // Seeded random for consistent maze
    let seed = 42;
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    
    // Shuffle array using seeded random
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    
    // Initialize grid - each cell tracks which walls exist
    // walls: top, right, bottom, left
    const grid = [];
    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
        grid[y][x] = {
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true }
        };
      }
    }
    
    // Direction offsets: [dx, dy, wall to remove from current, wall to remove from neighbor]
    const directions = [
      { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
      { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
      { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
      { dx: -1, dy: 0, wall: 'left', opposite: 'right' }
    ];
    
    // Recursive backtracking maze generation (iterative version to avoid stack overflow)
    const stack = [];
    
    // Pick a random edge for the start position
    const edge = Math.floor(random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let startX, startY;
    
    switch (edge) {
      case 0: // Top edge
        startX = Math.floor(random() * cols);
        startY = 0;
        break;
      case 1: // Right edge
        startX = cols - 1;
        startY = Math.floor(random() * rows);
        break;
      case 2: // Bottom edge
        startX = Math.floor(random() * cols);
        startY = rows - 1;
        break;
      case 3: // Left edge
      default:
        startX = 0;
        startY = Math.floor(random() * rows);
        break;
    }
    
    const endX = Math.floor(cols / 2);
    const endY = Math.floor(rows / 2);
    
    let currentX = startX;
    let currentY = startY;
    grid[currentY][currentX].visited = true;
    
    while (true) {
      // Get unvisited neighbors
      const neighbors = [];
      for (const dir of directions) {
        const nx = currentX + dir.dx;
        const ny = currentY + dir.dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !grid[ny][nx].visited) {
          neighbors.push({ x: nx, y: ny, dir });
        }
      }
      
      if (neighbors.length > 0) {
        // Choose random unvisited neighbor
        shuffle(neighbors);
        const next = neighbors[0];
        
        // Push current cell to stack
        stack.push({ x: currentX, y: currentY });
        
        // Remove walls between current and next
        grid[currentY][currentX].walls[next.dir.wall] = false;
        grid[next.y][next.x].walls[next.dir.opposite] = false;
        
        // Move to next cell
        currentX = next.x;
        currentY = next.y;
        grid[currentY][currentX].visited = true;
      } else if (stack.length > 0) {
        // Backtrack
        const prev = stack.pop();
        currentX = prev.x;
        currentY = prev.y;
      } else {
        // Done
        break;
      }
    }
    
    // Generate SVG path from maze walls
    let path = '';
    
    // Draw outer border
    const totalWidth = cols * cellSize;
    const totalHeight = rows * cellSize;
    path += `M 0 0 L ${totalWidth} 0 L ${totalWidth} ${totalHeight} L 0 ${totalHeight} Z `;
    
    // Draw internal walls
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * cellSize;
        const py = y * cellSize;
        const cell = grid[y][x];
        
        // Only draw right and bottom walls to avoid duplicates
        if (cell.walls.right && x < cols - 1) {
          path += `M ${px + cellSize} ${py} L ${px + cellSize} ${py + cellSize} `;
        }
        if (cell.walls.bottom && y < rows - 1) {
          path += `M ${px} ${py + cellSize} L ${px + cellSize} ${py + cellSize} `;
        }
      }
    }
    
    return {
      path,
      grid, // Return grid for pathfinding
      startX: startX * cellSize + cellSize / 2,
      startY: startY * cellSize + cellSize / 2,
      endX: endX * cellSize + cellSize / 2,
      endY: endY * cellSize + cellSize / 2,
      startCellX: startX,
      startCellY: startY,
      endCellX: endX,
      endCellY: endY,
      cellSize,
      cols,
      rows
    };
  }
  
  // BFS pathfinding - returns { visited, path }
  function solveMazeBFS(grid, startX, startY, endX, endY, cols, rows) {
    const visited = [];
    const queue = [{ x: startX, y: startY, path: [{ x: startX, y: startY }] }];
    const seen = new Set();
    seen.add(`${startX},${startY}`);
    
    const directions = [
      { dx: 0, dy: -1, wall: 'top' },
      { dx: 1, dy: 0, wall: 'right' },
      { dx: 0, dy: 1, wall: 'bottom' },
      { dx: -1, dy: 0, wall: 'left' }
    ];
    
    while (queue.length > 0) {
      const current = queue.shift();
      visited.push({ x: current.x, y: current.y });
      
      // Check if we reached the end
      if (current.x === endX && current.y === endY) {
        return { visited, path: current.path };
      }
      
      // Explore neighbors
      for (const dir of directions) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        const key = `${nx},${ny}`;
        
        // Check bounds and if not visited
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !seen.has(key)) {
          // Check if there's no wall between current and neighbor
          const cell = grid[current.y][current.x];
          if (!cell.walls[dir.wall]) {
            seen.add(key);
            queue.push({
              x: nx,
              y: ny,
              path: [...current.path, { x: nx, y: ny }]
            });
          }
        }
      }
    }
    
    return { visited, path: [] }; // No path found
  }
  
  // Start the solving animation
  function startSolveAnimation() {
    if (isSolving || !mazeGrid.length) return;
    
    isSolving = true;
    visitedCells = [];
    solutionPath = [];
    solveAnimationFrame = 0;
    
    // Run BFS
    const result = solveMazeBFS(
      mazeGrid,
      mazeData.startCellX,
      mazeData.startCellY,
      mazeData.endCellX,
      mazeData.endCellY,
      mazeData.cols,
      mazeData.rows
    );
    
    const allVisited = result.visited;
    const finalPath = result.path;
    
    // Animate visited cells one by one
    let visitIndex = 0;
    solveInterval = setInterval(() => {
      if (visitIndex < allVisited.length) {
        visitedCells = [...visitedCells, allVisited[visitIndex]];
        visitIndex++;
      } else {
        // Show solution path
        solutionPath = finalPath;
        clearInterval(solveInterval);
        isSolving = false;
      }
    }, 10); // Speed of animation (ms per cell)
  }
  
  // Reset solving animation
  function resetSolveAnimation() {
    if (solveInterval) clearInterval(solveInterval);
    isSolving = false;
    visitedCells = [];
    solutionPath = [];
    solveAnimationFrame = 0;
  }
  
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
    
    // Responsive blob radius - smaller on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const radius = isMobile ? 140 : 220;
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
  
  // Touch event handlers for mobile
  function handleTouchStart(e) {
    if (!container || e.touches.length === 0) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
    isHovering = true;
  }
  
  function handleTouchMove(e) {
    if (!container || e.touches.length === 0) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
    isHovering = true;
  }
  
  function handleTouchEnd() {
    // Keep the blob visible for a moment after touch ends, then fade out
    setTimeout(() => {
      if (!isHovering) {
        mouseX = -500;
        mouseY = -500;
      }
    }, 500);
    isHovering = false;
  }
  
  // Handle maze:solve event from Hero
  function handleMazeSolve(e) {
    if (e.detail.solve) {
      solveMaze = true;
      startSolveAnimation();
    } else {
      solveMaze = false;
      resetSolveAnimation();
    }
  }
  
  onMount(() => {
    mounted = true;
    
    // Check URL parameters for feature flags
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      revealMaze = urlParams.get('revealMaze') === 'true';
      solveMaze = urlParams.get('solveMaze') === 'true';
    }
    
    const maze = generateMaze();
    mazePath = maze.path;
    mazeGrid = maze.grid; // Store grid for pathfinding
    mazeData = {
      startX: maze.startX,
      startY: maze.startY,
      endX: maze.endX,
      endY: maze.endY,
      startCellX: maze.startCellX,
      startCellY: maze.startCellY,
      endCellX: maze.endCellX,
      endCellY: maze.endCellY,
      cellSize: maze.cellSize,
      cols: maze.cols,
      rows: maze.rows
    };
    
    // If solveMaze is in URL, start animation
    if (solveMaze) {
      // Small delay to ensure maze is rendered
      setTimeout(() => startSolveAnimation(), 500);
    }
    
    // Listen for maze:solve event from Hero
    window.addEventListener('maze:solve', handleMazeSolve);
    
    animate();
  });
  
  onDestroy(() => {
    mounted = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (solveInterval) {
      clearInterval(solveInterval);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('maze:solve', handleMazeSolve);
    }
  });
</script>

<div 
  class="cursor-reveal"
  bind:this={container}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  role="presentation"
>
  <!-- SVG mask with maze reveal -->
  <svg class="cursor-reveal__svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="blob-clip">
        <path d={blobPath} />
      </clipPath>
      
      <!-- Soft edge blur -->
      <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>
      
      <!-- Glow filter for maze lines -->
      <filter id="maze-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <!-- The revealed layer with maze pattern -->
    <!-- Use clip-path only when not in revealMaze mode -->
    <g clip-path={revealMaze ? undefined : "url(#blob-clip)"}>
      <!-- Dark mysterious background -->
      <rect x="0" y="0" width="100%" height="100%" fill="#1a1a2e" />
      
      <!-- BFS visited cells visualization -->
      {#each visitedCells as cell}
        <rect
          x={cell.x * mazeData.cellSize + 2}
          y={cell.y * mazeData.cellSize + 2}
          width={mazeData.cellSize - 4}
          height={mazeData.cellSize - 4}
          fill="#3b82f6"
          opacity="0.3"
        />
      {/each}
      
      <!-- Solution path visualization -->
      {#if solutionPath.length > 1}
        <path
          d={solutionPath.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x * mazeData.cellSize + mazeData.cellSize / 2} ${p.y * mazeData.cellSize + mazeData.cellSize / 2}`
          ).join(' ')}
          fill="none"
          stroke="#22c55e"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.9"
        />
      {/if}
      
      <!-- Primary maze layer - warm accent color -->
      <path 
        d={mazePath} 
        fill="none" 
        stroke="#e76f51" 
        stroke-width="1.5"
        stroke-linecap="square"
        opacity="0.9"
      />
      
      <!-- Secondary maze layer - offset for depth -->
      <g style="transform: translate(0.5px, 0.5px)">
        <path 
          d={mazePath} 
          fill="none" 
          stroke="#f4a261" 
          stroke-width="0.5"
          stroke-linecap="square"
          opacity="0.4"
        />
      </g>
      
      <!-- Start point - Green dot -->
      <circle 
        cx={mazeData.startX} 
        cy={mazeData.startY} 
        r={mazeData.cellSize * 0.35}
        fill="#22c55e"
        opacity="1"
      />
      <!-- Start glow -->
      <circle 
        cx={mazeData.startX} 
        cy={mazeData.startY} 
        r={mazeData.cellSize * 0.5}
        fill="#22c55e"
        opacity="0.3"
        filter="url(#maze-glow)"
      />
      
      <!-- End point - Red dot (center) -->
      <circle 
        cx={mazeData.endX} 
        cy={mazeData.endY} 
        r={mazeData.cellSize * 0.35}
        fill="#ef4444"
        opacity="1"
      />
      <!-- End glow -->
      <circle 
        cx={mazeData.endX} 
        cy={mazeData.endY} 
        r={mazeData.cellSize * 0.5}
        fill="#ef4444"
        opacity="0.3"
        filter="url(#maze-glow)"
      />
      
      <!-- Subtle radial highlight around end point -->
      <circle 
        cx={mazeData.endX} 
        cy={mazeData.endY} 
        r={mazeData.cellSize * 3}
        fill="rgba(239, 68, 68, 0.1)"
      />
    </g>
    
    <!-- Outer glow for depth (hidden in revealMaze mode) -->
    {#if !revealMaze}
      <path 
        d={blobPath} 
        fill="none" 
        stroke="#e76f51"
        stroke-width="4"
        opacity="0.4"
        filter="url(#blob-blur)"
      />
      
      <!-- Crisp edge highlight -->
      <path 
        d={blobPath} 
        fill="none" 
        stroke="rgba(244, 162, 97, 0.5)"
        stroke-width="1.5"
      />
    {/if}
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
  
  /* On touch devices, use default cursor instead of crosshair */
  @media (hover: none) {
    .cursor-reveal {
      cursor: auto;
    }
  }
  
</style>


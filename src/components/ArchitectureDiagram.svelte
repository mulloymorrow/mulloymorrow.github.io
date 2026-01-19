<script lang="ts">
  let hoveredStage = $state<string | null>(null);
  
  const stages: Record<string, { title: string; description: string; color: string }> = {
    corpus: {
      title: "Content Corpus",
      description: "100M+ songs, 7M+ podcasts, 500K+ audiobooks. Each format has different engagement patterns, consumption times, and value metrics.",
      color: "#8b949e"
    },
    candidates: {
      title: "Candidate Generation",
      description: "Two-Tower Model with ANN search. Based on YouTube's DNN paper (Covington et al., 2016). User and Item towers produce embeddings, dot product computes similarity for retrieval.",
      color: "#06b6d4"
    },
    ranking: {
      title: "Ranking (Wide & Deep)", 
      description: "Based on Google's Wide & Deep paper (Cheng et al., 2016). Wide component for memorization (sparse features to output), Deep component for generalization (embeddings → hidden layers → output).",
      color: "#1ed760"
    },
    scoring: {
      title: "Final Score",
      description: "Linear combination: α·P(consume) + β·δ(D) + γ·S where δ(D) is discovery indicator and S is stickiness from LTV stack.",
      color: "#1ed760"
    },
    output: {
      title: "Personalized Home Feed",
      description: "Final ranked content presented to 700M+ monthly active users, combined with promotions.",
      color: "#1ed760"
    }
  };
</script>

<div class="architecture-container">
  <svg viewBox="0 0 900 420" class="architecture-svg">
    <!-- Background -->
    <rect x="0" y="0" width="900" height="420" fill="#0d1117" rx="8"/>
    
    <!-- Title -->
    <text x="450" y="30" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="600">Two-Stage Recommendation System Architecture</text>
    
    <!-- Content Corpus - Left side -->
    <g 
      class="stage-group"
      class:hovered={hoveredStage === 'corpus'}
      onmouseenter={() => hoveredStage = 'corpus'}
      onmouseleave={() => hoveredStage = null}
      role="button"
      tabindex="0"
      aria-label="Content Corpus stage"
    >
      <rect x="30" y="60" width="130" height="240" fill="#21262d" stroke="#30363d" stroke-width="1" rx="8"/>
      <text x="95" y="82" text-anchor="middle" fill="#8b949e" font-size="10" font-weight="600">CONTENT</text>
      <text x="95" y="95" text-anchor="middle" fill="#8b949e" font-size="10" font-weight="600">CORPUS</text>
      
      <rect x="42" y="108" width="106" height="32" fill="#1ed76015" stroke="#1ed760" stroke-width="1" rx="4"/>
      <text x="95" y="128" text-anchor="middle" fill="#1ed760" font-size="9" font-weight="600">🎵 Music</text>
      
      <rect x="42" y="148" width="106" height="32" fill="#8b5cf615" stroke="#8b5cf6" stroke-width="1" rx="4"/>
      <text x="95" y="168" text-anchor="middle" fill="#8b5cf6" font-size="9" font-weight="600">🎙️ Podcasts</text>
      
      <rect x="42" y="188" width="106" height="32" fill="#f59e0b15" stroke="#f59e0b" stroke-width="1" rx="4"/>
      <text x="95" y="208" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="600">📚 Audiobooks</text>
      
      <rect x="42" y="228" width="106" height="32" fill="#06b6d415" stroke="#06b6d4" stroke-width="1" rx="4"/>
      <text x="95" y="248" text-anchor="middle" fill="#06b6d4" font-size="9" font-weight="600">🎬 Video</text>
      
      <text x="95" y="285" text-anchor="middle" fill="#e6edf3" font-size="16" font-weight="700">Millions</text>
    </g>
    
    <!-- Arrow from corpus -->
    <path d="M160 180 L195 180" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    
    <!-- User history & context - feeds into BOTH -->
    <g>
      <rect x="340" y="45" width="130" height="30" fill="#21262d" stroke="#30363d" stroke-width="1" rx="6"/>
      <text x="405" y="65" text-anchor="middle" fill="#e6edf3" font-size="9" font-weight="600">user history & context</text>
      <path d="M370 75 L280 95" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
      <path d="M440 75 L560 95" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    </g>
    
    <!-- Real-time signal -->
    <g>
      <rect x="600" y="45" width="90" height="30" fill="#21262d" stroke="#30363d" stroke-width="1" rx="6"/>
      <text x="645" y="65" text-anchor="middle" fill="#e6edf3" font-size="9" font-weight="600">real-time signal</text>
      <path d="M600 60 L560 95" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    </g>
    
    <!-- Candidate Generation - Two Tower -->
    <g 
      class="stage-group"
      class:hovered={hoveredStage === 'candidates'}
      onmouseenter={() => hoveredStage = 'candidates'}
      onmouseleave={() => hoveredStage = null}
      role="button"
      tabindex="0"
      aria-label="Candidate Generation stage"
    >
      <rect x="205" y="95" width="240" height="200" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" stroke-width="2" rx="8"/>
      <text x="325" y="115" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="600">CANDIDATE GENERATION</text>
      <text x="260" y="130" text-anchor="middle" fill="#8b949e" font-size="8">Two-Tower Architecture</text>
      
      <!-- User Tower -->
      <rect x="220" y="140" width="100" height="50" fill="#21262d" stroke="#8b5cf6" stroke-width="1" rx="6"/>
      <text x="270" y="160" text-anchor="middle" fill="#8b5cf6" font-size="9" font-weight="600">User Tower</text>
      <rect x="230" y="168" width="12" height="16" fill="#8b5cf630" rx="2"/>
      <rect x="247" y="170" width="12" height="12" fill="#8b5cf630" rx="2"/>
      <rect x="264" y="172" width="12" height="8" fill="#8b5cf630" rx="2"/>
      <circle cx="295" cy="176" r="6" fill="#8b5cf6"/>
      <text x="308" y="180" fill="#8b949e" font-size="7">u</text>
      
      <!-- Item Tower -->
      <rect x="220" y="200" width="100" height="50" fill="#21262d" stroke="#f59e0b" stroke-width="1" rx="6"/>
      <text x="270" y="220" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="600">Item Tower</text>
      <rect x="230" y="228" width="12" height="16" fill="#f59e0b30" rx="2"/>
      <rect x="247" y="230" width="12" height="12" fill="#f59e0b30" rx="2"/>
      <rect x="264" y="232" width="12" height="8" fill="#f59e0b30" rx="2"/>
      <circle cx="295" cy="236" r="6" fill="#f59e0b"/>
      <text x="308" y="240" fill="#8b949e" font-size="7">v</text>
      
      <!-- Dot product -->
      <path d="M301 176 L370 205" stroke="#8b5cf6" stroke-width="1.5"/>
      <path d="M301 236 L370 205" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="390" cy="205" r="16" fill="#1ed760"/>
      <text x="390" y="210" text-anchor="middle" fill="#0d1117" font-size="10" font-weight="700">u·v</text>
      
      <text x="390" y="240" text-anchor="middle" fill="#8b949e" font-size="7">ANN Search</text>
      <text x="325" y="280" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="700">Hundreds</text>
    </g>
    
    <!-- Arrow to ranking -->
    <path d="M406 205 L455 180" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    
    <!-- Ranking - Wide & Deep -->
    <g 
      class="stage-group"
      class:hovered={hoveredStage === 'ranking'}
      onmouseenter={() => hoveredStage = 'ranking'}
      onmouseleave={() => hoveredStage = null}
      role="button"
      tabindex="0"
      aria-label="Ranking stage"
    >
      <rect x="465" y="95" width="180" height="200" fill="rgba(30, 215, 96, 0.1)" stroke="#1ed760" stroke-width="2" rx="8"/>
      <text x="555" y="115" text-anchor="middle" fill="#1ed760" font-size="11" font-weight="600">RANKING</text>
      <text x="555" y="128" text-anchor="middle" fill="#8b949e" font-size="8">Wide & Deep Model</text>
      
      <!-- Wide sparse features (no box) -->
      <circle cx="485" cy="260" r="4" fill="#8b949e"/>
      <circle cx="497" cy="260" r="4" fill="#8b949e"/>
      <circle cx="509" cy="260" r="4" fill="#f59e0b"/>
      <circle cx="521" cy="260" r="4" fill="#8b949e"/>
      
      <!-- Wide lines to output -->
      <line x1="485" y1="256" x2="555" y2="150" stroke="#8b949e" stroke-width="0.7" opacity="0.5"/>
      <line x1="497" y1="256" x2="555" y2="150" stroke="#8b949e" stroke-width="0.7" opacity="0.5"/>
      <line x1="509" y1="256" x2="555" y2="150" stroke="#f59e0b" stroke-width="0.7" opacity="0.5"/>
      <line x1="521" y1="256" x2="555" y2="150" stroke="#8b949e" stroke-width="0.7" opacity="0.5"/>
      
      <!-- Deep sparse features (no box) -->
      <circle cx="545" cy="260" r="3" fill="#8b949e"/>
      <circle cx="558" cy="260" r="3" fill="#f59e0b"/>
      <circle cx="571" cy="260" r="3" fill="#8b949e"/>
      <circle cx="584" cy="260" r="3" fill="#8b949e"/>
      <circle cx="597" cy="260" r="3" fill="#f59e0b"/>
      <circle cx="610" cy="260" r="3" fill="#8b949e"/>
      <circle cx="623" cy="260" r="3" fill="#f59e0b"/>
      
      <!-- Dense Embeddings with bounding box -->
      <rect x="540" y="218" width="90" height="22" fill="#06b6d410" stroke="#06b6d4" stroke-width="1" stroke-dasharray="3" rx="4"/>
      <circle cx="552" cy="229" r="3" fill="#06b6d4"/>
      <circle cx="565" cy="229" r="3" fill="#06b6d4"/>
      <circle cx="578" cy="229" r="3" fill="#06b6d4"/>
      <circle cx="591" cy="229" r="3" fill="#06b6d4"/>
      <circle cx="604" cy="229" r="3" fill="#06b6d4"/>
      <circle cx="617" cy="229" r="3" fill="#06b6d4"/>
      
      <!-- Hidden layers -->
      <circle cx="565" cy="195" r="3" fill="#1ed760"/>
      <circle cx="578" cy="195" r="3" fill="#1ed760"/>
      <circle cx="591" cy="195" r="3" fill="#1ed760"/>
      <circle cx="604" cy="195" r="3" fill="#1ed760"/>
      
      <circle cx="572" cy="172" r="3" fill="#1ed760"/>
      <circle cx="585" cy="172" r="3" fill="#1ed760"/>
      <circle cx="598" cy="172" r="3" fill="#1ed760"/>
      
      <!-- Connections -->
      <line x1="552" y1="226" x2="565" y2="198" stroke="#30363d" stroke-width="0.4"/>
      <line x1="578" y1="226" x2="578" y2="198" stroke="#30363d" stroke-width="0.4"/>
      <line x1="604" y1="226" x2="604" y2="198" stroke="#30363d" stroke-width="0.4"/>
      <line x1="565" y1="192" x2="572" y2="175" stroke="#30363d" stroke-width="0.4"/>
      <line x1="591" y1="192" x2="585" y2="175" stroke="#30363d" stroke-width="0.4"/>
      <line x1="572" y1="169" x2="555" y2="156" stroke="#06b6d4" stroke-width="0.7" opacity="0.6"/>
      <line x1="598" y1="169" x2="555" y2="156" stroke="#06b6d4" stroke-width="0.7" opacity="0.6"/>
      
      <!-- Output unit -->
      <circle cx="555" cy="150" r="6" fill="#f59e0b" stroke="#0d1117" stroke-width="1"/>
      
      <text x="555" y="280" text-anchor="middle" fill="#1ed760" font-size="12" font-weight="700">Dozens</text>
    </g>
    
    <!-- Arrow to final score -->
    <path d="M645 180 L680 165" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    
    <!-- Final Score -->
    <g 
      class="stage-group"
      class:hovered={hoveredStage === 'scoring'}
      onmouseenter={() => hoveredStage = 'scoring'}
      onmouseleave={() => hoveredStage = null}
      role="button"
      tabindex="0"
      aria-label="Final Score stage"
    >
      <rect x="680" y="95" width="110" height="80" fill="#21262d" stroke="#1ed760" stroke-width="1" rx="6"/>
      <text x="735" y="115" text-anchor="middle" fill="#1ed760" font-size="9" font-weight="600">FINAL SCORE</text>
      <text x="735" y="135" text-anchor="middle" fill="#e6edf3" font-size="8" font-family="monospace">α·P(consume)</text>
      <text x="735" y="148" text-anchor="middle" fill="#e6edf3" font-size="8" font-family="monospace">+ β·δ(D) + γ·S</text>
      <text x="690" y="165" fill="#8b949e" font-size="6">δ(D) = discovery indicator</text>
    </g>
    
    <!-- Arrow to home feed -->
    <path d="M735 175 L735 210" stroke="#30363d" stroke-width="2" marker-end="url(#arrowhead)"/>
    
    <!-- Promotions -->
    <g>
      <rect x="680" y="320" width="80" height="28" fill="#21262d" stroke="#f59e0b" stroke-width="1" rx="6"/>
      <text x="720" y="338" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="600">promotions</text>
      <path d="M720 320 L735 290" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowOrange)"/>
    </g>
    
    <!-- Home Feed Output -->
    <g 
      class="stage-group"
      class:hovered={hoveredStage === 'output'}
      onmouseenter={() => hoveredStage = 'output'}
      onmouseleave={() => hoveredStage = null}
      role="button"
      tabindex="0"
      aria-label="Home Feed Output stage"
    >
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1ed760"/>
          <stop offset="100%" style="stop-color:#169c46"/>
        </linearGradient>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#30363d"/>
        </marker>
        <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
        </marker>
      </defs>
      <rect x="680" y="220" width="110" height="70" fill="url(#greenGradient)" rx="8"/>
      <text x="735" y="248" text-anchor="middle" fill="#0d1117" font-size="10" font-weight="700">Home Feed</text>
      <text x="735" y="272" text-anchor="middle" fill="#0d1117" font-size="16" font-weight="700">700M</text>
      <text x="735" y="284" text-anchor="middle" fill="#0d1117" font-size="7">users</text>
    </g>
    
    <!-- Citation -->
    <text x="450" y="405" text-anchor="middle" fill="#8b949e" font-size="8">Architecture based on Covington et al. (2016) and Cheng et al. (2016)</text>
  </svg>
  
  <!-- Tooltip -->
  {#if hoveredStage}
    <div class="tooltip" style="border-color: {stages[hoveredStage].color}">
      <h4 style="color: {stages[hoveredStage].color}">{stages[hoveredStage].title}</h4>
      <p>{stages[hoveredStage].description}</p>
    </div>
  {/if}
</div>

<style>
  .architecture-container {
    position: relative;
  }
  
  .architecture-svg {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .stage-group {
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .stage-group:hover rect:first-child {
    fill-opacity: 0.3;
  }
  
  .tooltip {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: #161b22;
    border: 1px solid;
    border-radius: 8px;
    padding: 1rem;
    max-width: 450px;
    z-index: 10;
  }
  
  .tooltip h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .tooltip p {
    margin: 0;
    font-size: 0.8125rem;
    color: #8b949e;
    line-height: 1.5;
  }
</style>

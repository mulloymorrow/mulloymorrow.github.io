<script lang="ts">
  let selectedTeam = $state<string | null>(null);
  
  const teams: Record<string, { name: string; description: string; tech: string; color: string; product: string }> = {
    shortcuts: {
      name: "Shortcuts",
      description: '"Jump Back In" / Quick Access / Recent',
      tech: "Simple Wide & Deep Model optimized for familiar content",
      color: "#8b5cf6",
      product: "Top row of Home page — quick access to recent plays"
    },
    ranking: {
      name: "Ranking", 
      description: '"Made For You" / "Discover Weekly" / Content Rows',
      tech: "Two-Stage Ranker (Candidate Generation + Ranking)",
      color: "#1ed760",
      product: "Recommendation shelves below shortcuts"
    },
    assembly: {
      name: "Assembly",
      description: "Promotions / Layout / Business Logic",
      tech: "Final Construction from all content sources",
      color: "#f59e0b",
      product: "Combines all sources into final Home page"
    }
  };
  
  function toggleTeam(team: string) {
    selectedTeam = selectedTeam === team ? null : team;
  }
</script>

<div class="org-container">
  <svg viewBox="0 0 800 400" class="org-svg">
    <!-- Background -->
    <rect x="0" y="0" width="800" height="400" fill="#0d1117" rx="8"/>
    
    <!-- Home Page Product Box -->
    <g>
      <rect x="50" y="20" width="340" height="180" fill="#161b22" stroke="#30363d" stroke-width="1" rx="6"/>
      <text x="70" y="45" fill="#8b949e" font-size="10">SPOTIFY HOME PAGE</text>
      
      <!-- Shortcuts layer -->
      <rect 
        x="65" y="60" width="310" height="35" 
        fill={selectedTeam === 'shortcuts' ? 'rgba(139, 92, 246, 0.3)' : '#8b5cf6'} 
        rx="4"
        class="clickable"
        onclick={() => toggleTeam('shortcuts')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('shortcuts')}
        role="button"
        tabindex="0"
        aria-label="Shortcuts team"
      />
      <text x="220" y="80" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="600" pointer-events="none">SHORTCUTS</text>
      <text x="220" y="92" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8" pointer-events="none">"Jump Back In" • Quick Access</text>
      
      <!-- Recommendations layer -->
      <rect 
        x="65" y="102" width="310" height="35" 
        fill={selectedTeam === 'ranking' ? 'rgba(30, 215, 96, 0.3)' : '#1ed760'} 
        rx="4"
        class="clickable"
        onclick={() => toggleTeam('ranking')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('ranking')}
        role="button"
        tabindex="0"
        aria-label="Ranking team"
      />
      <text x="220" y="122" text-anchor="middle" fill="#0d1117" font-size="11" font-weight="600" pointer-events="none">RECOMMENDATIONS</text>
      <text x="220" y="134" text-anchor="middle" fill="rgba(0,0,0,0.6)" font-size="8" pointer-events="none">"Made For You" • "Discover Weekly"</text>
      
      <!-- Assembly layer -->
      <rect 
        x="65" y="144" width="310" height="35" 
        fill={selectedTeam === 'assembly' ? 'rgba(245, 158, 11, 0.3)' : '#f59e0b'} 
        rx="4"
        class="clickable"
        onclick={() => toggleTeam('assembly')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('assembly')}
        role="button"
        tabindex="0"
        aria-label="Assembly team"
      />
      <text x="220" y="164" text-anchor="middle" fill="#0d1117" font-size="11" font-weight="600" pointer-events="none">ASSEMBLY</text>
      <text x="220" y="176" text-anchor="middle" fill="rgba(0,0,0,0.6)" font-size="8" pointer-events="none">Promotions • Layout • Business Logic</text>
    </g>
    
    <!-- Org Structure Box -->
    <g>
      <rect x="410" y="20" width="340" height="180" fill="#161b22" stroke="#30363d" stroke-width="1" rx="6"/>
      <text x="430" y="45" fill="#8b949e" font-size="10">HOME CONSTRUCTION GROUP</text>
      
      <!-- Group Lead -->
      <defs>
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1ed760"/>
          <stop offset="100%" style="stop-color:#169c46"/>
        </linearGradient>
      </defs>
      <rect x="425" y="55" width="310" height="45" fill="url(#greenGrad)" rx="4"/>
      <text x="580" y="75" text-anchor="middle" fill="#0d1117" font-size="11" font-weight="700">Mulloy Morrow, Group Lead</text>
      <text x="580" y="90" text-anchor="middle" fill="#0d1117" font-size="9" opacity="0.8">Supervisory: 25+ | Technical Span: 100+</text>
      
      <!-- Three teams -->
      <rect 
        x="425" y="108" width="95" height="50" 
        fill={selectedTeam === 'shortcuts' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)'} 
        stroke="#8b5cf6" stroke-width="1" rx="4"
        class="clickable"
        onclick={() => toggleTeam('shortcuts')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('shortcuts')}
        role="button"
        tabindex="0"
        aria-label="Shortcuts team details"
      />
      <text x="472" y="130" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="600" pointer-events="none">SHORTCUTS</text>
      <text x="472" y="145" text-anchor="middle" fill="#8b949e" font-size="8" pointer-events="none">Wide & Deep</text>
      
      <rect 
        x="532" y="108" width="95" height="50" 
        fill={selectedTeam === 'ranking' ? 'rgba(30, 215, 96, 0.3)' : 'rgba(30, 215, 96, 0.15)'} 
        stroke="#1ed760" stroke-width="1" rx="4"
        class="clickable"
        onclick={() => toggleTeam('ranking')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('ranking')}
        role="button"
        tabindex="0"
        aria-label="Ranking team details"
      />
      <text x="580" y="130" text-anchor="middle" fill="#1ed760" font-size="10" font-weight="600" pointer-events="none">RANKING</text>
      <text x="580" y="145" text-anchor="middle" fill="#8b949e" font-size="8" pointer-events="none">Two-Stage ML</text>
      
      <rect 
        x="640" y="108" width="95" height="50" 
        fill={selectedTeam === 'assembly' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)'} 
        stroke="#f59e0b" stroke-width="1" rx="4"
        class="clickable"
        onclick={() => toggleTeam('assembly')}
        onkeydown={(e) => e.key === 'Enter' && toggleTeam('assembly')}
        role="button"
        tabindex="0"
        aria-label="Assembly team details"
      />
      <text x="687" y="130" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="600" pointer-events="none">ASSEMBLY</text>
      <text x="687" y="145" text-anchor="middle" fill="#8b949e" font-size="8" pointer-events="none">Business Logic</text>
      
      <!-- Cross-functional span -->
      <text x="580" y="180" text-anchor="middle" fill="#8b949e" font-size="9">Finance • Podcasts • Audiobooks • Live Events • Data Science • Design</text>
    </g>
    
    <!-- Connection lines -->
    <line x1="375" y1="77" x2="410" y2="77" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="4"/>
    <line x1="375" y1="119" x2="410" y2="119" stroke="#1ed760" stroke-width="1" stroke-dasharray="4"/>
    <line x1="375" y1="161" x2="410" y2="161" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4"/>
    
    <!-- UPS Analogy Box -->
    <rect x="50" y="220" width="700" height="60" fill="#21262d" rx="6"/>
    <rect x="50" y="220" width="4" height="60" fill="#1ed760" rx="2 0 0 2"/>
    <text x="70" y="245" fill="#1ed760" font-size="11" font-weight="600">The "UPS/Amazon Delivery" of Spotify</text>
    <text x="70" y="262" fill="#8b949e" font-size="10">We designed the "cardboard boxes" — the specs all content must fit into to get distributed.</text>
    
    <!-- Click hint -->
    <text x="400" y="310" text-anchor="middle" fill="#8b949e" font-size="10">Click a team to see details</text>
  </svg>
  
  <!-- Team Detail Panel -->
  {#if selectedTeam}
    <div class="team-panel" style="border-color: {teams[selectedTeam].color}">
      <h4 style="color: {teams[selectedTeam].color}">{teams[selectedTeam].name} Team</h4>
      <p><strong>Product:</strong> {teams[selectedTeam].product}</p>
      <p><strong>Scope:</strong> {teams[selectedTeam].description}</p>
      <p><strong>Tech:</strong> {teams[selectedTeam].tech}</p>
    </div>
  {/if}
</div>

<style>
  .org-container {
    position: relative;
  }
  
  .org-svg {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .clickable {
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .clickable:hover {
    opacity: 0.8;
  }
  
  .team-panel {
    margin-top: 1rem;
    background: #161b22;
    border: 1px solid;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .team-panel h4 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .team-panel p {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    color: #8b949e;
    line-height: 1.5;
  }
  
  .team-panel p:last-child {
    margin-bottom: 0;
  }
  
  .team-panel strong {
    color: #e6edf3;
  }
</style>

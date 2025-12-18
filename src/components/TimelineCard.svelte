<script lang="ts">
  interface Experience {
    company: string;
    role: string;
    period: string;
    location?: string;
    summary: string;
    highlights: string[];
    technologies: string[];
    isCurrent?: boolean;
    logo?: string; // Path to logo image (relative to public folder, e.g., "/logos/company.png")
  }

  export let experience: Experience;
  
  let isExpanded = false;
  
  function toggle() {
    isExpanded = !isExpanded;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }
</script>

<div class="timeline-card" class:expanded={isExpanded}>
  <div class="timeline-marker">
    <div class="timeline-dot" class:current={experience.isCurrent}></div>
    <div class="timeline-line"></div>
  </div>
  
  <button 
    class="timeline-content"
    on:click={toggle}
    on:keydown={handleKeydown}
    aria-expanded={isExpanded}
  >
    <div class="timeline-header">
      <div class="timeline-meta">
        {#if experience.period}
          <span class="timeline-period">{experience.period}</span>
        {/if}
        {#if experience.location}
          <span class="timeline-location">{experience.location}</span>
        {/if}
      </div>
      
      <div class="timeline-company-row">
        {#if experience.logo}
          <img 
            src={experience.logo} 
            alt="{experience.company} logo" 
            class="timeline-logo"
          />
        {/if}
        <div class="timeline-company-info">
          <h3 class="timeline-company">{experience.company}</h3>
          <h4 class="timeline-role">{experience.role}</h4>
        </div>
      </div>
      
      <p class="timeline-summary">{experience.summary}</p>
      
      <div class="timeline-expand-hint">
        <span>{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
        <svg 
          class="timeline-chevron" 
          class:rotated={isExpanded}
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </div>
    
    {#if isExpanded}
      <div class="timeline-details">
        <div class="timeline-highlights">
          <h5>Key Achievements</h5>
          <ul>
            {#each experience.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
        </div>
        
        {#if experience.technologies.length > 0}
          <div class="timeline-tech">
            <h5>Technologies</h5>
            <div class="timeline-tech-list">
              {#each experience.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </button>
</div>

<style>
  .timeline-card {
    display: flex;
    gap: 1.5rem;
    position: relative;
  }
  
  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }
  
  .timeline-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-bg-surface);
    border: 3px solid var(--color-border-hover);
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  .timeline-dot.current {
    border-color: var(--color-accent);
    box-shadow: 0 0 12px var(--color-accent-glow);
  }
  
  .timeline-card:hover .timeline-dot {
    border-color: var(--color-accent);
    transform: scale(1.2);
  }
  
  .timeline-line {
    width: 2px;
    flex-grow: 1;
    background: linear-gradient(to bottom, var(--color-border-hover), transparent);
    margin-top: 0.5rem;
  }
  
  .timeline-content {
    flex: 1;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    width: 100%;
  }
  
  .timeline-content:hover {
    border-color: var(--color-accent);
    background: var(--color-bg-elevated);
    transform: translateX(4px);
    box-shadow: var(--shadow-md);
  }
  
  .timeline-card.expanded .timeline-content {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-warm);
  }
  
  .timeline-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .timeline-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .timeline-period {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-accent);
    font-weight: 500;
  }
  
  .timeline-location {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }
  
  .timeline-company-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.25rem;
  }
  
  .timeline-logo {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    object-fit: contain;
    background: var(--color-bg-elevated);
    padding: 4px;
    border: 1px solid var(--color-border);
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  
  .timeline-content:hover .timeline-logo {
    border-color: var(--color-accent);
    box-shadow: 0 0 12px var(--color-accent-glow);
  }
  
  .timeline-company-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .timeline-company {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
  
  .timeline-role {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .timeline-summary {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0.75rem 0 0 0;
    line-height: 1.6;
  }
  
  .timeline-expand-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .timeline-chevron {
    transition: transform 0.3s ease;
  }
  
  .timeline-chevron.rotated {
    transform: rotate(180deg);
  }
  
  .timeline-details {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .timeline-highlights h5,
  .timeline-tech h5 {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-secondary);
    margin: 0 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .timeline-highlights ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .timeline-highlights li {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.5rem;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  .timeline-highlights li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--color-accent);
  }
  
  .timeline-tech {
    margin-top: 1.25rem;
  }
  
  .timeline-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tech-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 0.25rem 0.75rem;
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }
  
  @media (max-width: 640px) {
    .timeline-card {
      gap: 1rem;
    }
    
    .timeline-content {
      padding: 1rem;
    }
    
    .timeline-company {
      font-size: var(--text-lg);
    }
  }
</style>


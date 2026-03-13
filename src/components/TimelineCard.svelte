<script lang="ts">
  import { getTechWikiUrl } from '../utils/techLinks';
  import PingPongVideo from './PingPongVideo.svelte';
  import SquadFormationDiagram from './SquadFormationDiagram.svelte';

  interface PhaseLink {
    label: string;
    url: string;
  }

  interface Phase {
    title: string;
    role?: string;
    period?: string;
    description: string;
    achievements: string[];
    link?: PhaseLink;
    links?: (PhaseLink & { icon?: string; external?: boolean })[];
  }

  interface Experience {
    company: string;
    companyUrl?: string; // URL to company website
    role: string;
    period: string;
    location?: string;
    summary: string;
    highlights: string[];
    technologies: string[];
    isCurrent?: boolean;
    badgeText?: string; // Optional badge to display next to company name (e.g., "Side Quest", "Consulting")
    logo?: string;
    links?: { label: string; url: string; icon?: string }[];
    phases?: Phase[];
    showSquadDiagram?: boolean;
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
  
  <div 
    class="timeline-content"
    role="button"
    tabindex="0"
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
          {#if experience.companyUrl}
            <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" class="timeline-logo-link" on:click|stopPropagation>
              <img 
                src={experience.logo} 
                alt="{experience.company} logo" 
                class="timeline-logo"
              />
            </a>
          {:else}
            <img 
              src={experience.logo} 
              alt="{experience.company} logo" 
              class="timeline-logo"
            />
          {/if}
        {/if}
        <div class="timeline-company-info">
          <h3 class="timeline-company">
            {#if experience.companyUrl}
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" class="timeline-company-link" on:click|stopPropagation>
                {experience.company}
              </a>
            {:else}
              {experience.company}
            {/if}
            {#if experience.badgeText}
              <span class="consulting-badge">{experience.badgeText}</span>
            {/if}
          </h3>
          <h4 class="timeline-role">{experience.role}</h4>
        </div>
      </div>
      
      {#if experience.showSquadDiagram}
        <div class="timeline-summary-with-diagram">
          <p class="timeline-summary">{experience.summary}</p>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="timeline-diagram" on:click|stopPropagation on:keydown|stopPropagation>
            <SquadFormationDiagram />
          </div>
        </div>
      {:else}
        <p class="timeline-summary">{experience.summary}</p>
      {/if}
      
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
        {#if experience.phases && experience.phases.length > 0}
          <div class="timeline-phases">
            {#each experience.phases as phase, index}
              <div class="phase-card">
                <div class="phase-header">
                  <div class="phase-number">{index + 1}</div>
                  <div class="phase-title-block">
                    <h5 class="phase-title">{phase.title}</h5>
                    {#if phase.role}
                      <span class="phase-role">{phase.role}</span>
                    {/if}
                    {#if phase.period}
                      <span class="phase-period">{phase.period}</span>
                    {/if}
                  </div>
                </div>
                <p class="phase-description">{phase.description}</p>
                <ul class="phase-achievements">
                  {#each phase.achievements as achievement}
                    <li>{achievement}</li>
                  {/each}
                </ul>
                {#if phase.links && phase.links.length > 0}
                  <div class="phase-links">
                    {#each phase.links as link}
                      <a href={link.url} target={link.external !== false ? "_blank" : "_self"} rel={link.external !== false ? "noopener noreferrer" : ""} class="phase-link" on:click|stopPropagation>
                        {#if link.icon === "document"}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                          </svg>
                        {:else}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        {/if}
                        {link.label}
                      </a>
                    {/each}
                  </div>
                {:else if phase.link}
                  <a href={phase.link.url} target="_blank" rel="noopener noreferrer" class="phase-link" on:click|stopPropagation>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    {phase.link.label}
                  </a>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="timeline-highlights">
            <h5>Key Achievements</h5>
            <ul>
              {#each experience.highlights as highlight}
                <li>{highlight}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if experience.links && experience.links.length > 0}
          <div class="timeline-links">
            {#each experience.links as link}
              <a href={link.url} target={link.url.startsWith('/') ? "_self" : "_blank"} rel={link.url.startsWith('/') ? "" : "noopener noreferrer"} class="timeline-link-btn {link.icon === 'ai' ? 'timeline-link-btn--ai' : ''} {link.icon === 'vision' ? 'timeline-link-btn--vision' : ''}" on:click|stopPropagation>
                {#if link.icon === 'ai'}
                  <span class="timeline-link-btn__video">
                    <PingPongVideo src="/video/portrait_drawing.mp4" className="ai-mulloy-video" />
                  </span>
                {:else if link.icon === 'vision'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                {/if}
                {link.label}
              </a>
            {/each}
          </div>
        {/if}
        
        {#if experience.technologies.length > 0}
          <div class="timeline-tech">
            <h5>Technologies</h5>
            <div class="timeline-tech-list">
              {#each experience.technologies as tech}
                <a 
                  href={getTechWikiUrl(tech)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="tech-tag tech-tag--link"
                  on:click|stopPropagation
                  title="Learn more about {tech}"
                >{tech}</a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .timeline-company-link {
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .timeline-company-link:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }

  .timeline-logo-link {
    display: block;
    transition: transform 0.2s ease;
  }

  .timeline-logo-link:hover {
    transform: scale(1.1);
  }

  .timeline-logo-link:hover .timeline-logo {
    border-color: var(--color-accent);
    box-shadow: 0 0 12px var(--color-accent-glow);
  }
  
  .consulting-badge {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-accent);
    background: rgba(var(--color-accent-rgb), 0.15);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .timeline-role {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .timeline-summary-with-diagram {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    margin-top: 0.75rem;
  }

  .timeline-summary-with-diagram .timeline-summary {
    flex: 1;
    min-width: 0;
    margin-top: 0;
  }

  .timeline-diagram {
    flex: 1.2;
    min-width: 0;
  }

  @media (max-width: 640px) {
    .timeline-summary-with-diagram {
      flex-direction: column;
    }
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
  
  /* Phase styles */
  .timeline-phases {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .phase-card {
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    transition: all 0.3s ease;
  }

  .phase-card:hover {
    border-color: var(--color-accent);
    background: var(--color-bg-elevated);
  }

  .phase-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .phase-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-cool));
    color: var(--color-bg-primary);
    font-weight: 700;
    font-size: var(--text-sm);
    flex-shrink: 0;
  }

  .phase-title-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .phase-title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .phase-role {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .phase-period {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-accent);
  }

  .phase-description {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0 0 0.75rem 0;
    padding-left: 2.75rem;
  }

  .phase-achievements {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-left: 2.75rem;
  }

  .phase-achievements li {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.35rem;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .phase-achievements li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--color-accent);
  }

  .phase-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    margin-left: 2.75rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-cool));
    color: var(--color-bg-primary);
    font-size: var(--text-sm);
    font-weight: 600;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .phase-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-accent-glow);
  }

  .phase-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
    margin-left: 2.75rem;
  }

  .phase-links .phase-link {
    margin: 0;
  }

  .phase-link svg {
    flex-shrink: 0;
  }

  .timeline-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .timeline-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-bg-hover);
    border: 1px solid var(--color-accent);
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .timeline-link-btn:hover {
    background: var(--color-accent);
    color: var(--color-bg-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-accent-glow);
  }

  .timeline-link-btn svg {
    flex-shrink: 0;
  }
  
  .timeline-link-btn--ai {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-cool));
    color: var(--color-bg-primary);
    border-color: transparent;
  }
  
  .timeline-link-btn--ai:hover {
    background: linear-gradient(135deg, var(--color-accent-cool), var(--color-accent));
    box-shadow: 0 4px 16px var(--color-accent-glow);
  }
  
  .timeline-link-btn--vision {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: var(--color-bg-primary);
    border-color: transparent;
  }
  
  .timeline-link-btn--vision:hover {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
  }
  
  .timeline-link-btn__video {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .timeline-link-btn__video :global(.ai-mulloy-video) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.5);
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

  .tech-tag--link {
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .tech-tag--link:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-accent-glow);
    transform: translateY(-1px);
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


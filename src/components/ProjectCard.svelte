<script lang="ts">
  interface Project {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    impact?: string;
    links?: {
      demo?: string;
      github?: string;
      article?: string;
    };
    featured?: boolean;
    logo?: string;
    gallery?: { src: string; caption: string }[];
  }

  export let project: Project;
  
  let isExpanded = false;
  let showGallery = false;
  let currentImageIndex = 0;
  
  function toggle() {
    isExpanded = !isExpanded;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }
  
  function openGallery(event: MouseEvent) {
    if (project.gallery && project.gallery.length > 0) {
      event.stopPropagation();
      currentImageIndex = 0;
      showGallery = true;
    }
  }
  
  function closeGallery() {
    showGallery = false;
  }
  
  function nextImage(event: MouseEvent) {
    event.stopPropagation();
    if (project.gallery) {
      currentImageIndex = (currentImageIndex + 1) % project.gallery.length;
    }
  }
  
  function prevImage(event: MouseEvent) {
    event.stopPropagation();
    if (project.gallery) {
      currentImageIndex = (currentImageIndex - 1 + project.gallery.length) % project.gallery.length;
    }
  }
  
  function handleGalleryKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeGallery();
    } else if (event.key === 'ArrowRight') {
      if (project.gallery) {
        currentImageIndex = (currentImageIndex + 1) % project.gallery.length;
      }
    } else if (event.key === 'ArrowLeft') {
      if (project.gallery) {
        currentImageIndex = (currentImageIndex - 1 + project.gallery.length) % project.gallery.length;
      }
    }
  }
</script>

<div class="project-card" class:expanded={isExpanded} class:featured={project.featured}>
  <button 
    class="project-content"
    on:click={toggle}
    on:keydown={handleKeydown}
    aria-expanded={isExpanded}
  >
    <div class="project-header">
      {#if project.logo}
        {@const isEmoji = !project.logo.startsWith('/') && !project.logo.startsWith('http')}
        {#if isEmoji}
          <span class="project-emoji" aria-label="{project.title} icon">{project.logo}</span>
        {:else if project.gallery && project.gallery.length > 0}
          <div 
            class="project-logo-button"
            role="button"
            tabindex="0"
            on:click={openGallery}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGallery(e); } }}
            title="Click to view gallery"
          >
            <img 
              src={project.logo} 
              alt="{project.title} logo" 
              class="project-logo project-logo--clickable"
            />
            <span class="gallery-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {project.gallery.length}
            </span>
          </div>
        {:else}
          <img 
            src={project.logo} 
            alt="{project.title} logo" 
            class="project-logo"
          />
        {/if}
      {:else}
        <div class="project-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      {/if}
      
      {#if project.featured}
        <span class="project-badge">Featured</span>
      {/if}
    </div>
    
    <h3 class="project-title">{project.title}</h3>
    <p class="project-description">{project.description}</p>
    
    <div class="project-tech">
      {#each project.technologies.slice(0, 4) as tech}
        <span class="tech-tag">{tech}</span>
      {/each}
      {#if project.technologies.length > 4}
        <span class="tech-more">+{project.technologies.length - 4}</span>
      {/if}
    </div>
    
    {#if isExpanded}
      <div class="project-details">
        {#if project.longDescription}
          <p class="project-long-desc">{project.longDescription}</p>
        {/if}
        
        {#if project.impact}
          <div class="project-impact">
            <span class="impact-label">Impact:</span>
            <span class="impact-value">{project.impact}</span>
          </div>
        {/if}
        
        {#if project.technologies.length > 4}
          <div class="project-all-tech">
            <span class="tech-label">All Technologies:</span>
            <div class="tech-list">
              {#each project.technologies as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if project.links}
          <div class="project-links">
            {#if project.links.demo}
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" class="project-link" on:click|stopPropagation>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Demo
              </a>
            {/if}
            {#if project.links.github}
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" class="project-link" on:click|stopPropagation>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
            {/if}
            {#if project.links.article}
              <a href={project.links.article} target="_blank" rel="noopener noreferrer" class="project-link" on:click|stopPropagation>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Article
              </a>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="project-expand">
      <svg 
        class="expand-icon" 
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
  </button>
</div>

{#if showGallery && project.gallery}
  <div 
    class="gallery-overlay" 
    on:click={closeGallery}
    on:keydown={handleGalleryKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="gallery-content" on:click|stopPropagation on:keydown|stopPropagation role="document">
      <button class="gallery-close" on:click={closeGallery} aria-label="Close gallery">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      
      <button class="gallery-nav gallery-nav--prev" on:click={prevImage} aria-label="Previous image">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      
      <div class="gallery-image-container">
        <img 
          src={project.gallery[currentImageIndex].src} 
          alt={project.gallery[currentImageIndex].caption}
          class="gallery-image"
        />
        <p class="gallery-caption">{project.gallery[currentImageIndex].caption}</p>
      </div>
      
      <button class="gallery-nav gallery-nav--next" on:click={nextImage} aria-label="Next image">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      
      <div class="gallery-dots">
        {#each project.gallery as _, i}
          <button 
            class="gallery-dot" 
            class:active={i === currentImageIndex}
            on:click={(e) => { e.stopPropagation(); currentImageIndex = i; }}
            aria-label="Go to image {i + 1}"
          />
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .project-card {
    height: 100%;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .project-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 280px;
    min-width: 0;
    box-sizing: border-box;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .project-content:hover {
    border-color: var(--color-accent);
    background: var(--color-bg-elevated);
    transform: translateY(-4px);
    box-shadow: var(--shadow-warm);
  }
  
  .project-card.expanded .project-content {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-warm);
  }
  
  .project-card.featured .project-content {
    border-left: 3px solid var(--color-accent);
  }
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .project-icon {
    color: var(--color-accent);
  }
  
  .project-logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    object-fit: contain;
    background: var(--color-bg-elevated);
    padding: 4px;
    border: 1px solid var(--color-border);
    transition: all 0.3s ease;
  }
  
  .project-emoji {
    font-size: 2rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;
  }
  
  .project-content:hover .project-emoji {
    transform: scale(1.1);
  }
  
  .project-content:hover .project-logo {
    border-color: var(--color-accent);
    box-shadow: 0 0 12px var(--color-accent-glow);
  }
  
  .project-badge {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 0.25rem 0.5rem;
    background: var(--color-accent-glow);
    color: var(--color-accent);
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .project-title {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.75rem 0;
    transition: color 0.2s ease;
  }
  
  .project-content:hover .project-title {
    color: var(--color-accent);
  }
  
  .project-description {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 1rem 0;
    flex-grow: 1;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .tech-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 0.25rem 0.5rem;
    background: var(--color-bg-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }
  
  .tech-more {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-accent);
  }
  
  .project-details {
    margin-top: 1rem;
    padding-top: 1rem;
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
  
  .project-long-desc {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0 0 1rem 0;
  }
  
  .project-impact {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--color-accent-glow);
    border-radius: var(--radius-sm);
  }
  
  .impact-label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-accent);
  }
  
  .impact-value {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }
  
  .project-all-tech {
    margin-bottom: 1rem;
  }
  
  .tech-label {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }
  
  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .project-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .project-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--text-sm);
    color: var(--color-accent);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }
  
  .project-link:hover {
    background: var(--color-accent);
    color: var(--color-bg-primary);
  }
  
  .project-expand {
    display: flex;
    justify-content: center;
    margin-top: auto;
    padding-top: 0.5rem;
  }
  
  .expand-icon {
    color: var(--color-text-muted);
    transition: transform 0.3s ease, color 0.2s ease;
  }
  
  .expand-icon.rotated {
    transform: rotate(180deg);
  }
  
  .project-content:hover .expand-icon {
    color: var(--color-accent);
  }
  
  /* Gallery button and indicator */
  .project-logo-button {
    position: relative;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  
  .project-logo--clickable {
    cursor: zoom-in;
  }
  
  .project-logo-button:hover .project-logo {
    border-color: var(--color-accent);
    box-shadow: 0 0 12px var(--color-accent-glow);
    transform: scale(1.05);
  }
  
  .gallery-indicator {
    position: absolute;
    bottom: -4px;
    right: -4px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 10px;
    font-weight: 600;
    color: white;
    background: var(--color-accent);
    padding: 2px 5px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  /* Gallery overlay */
  .gallery-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .gallery-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .gallery-close {
    position: absolute;
    top: -50px;
    right: 0;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    opacity: 1;
    transition: all 0.2s ease;
  }
  
  .gallery-close:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .gallery-nav {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 1rem;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .gallery-nav:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .gallery-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 80vw;
    max-height: 80vh;
  }
  
  .gallery-image {
    max-width: 100%;
    max-height: 65vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: var(--radius-md);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .gallery-caption {
    color: white;
    font-size: var(--text-sm);
    text-align: center;
    max-width: 600px;
    opacity: 0.8;
  }
  
  .gallery-dots {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
  }
  
  .gallery-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .gallery-dot:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  .gallery-dot.active {
    background: var(--color-accent);
  }
</style>


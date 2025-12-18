# Portfolio Content Editing Guide

This guide explains how to edit the content on your personal portfolio website.

---

## Table of Contents

- [Experience Timeline](#experience-timeline)
- [Projects Section](#projects-section)
- [Logos & Media](#logos--media)
- [Spotify Embeds](#spotify-embeds-podcasts--playlists)
- [Other Editable Content](#other-editable-content)
- [Quick Reference](#quick-reference)

---

## Experience Timeline

### File Location

```
src/components/TimelineSection.astro
```

### Data Structure

Each experience is an object with the following fields:

```typescript
{
  company: string;        // Company name
  role: string;           // Your job title
  period: string;         // Date range (e.g., "2021 - 2023")
  location?: string;      // Optional - city or "Remote"
  summary: string;        // One-line description (shows when collapsed)
  highlights: string[];   // Bullet points (show when expanded)
  technologies: string[]; // Tech stack tags
  isCurrent?: boolean;    // If true, shows glowing indicator
  logo?: string;          // Optional - path to logo image (e.g., "/logos/company.png")
}
```

### Example Entry

```javascript
{
  company: "Spotify",
  role: "Engineering Group Manager / ML Personalization Lead, Home Construction",
  period: "2021 - 2023",
  location: "Remote",
  summary: "Led multi-disciplinary org powering homepage recommendations for 500M+ users.",
  highlights: [
    "Led Home Construction organization of ~25+ engineers spanning ML, backend, and data engineering",
    "Directly managed platform and feature teams with end-to-end ownership from signal ingestion through deployment",
    "Modernized personalization stack, increasing revenue by $1M+/month and achieving +26% discovery",
    "Partnered with Data Science, ML Research, Product, Design, and Program Management across org boundaries"
  ],
  technologies: ["Python", "TensorFlow", "GCP", "Scala", "Apache Beam", "BigQuery"],
  isCurrent: false
}
```

### Reordering Experiences

The array order determines display order (first item = top of timeline).

To reorder, simply move the entire object block within the `experiences` array:

```javascript
const experiences = [
  { /* This appears first/top */ },
  { /* This appears second */ },
  { /* This appears third */ },
  // ...
];
```

### Tips for Natural-Sounding Descriptions

- **Summary**: Write as a complete sentence that captures the essence of the role
- **Highlights**: Use action verbs and include metrics where possible
- **Keep it scannable**: Each highlight should be 1-2 lines max

---

## Projects Section

### File Location

```
src/components/ProjectsSection.astro
```

### Data Structure

```typescript
{
  title: string;           // Project name
  description: string;     // Short description (visible on card)
  longDescription?: string;// Detailed description (shows when expanded)
  technologies: string[];  // Tech stack tags
  impact?: string;         // Measurable outcome (highlighted box)
  featured?: boolean;      // Shows "Featured" badge if true
  logo?: string;           // Optional - path to logo image (e.g., "/logos/project.png")
  links?: {                // Optional external links
    demo?: string;
    github?: string;
    article?: string;
  }
}
```

### Example Entry

```javascript
{
  title: "Spotify Home Personalization",
  description: "Led the recommendation systems powering Spotify's homepage for 500M+ users.",
  longDescription: "Modernized the personalization and ranking stack, aligning technical investments with company-level metrics. Managed end-to-end ownership from signal ingestion through experimentation and deployment.",
  technologies: ["Python", "TensorFlow", "GCP", "Scala", "Apache Beam", "BigQuery", "Kubernetes"],
  impact: "+$1M/month revenue, +26% discovery, improved retention",
  featured: true
}
```

### Reordering Projects

Same as experiences - array order = display order (left-to-right, top-to-bottom in the grid).

---

## Logos & Media

### Adding Company/Project Logos

Both experience entries and project entries support optional logos that display alongside the title.

### File Location for Logo Images

```
public/logos/
```

All logo images should be placed in the `public/logos/` folder. They'll be served at `/logos/filename.png`.

### Supported Formats

- **PNG** (recommended for logos with transparency)
- **JPG/JPEG**
- **SVG**
- **WebP**

### Recommended Logo Specifications

| Property | Value |
|----------|-------|
| Size | 200×200 px minimum (will be displayed at 48×48 px for experiences, 40×40 px for projects) |
| Aspect ratio | Square (1:1) works best |
| Background | Transparent or solid color that works on both dark and light themes |
| Format | PNG with transparency, or SVG |

### Adding a Logo to an Experience

1. **Save your logo image** to `public/logos/` (e.g., `spotify.png`)

2. **Add the `logo` property** to the experience entry:

```javascript
{
  company: "Spotify",
  role: "Engineering Group Manager",
  period: "2021 - 2023",
  logo: "/logos/spotify.png",  // ← Add this line
  // ... rest of the entry
}
```

### Adding a Logo to a Project

Same process - add the `logo` property:

```javascript
{
  title: "My Project",
  description: "Project description...",
  logo: "/logos/my-project.png",  // ← Add this line
  // ... rest of the entry
}
```

### Logo Display Behavior

- **Experiences**: Logo appears to the left of the company name and role
- **Projects**: Logo replaces the default folder icon in the card header
- **Hover effects**: Logos get a subtle glow effect matching the theme accent color
- **Theme-aware**: Logos are displayed on a slightly elevated background for contrast on both dark and light themes

### Tips

- Use logos with some padding/margin built in for best results
- If a company doesn't have a logo or you prefer not to show one, simply omit the `logo` property
- For stealth/confidential projects, consider using an abstract icon or pattern instead of a real logo

---

## Spotify Embeds (Podcasts & Playlists)

### File Location

```
src/components/PersonalSection.astro
```

### Current Embeds

There are 3 Spotify embeds in the file (around lines 60-90):

1. **Podcast 1** - First podcast recommendation
2. **Podcast 2** - Second podcast recommendation  
3. **Playlist** - Featured playlist

### How to Change an Embed

#### Step 1: Get the Embed URL from Spotify

1. Open Spotify (web or desktop app)
2. Navigate to the podcast or playlist you want to embed
3. Click the **⋯** (three dots) menu
4. Select **Share** → **Embed podcast** (or **Embed playlist**)
5. Copy the embed code
6. Extract the `src="..."` URL from the code

#### Step 2: Update the Component

Find the iframe you want to change and replace the `src` URL:

**Before:**
```html
<iframe 
  src="https://open.spotify.com/embed/show/79CkJF3UJTHFV8Dse3Oy0P?utm_source=generator&theme=0" 
  width="100%" 
  height="152"
  ...
</iframe>
```

**After:**
```html
<iframe 
  src="https://open.spotify.com/embed/show/YOUR_NEW_SHOW_ID?utm_source=generator&theme=0" 
  width="100%" 
  height="152"
  ...
</iframe>
```

### Embed URL Format

| Type | URL Format |
|------|------------|
| Podcast | `https://open.spotify.com/embed/show/SHOW_ID?utm_source=generator&theme=0` |
| Playlist | `https://open.spotify.com/embed/playlist/PLAYLIST_ID?utm_source=generator&theme=0` |
| Album | `https://open.spotify.com/embed/album/ALBUM_ID?utm_source=generator&theme=0` |
| Track | `https://open.spotify.com/embed/track/TRACK_ID?utm_source=generator&theme=0` |

### Changing Labels

Update the text above each embed:

```html
<h4 class="embed__label">🎧 Podcast Pick</h4>
<h4 class="embed__label">🎙️ Another Great Listen</h4>
<h4 class="embed__label">🎵 Playlist Vibes</h4>
```

---

## Other Editable Content

### Hero Section

**File:** `src/components/Hero.astro`

Edit the greeting, name, title, and tagline directly in the HTML:

```html
<span class="hero__greeting">Hey there, I'm</span>
<h1 class="hero__name">Mulloy Morrow</h1>
<h2 class="hero__title">Director / Head of <span class="text-accent">AI & Machine Learning</span></h2>
<p class="hero__tagline">Building AI systems that matter — from personalization at scale to human-centered products</p>
```

### Social Links

**File:** `src/components/SocialLinks.astro`

Update URLs in the `socialLinks` array:

```javascript
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/mulloymorrow', icon: '...' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/mulloymorrow', icon: '...' },
  { name: 'X (Twitter)', url: 'https://x.com/thismulloy', icon: '...' },
  { name: 'Telegram', url: 'https://t.me/mulloy', icon: '...' }
];
```

### Photo Album Link

**File:** `src/components/PersonalSection.astro`

Find and update the Google Photos link:

```html
<a href="https://photos.app.goo.gl/HWs7ZUXZayy6RWZV6" target="_blank" ...>
```

### Colors & Theme

**File:** `src/styles/global.css`

The site uses a **dual-theme system** that transitions as users scroll:

- **Dark Theme** (default) - Shown for Hero, Experience, and Projects sections
- **Warm Theme** - Activates when the "Beyond Work" section comes into view

#### Dark Theme Variables (Default)
```css
:root {
  --color-bg-primary: #0a0a0f;       /* Deep charcoal background */
  --color-accent: #14b8a6;           /* Teal accent */
  --color-text-primary: #e4e4e7;     /* Light text */
}
```

#### Warm Theme Variables (Triggered on scroll)
```css
:root.theme-warm {
  --color-bg-primary: #faf7f2;       /* Cream background */
  --color-accent: #e07b54;           /* Terracotta accent */
  --color-text-primary: #2d3436;     /* Dark text */
}
```

The theme transition is controlled by JavaScript in `src/layouts/Layout.astro` using Intersection Observer.

---

## Quick Reference

| Content | File Location |
|---------|---------------|
| Work Experience | `src/components/TimelineSection.astro` |
| Projects | `src/components/ProjectsSection.astro` |
| Logos & Images | `public/logos/` |
| Spotify Embeds | `src/components/PersonalSection.astro` |
| Hero Section | `src/components/Hero.astro` |
| Social Links | `src/components/SocialLinks.astro` |
| Colors/Theme | `src/styles/global.css` |
| Site Metadata | `src/layouts/Layout.astro` |
| Footer | `src/components/Footer.astro` |

---

## Development Workflow

### Running Locally

```bash
npm run dev
```

The dev server runs at `http://localhost:4321` and hot-reloads when you save changes.

### Building for Production

```bash
npm run build
```

Output goes to the `docs/` folder.

### Deploying

Push to the `main` branch - GitHub Actions will automatically build and deploy to GitHub Pages.

---

## Need Help?

If you get stuck:
1. Check the browser console for errors (Right-click → Inspect → Console)
2. Make sure all quotes and brackets are properly closed
3. The dev server will show syntax errors in the terminal


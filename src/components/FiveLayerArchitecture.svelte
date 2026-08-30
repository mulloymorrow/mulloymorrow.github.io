<script lang="ts">
  let hoveredLayer = $state<number | null>(null);

  const layers = [
    {
      id: 1,
      name: "Input Classification & Triage",
      job: "Classify every turn into a risk class; fire deterministic emergency rules before the LLM runs",
      failure: "Routing a regulated-advice request to a generic-LLM path",
      budget: 95,
      budgetLabel: "Highest",
      note: "The safety system. The LLM never decides which side of the regulated line a request is on.",
      color: "#14b8a6",
    },
    {
      id: 2,
      name: "Retrieval over Vetted Sources",
      job: "Pull passages from a curated, versioned corpus — never rely on parametric LLM knowledge for substantive content",
      failure: "Hallucinated citations, fabricated regulations, outdated rules",
      budget: 72,
      budgetLabel: "Medium-High",
      note: "The only path to substantive content. Every chunk carries provenance.",
      color: "#0ea5e9",
    },
    {
      id: 3,
      name: "Constrained Generation",
      job: "Force cite-or-refuse; schema-enforced output; groundedness verifiers reject unsourced claims",
      failure: "Confident-sounding fabrication; advice that crosses the licensure line",
      budget: 55,
      budgetLabel: "Medium",
      note: "Structurally incapable of producing unsourced substantive content.",
      color: "#6366f1",
    },
    {
      id: 4,
      name: "Refusal & Escalation",
      job: "Detect low confidence, high stakes, or scope violations; route to licensed-professional handoff or emergency contact",
      failure: "Answering when the system shouldn't",
      budget: 85,
      budgetLabel: "High",
      note: "Refusal is warm and specific — not a dead end, but a handoff with context and SLA.",
      color: "#f59e0b",
    },
    {
      id: 5,
      name: "Human-in-the-Loop Expert Review",
      job: "Async licensed-professional queues for flagged, novel, or sampled conversations; edits feed evals",
      failure: "Silent regression; novel-case blindness",
      budget: 38,
      budgetLabel: "Baseline",
      note: "Expert edits are the primary eval signal — more reliable than user thumbs-up.",
      color: "#8b5cf6",
    },
  ];

  const W = 760;
  const ROW_H = 72;
  const GAP = 8;
  const TOTAL_H = layers.length * (ROW_H + GAP) - GAP + 120;
  const BADGE_W = 32;
  const LABEL_X = BADGE_W + 16;
  const BAR_X = 480;
  const BAR_MAX_W = 210;
  const BAR_H = 10;

  function rowY(i: number) {
    return 20 + i * (ROW_H + GAP);
  }
</script>

<div class="diagram-embed five-layer-arch" role="group" aria-label="Five-layer defense architecture diagram">
  <div class="diagram-title">Five-Layer Defense Architecture</div>
  <div class="diagram-subtitle">Hover any layer to see details. Budget bars show relative engineering-reliability investment.</div>
  <svg
    viewBox={`0 0 ${W} ${TOTAL_H}`}
    class="arch-svg"
  >
    <!-- Funnel guide lines -->
    {#each layers as layer, i}
      {@const y = rowY(i)}
      {@const inset = i * 6}
      {@const active = hoveredLayer === layer.id}
      <g
        role="button"
        tabindex="0"
        aria-label={`Layer ${layer.id}: ${layer.name}`}
        onmouseenter={() => hoveredLayer = layer.id}
        onmouseleave={() => hoveredLayer = null}
        onfocus={() => hoveredLayer = layer.id}
        onblur={() => hoveredLayer = null}
        style="cursor: pointer"
      >
        <!-- Row background -->
        <rect
          x={inset}
          y={y}
          width={BAR_X - 16 - inset}
          height={ROW_H}
          rx="6"
          fill={active ? `${layer.color}18` : '#1a1a22'}
          stroke={active ? layer.color : '#2a2a35'}
          stroke-width={active ? 1.5 : 1}
          style="transition: all 0.2s"
        />

        <!-- Layer number badge -->
        <rect
          x={inset + 8}
          y={y + (ROW_H - 28) / 2}
          width="28"
          height="28"
          rx="6"
          fill={active ? layer.color : `${layer.color}30`}
          style="transition: fill 0.2s"
        />
        <text
          x={inset + 22}
          y={y + (ROW_H - 28) / 2 + 18}
          text-anchor="middle"
          font-size="13"
          font-weight="700"
          font-family="var(--font-mono, monospace)"
          fill={active ? '#0a0a0f' : layer.color}
          style="transition: fill 0.2s"
        >L{layer.id}</text>

        <!-- Layer name -->
        <text
          x={inset + LABEL_X + 8}
          y={y + 22}
          font-size="12.5"
          font-weight="600"
          font-family="var(--font-sans, system-ui)"
          fill={active ? '#e4e4e7' : '#a1a1aa'}
          style="transition: fill 0.2s"
        >{layer.name}</text>

        <!-- Layer job (truncated) -->
        <foreignObject
          x={inset + LABEL_X + 8}
          y={y + 28}
          width={BAR_X - 16 - inset - LABEL_X - 20}
          height="34"
        >
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:10.5px; line-height:1.4; color:#71717a; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            {layer.job}
          </div>
        </foreignObject>

        <!-- Budget bar track -->
        <rect
          x={BAR_X}
          y={y + (ROW_H - BAR_H) / 2}
          width={BAR_MAX_W}
          height={BAR_H}
          rx={BAR_H / 2}
          fill="#2a2a35"
        />
        <!-- Budget bar fill -->
        <rect
          x={BAR_X}
          y={y + (ROW_H - BAR_H) / 2}
          width={active ? (BAR_MAX_W * layer.budget) / 100 : (BAR_MAX_W * layer.budget) / 100}
          height={BAR_H}
          rx={BAR_H / 2}
          fill={layer.color}
          opacity={active ? 1 : 0.6}
          style="transition: opacity 0.2s"
        />
        <!-- Budget label -->
        <text
          x={BAR_X + BAR_MAX_W + 8}
          y={y + ROW_H / 2 + 4}
          font-size="10"
          font-weight="600"
          font-family="var(--font-mono, monospace)"
          fill={active ? layer.color : '#52525b'}
          style="transition: fill 0.2s"
        >{layer.budgetLabel}</text>
      </g>
    {/each}

    <!-- Right column header -->
    <text
      x={BAR_X + BAR_MAX_W / 2}
      y="12"
      text-anchor="middle"
      font-size="9"
      font-weight="600"
      letter-spacing="0.12em"
      text-transform="uppercase"
      font-family="var(--font-mono, monospace)"
      fill="#52525b"
    >RELIABILITY BUDGET</text>

    <!-- Annotation -->
    {#if hoveredLayer}
      {@const layer = layers[hoveredLayer - 1]}
      {@const y = rowY(hoveredLayer - 1)}
      <rect
        x="8"
        y={TOTAL_H - 70}
        width={W - 16}
        height="58"
        rx="6"
        fill={`${layer.color}12`}
        stroke={`${layer.color}40`}
        stroke-width="1"
      />
      <text
        x="20"
        y={TOTAL_H - 50}
        font-size="11"
        font-weight="600"
        font-family="var(--font-sans, system-ui)"
        fill={layer.color}
      >Failure prevented: {layer.failure}</text>
      <foreignObject x="20" y={TOTAL_H - 44} width={W - 40} height="32">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:10.5px; line-height:1.5; color:#a1a1aa;">
          {layer.note}
        </div>
      </foreignObject>
    {:else}
      <rect
        x="8"
        y={TOTAL_H - 70}
        width={W - 16}
        height="58"
        rx="6"
        fill="#14b8a610"
        stroke="#14b8a625"
        stroke-width="1"
      />
      <text
        x={W / 2}
        y={TOTAL_H - 46}
        text-anchor="middle"
        font-size="11"
        font-weight="600"
        font-family="var(--font-sans, system-ui)"
        fill="#14b8a6"
      >Reliability budget concentrates on L1 and L4</text>
      <text
        x={W / 2}
        y={TOTAL_H - 28}
        text-anchor="middle"
        font-size="10.5"
        font-family="var(--font-sans, system-ui)"
        fill="#71717a"
      >They decide whether L2–L3 run at all. A perfect generation pipeline that fires on the wrong request is a worse failure than a refusal.</text>
    {/if}
  </svg>
</div>

<style>
  .diagram-embed {
    background: #0d0d14;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #2a2a35;
  }

  .diagram-title {
    padding: 16px 20px 2px;
    font-size: 13px;
    font-weight: 700;
    color: #e4e4e7;
    letter-spacing: 0.02em;
    font-family: var(--font-sans, system-ui);
  }

  .diagram-subtitle {
    padding: 0 20px 10px;
    font-size: 11px;
    color: #52525b;
    font-family: var(--font-sans, system-ui);
  }

  .arch-svg {
    display: block;
    width: 100%;
    padding: 0 12px 12px;
  }
</style>

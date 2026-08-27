<script lang="ts">
  type Industry = 'healthcare' | 'legal' | 'financial';
  interface Props { industry: Industry; }
  let { industry }: Props = $props();

  let activeFlow = $state<'education' | 'emergency'>('education');

  type IndustryData = {
    label: string;
    accentColor: string;
    emergencyRequest: string;
    educationRequest: string;
    emergencyL1Label: string;
    emergencyOutcome: string;
    emergencyExpert: string;
    educationL1Label: string;
    educationL2Label: string;
    educationL3Label: string;
    educationL4Label: string;
    budget: { layer: string; label: string; value: number; note: string }[];
  };

  const DATA: Record<Industry, IndustryData> = {
    healthcare: {
      label: 'Consumer Healthcare',
      accentColor: '#14b8a6',
      emergencyRequest: '"I\'m 32 weeks, pounding headache, seeing spots"',
      educationRequest: '"Is Zoloft safe while breastfeeding?"',
      emergencyL1Label: 'EMERGENCY_911_OR_LD fires',
      emergencyOutcome: 'Templated 911 / L&D screen',
      emergencyExpert: 'On-call clinician paged',
      educationL1Label: 'drug_safety + lactation',
      educationL2Label: 'LactMed / MotherToBaby',
      educationL3Label: 'Cited education, no dosing',
      educationL4Label: 'Clinician handoff offered',
      budget: [
        { layer: 'L1', label: 'Input Classification', value: 95, note: 'Catastrophic miss = bad maternal outcome. ACOG red-flag rules, IPV + self-harm detectors.' },
        { layer: 'L2', label: 'Retrieval', value: 75, note: 'MotherToBaby, LactMed, ACOG guidelines are load-bearing. Corpus freshness is a safety requirement.' },
        { layer: 'L3', label: 'Constrained Generation', value: 55, note: 'diagnosis_made: false and dosing_provided: false are structural invariants, not style guidelines.' },
        { layer: 'L4', label: 'Refusal & Escalation', value: 82, note: 'IPV safe-exit UX, self-harm → 988 + PSI, drug-safety → mandatory handoff. State-licensed clinician routing.' },
        { layer: 'L5', label: 'Human Review', value: 70, note: 'Mandatory review for every emergency + IPV + drug-safety turn. Medical director signs off on protocols.' },
      ],
    },
    legal: {
      label: 'Consumer Legal Advice',
      accentColor: '#6366f1',
      emergencyRequest: '"Got an eviction notice. Hearing is in 5 days."',
      educationRequest: '"What\'s the difference between an LLC and S-corp?"',
      emergencyL1Label: 'URGENT_ATTORNEY_HANDOFF fires',
      emergencyOutcome: 'Tenant-rights legal aid + 5-day clock UI',
      emergencyExpert: 'Partner attorney paged for callback',
      educationL1Label: 'education + business_formation',
      educationL2Label: 'IRS pubs, state sources (no triage)',
      educationL3Label: 'Cited info, jurisdiction_assumed surfaced',
      educationL4Label: 'Attorney handoff offered, not forced',
      budget: [
        { layer: 'L1', label: 'Input Classification', value: 90, note: 'Deadline extraction, jurisdiction tagging, and government-action detection are safety-critical — not UX features.' },
        { layer: 'L2', label: 'Retrieval', value: 92, note: 'Jurisdiction partitioning is the highest-risk corpus decision. CA tenant citing TX statute is almost always wrong.' },
        { layer: 'L3', label: 'Constrained Generation', value: 58, note: 'No application of law to specific facts. Citation verifier resolves every cite against corpus — Mata v. Avianca prevention.' },
        { layer: 'L4', label: 'Refusal & Escalation', value: 68, note: 'Criminal, immigration, custody → mandatory attorney handoff. State bar admission check on routing.' },
        { layer: 'L5', label: 'Human Review', value: 55, note: 'Attorney edits are the eval signal. Mandatory review for imminent-deadline and active-litigation turns.' },
      ],
    },
    financial: {
      label: 'Consumer Financial Advice',
      accentColor: '#f59e0b',
      emergencyRequest: '"Margin call notification. Don\'t have the cash."',
      educationRequest: '"What\'s the difference between Roth and traditional IRA?"',
      emergencyL1Label: 'EMERGENCY_DISTRESS_PROTOCOL fires',
      emergencyOutcome: '988 + NFCC + fiduciary advisor SLA',
      emergencyExpert: 'Advisor-of-record paged within 4h',
      educationL1Label: 'education + retirement_accounts',
      educationL2Label: 'IRS Pub. 590-A/B, SEC investor.gov',
      educationL3Label: 'Cited facts, no personalized advice',
      educationL4Label: 'Advisor handoff offered, not forced',
      budget: [
        { layer: 'L1', label: 'Input Classification', value: 85, note: 'Distress detection (financial loss + suicidal ideation correlation) is non-optional. Options/leverage + novice = hard stop.' },
        { layer: 'L2', label: 'Retrieval', value: 65, note: 'Fast-tier recency for market data (sub-hour staleness). Evergreen education tier is slower. Two-speed pipeline required.' },
        { layer: 'L3', label: 'Constrained Generation', value: 62, note: 'recommendation_made: false is a structural invariant. No performance forecasts. No directional calls. Banned-phrase guardrails.' },
        { layer: 'L4', label: 'Refusal & Escalation', value: 80, note: 'Suitability creep (risk-tolerance + portfolio mix) walks into Reg BI territory. Distress → 988 alongside any financial response.' },
        { layer: 'L5', label: 'Human Review', value: 58, note: '10–15% sampling on any turn naming a specific security, even if classified education. Registered adviser of record signs protocols.' },
      ],
    },
  };

  const d = $derived(DATA[industry]);
  const accent = $derived(d.accentColor);

  let hoveredBudget = $state<number | null>(null);

  // Flow diagram layout constants
  const FW = 340;
  const FH = 280;
  const NODE_W = 200;
  const NODE_H = 32;
  const NODE_X = (FW - NODE_W) / 2;

  // Education flow nodes
  const EDU_NODES = [
    { id: 'req', label: '', isReq: true, y: 8 },
    { id: 'l1', label: '', y: 60 },
    { id: 'l2', label: 'L2  Retrieval', y: 108 },
    { id: 'l3', label: 'L3  Generation', y: 156 },
    { id: 'l4', label: 'L4  Refusal gate', y: 204 },
    { id: 'ans', label: 'Cited answer + handoff offered', isAns: true, y: 248 },
  ];

  const EMG_NODES = [
    { id: 'req', label: '', isReq: true, y: 8 },
    { id: 'l1', label: '', y: 60 },
    { id: 'bypass', label: '', isBypass: true, y: 128 },
    { id: 'expert', label: '', isExpert: true, y: 208 },
  ];
</script>

<div class="diagram-embed industry-flow" style={`--accent: ${accent}`}>
  <div class="diagram-header">
    <span class="diagram-industry-label">{d.label}</span>
    <div class="flow-tabs" role="tablist">
      <button
        role="tab"
        aria-selected={activeFlow === 'education'}
        class:active={activeFlow === 'education'}
        onclick={() => activeFlow = 'education'}
      >Education flow</button>
      <button
        role="tab"
        aria-selected={activeFlow === 'emergency'}
        class:active={activeFlow === 'emergency'}
        onclick={() => activeFlow = 'emergency'}
      >Emergency bypass</button>
    </div>
  </div>

  <div class="diagram-body">
    <!-- Left: Flow diagram -->
    <div class="flow-panel">
      {#if activeFlow === 'education'}
        <svg viewBox={`0 0 ${FW} ${FH}`} class="flow-svg" aria-label="Education request flow">
          <!-- Request node -->
          <rect x={NODE_X} y={EDU_NODES[0].y} width={NODE_W} height={NODE_H + 6} rx="6"
            fill={`${accent}18`} stroke={accent} stroke-width="1.5"/>
          <foreignObject x={NODE_X + 6} y={EDU_NODES[0].y + 2} width={NODE_W - 12} height={NODE_H + 2}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={`font-size:9.5px; line-height:1.35; color:${accent}; font-style:italic; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;`}>
              {d.educationRequest}
            </div>
          </foreignObject>

          <!-- Arrow req → l1 -->
          <line x1={FW/2} y1={EDU_NODES[0].y + NODE_H + 6} x2={FW/2} y2={EDU_NODES[1].y} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- L1 node -->
          <rect x={NODE_X} y={EDU_NODES[1].y} width={NODE_W} height={NODE_H + 6} rx="6" fill="#1a1a22" stroke="#14b8a6" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={EDU_NODES[1].y + 14} font-size="10" font-weight="700" font-family="monospace" fill="#14b8a6">L1</text>
          <foreignObject x={NODE_X + 28} y={EDU_NODES[1].y + 4} width={NODE_W - 34} height={NODE_H}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#a1a1aa; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.educationL1Label}
            </div>
          </foreignObject>

          <!-- Arrow l1 → l2 -->
          <line x1={FW/2} y1={EDU_NODES[1].y + NODE_H + 6} x2={FW/2} y2={EDU_NODES[2].y} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- L2 node -->
          <rect x={NODE_X} y={EDU_NODES[2].y} width={NODE_W} height={NODE_H + 4} rx="6" fill="#1a1a22" stroke="#0ea5e9" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={EDU_NODES[2].y + 14} font-size="10" font-weight="700" font-family="monospace" fill="#0ea5e9">L2</text>
          <foreignObject x={NODE_X + 28} y={EDU_NODES[2].y + 4} width={NODE_W - 34} height={NODE_H}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#a1a1aa; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.educationL2Label}
            </div>
          </foreignObject>

          <!-- Arrow l2 → l3 -->
          <line x1={FW/2} y1={EDU_NODES[2].y + NODE_H + 4} x2={FW/2} y2={EDU_NODES[3].y} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- L3 node -->
          <rect x={NODE_X} y={EDU_NODES[3].y} width={NODE_W} height={NODE_H + 4} rx="6" fill="#1a1a22" stroke="#6366f1" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={EDU_NODES[3].y + 14} font-size="10" font-weight="700" font-family="monospace" fill="#6366f1">L3</text>
          <foreignObject x={NODE_X + 28} y={EDU_NODES[3].y + 4} width={NODE_W - 34} height={NODE_H}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#a1a1aa; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.educationL3Label}
            </div>
          </foreignObject>

          <!-- Arrow l3 → l4 -->
          <line x1={FW/2} y1={EDU_NODES[3].y + NODE_H + 4} x2={FW/2} y2={EDU_NODES[4].y} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- L4 node -->
          <rect x={NODE_X} y={EDU_NODES[4].y} width={NODE_W} height={NODE_H + 4} rx="6" fill="#1a1a22" stroke="#f59e0b" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={EDU_NODES[4].y + 14} font-size="10" font-weight="700" font-family="monospace" fill="#f59e0b">L4</text>
          <foreignObject x={NODE_X + 28} y={EDU_NODES[4].y + 4} width={NODE_W - 34} height={NODE_H}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#a1a1aa; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.educationL4Label}
            </div>
          </foreignObject>

          <!-- Arrow l4 → answer -->
          <line x1={FW/2} y1={EDU_NODES[4].y + NODE_H + 4} x2={FW/2} y2={EDU_NODES[5].y} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- Answer node -->
          <rect x={NODE_X} y={EDU_NODES[5].y} width={NODE_W} height={NODE_H} rx="6" fill={`${accent}18`} stroke={`${accent}60`} stroke-width="1"/>
          <foreignObject x={NODE_X + 6} y={EDU_NODES[5].y + 4} width={NODE_W - 12} height={NODE_H}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={`font-size:9.5px; line-height:1.35; color:${accent}; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;`}>
              {d.educationL3Label}
            </div>
          </foreignObject>

          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#3f3f46"/>
            </marker>
          </defs>
        </svg>
      {:else}
        <svg viewBox={`0 0 ${FW} ${FH}`} class="flow-svg" aria-label="Emergency bypass flow">
          <!-- Request node -->
          <rect x={NODE_X} y={8} width={NODE_W} height={NODE_H + 6} rx="6"
            fill="#ef444418" stroke="#ef4444" stroke-width="1.5"/>
          <foreignObject x={NODE_X + 6} y={10} width={NODE_W - 12} height={NODE_H + 2}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#ef4444; font-style:italic; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.emergencyRequest}
            </div>
          </foreignObject>

          <!-- Arrow -->
          <line x1={FW/2} y1={50} x2={FW/2} y2={60} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow-emg)"/>

          <!-- L1 fires -->
          <rect x={NODE_X} y={60} width={NODE_W} height={42} rx="6" fill="#ef444418" stroke="#ef4444" stroke-width="2"/>
          <text x={NODE_X + 10} y={76} font-size="10" font-weight="700" font-family="monospace" fill="#ef4444">L1</text>
          <foreignObject x={NODE_X + 28} y={64} width={NODE_W - 34} height={36}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#fca5a5; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.emergencyL1Label}
            </div>
          </foreignObject>

          <!-- Bypass arrow -->
          <line x1={FW/2} y1={102} x2={FW/2} y2={118} stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-emg)"/>

          <!-- Bypass label -->
          <text x={FW/2 + 8} y={113} font-size="9" font-family="monospace" fill="#ef4444">bypasses L2–L3</text>

          <!-- L4 bypass node -->
          <rect x={NODE_X} y={118} width={NODE_W} height={42} rx="6" fill="#f59e0b18" stroke="#f59e0b" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={135} font-size="10" font-weight="700" font-family="monospace" fill="#f59e0b">L4</text>
          <foreignObject x={NODE_X + 28} y={122} width={NODE_W - 34} height={36}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#fde68a; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.emergencyOutcome}
            </div>
          </foreignObject>

          <!-- Arrow -->
          <line x1={FW/2} y1={160} x2={FW/2} y2={178} stroke="#3f3f46" stroke-width="1.5" marker-end="url(#arrow-emg)"/>

          <!-- L5 / expert -->
          <rect x={NODE_X} y={178} width={NODE_W} height={42} rx="6" fill="#8b5cf618" stroke="#8b5cf6" stroke-width="1.5"/>
          <text x={NODE_X + 10} y={195} font-size="10" font-weight="700" font-family="monospace" fill="#8b5cf6">L5</text>
          <foreignObject x={NODE_X + 28} y={182} width={NODE_W - 34} height={36}>
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px; line-height:1.35; color:#c4b5fd; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              {d.emergencyExpert}
            </div>
          </foreignObject>

          <!-- No LLM label -->
          <rect x={NODE_X} y={232} width={NODE_W} height={24} rx="4" fill="#3f3f46"/>
          <text x={FW/2} y={248} text-anchor="middle" font-size="9.5" font-family="monospace" fill="#71717a">LLM writes wrapper text only — no generation</text>

          <defs>
            <marker id="arrow-emg" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#3f3f46"/>
            </marker>
          </defs>
        </svg>
      {/if}
    </div>

    <!-- Right: Budget allocation -->
    <div class="budget-panel">
      <div class="budget-title">Reliability Budget Allocation</div>
      {#each d.budget as item, i}
        {@const isHovered = hoveredBudget === i}
        <div
          class="budget-row"
          class:hovered={isHovered}
          onmouseenter={() => hoveredBudget = i}
          onmouseleave={() => hoveredBudget = null}
          role="button"
          tabindex="0"
          onfocus={() => hoveredBudget = i}
          onblur={() => hoveredBudget = null}
          aria-label={`${item.layer} ${item.label}: ${item.value}%`}
        >
          <div class="budget-row-header">
            <span class="budget-layer-badge">{item.layer}</span>
            <span class="budget-layer-name">{item.label}</span>
            <span class="budget-pct">{item.value}%</span>
          </div>
          <div class="budget-bar-track">
            <div class="budget-bar-fill" style={`width: ${item.value}%`}></div>
          </div>
          {#if isHovered}
            <div class="budget-note">{item.note}</div>
          {/if}
        </div>
      {/each}
      <div class="budget-footer">Hover a layer for the rationale. Values are relative engineering-reliability investment, not wall-clock time.</div>
    </div>
  </div>
</div>

<style>
  .diagram-embed {
    background: #0d0d14;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #2a2a35;
    margin: 0;
  }

  .diagram-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px 10px;
    border-bottom: 1px solid #1e1e2a;
    flex-wrap: wrap;
    gap: 8px;
  }

  .diagram-industry-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: var(--font-mono, monospace);
  }

  .flow-tabs {
    display: flex;
    gap: 4px;
  }

  .flow-tabs button {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid #2a2a35;
    background: transparent;
    color: #71717a;
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font-sans, system-ui);
  }

  .flow-tabs button.active,
  .flow-tabs button:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #0a0a0f;
  }

  .diagram-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .flow-panel {
    padding: 12px;
    border-right: 1px solid #1e1e2a;
  }

  .flow-svg {
    display: block;
    width: 100%;
  }

  .budget-panel {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .budget-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #52525b;
    margin-bottom: 4px;
    font-family: var(--font-mono, monospace);
  }

  .budget-row {
    cursor: pointer;
    border-radius: 6px;
    padding: 6px 8px;
    transition: background 0.15s;
    border: 1px solid transparent;
  }

  .budget-row:hover,
  .budget-row.hovered {
    background: #1a1a22;
    border-color: #2a2a35;
  }

  .budget-row-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .budget-layer-badge {
    font-size: 9px;
    font-weight: 700;
    font-family: var(--font-mono, monospace);
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    padding: 1px 5px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .budget-layer-name {
    font-size: 10.5px;
    color: #a1a1aa;
    flex: 1;
    font-family: var(--font-sans, system-ui);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .budget-pct {
    font-size: 10px;
    font-weight: 700;
    font-family: var(--font-mono, monospace);
    color: #52525b;
    flex-shrink: 0;
  }

  .budget-bar-track {
    height: 5px;
    background: #2a2a35;
    border-radius: 3px;
    overflow: hidden;
  }

  .budget-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.3s ease;
    opacity: 0.7;
  }

  .budget-row.hovered .budget-bar-fill {
    opacity: 1;
  }

  .budget-note {
    font-size: 10px;
    color: #71717a;
    line-height: 1.4;
    margin-top: 5px;
    font-family: var(--font-sans, system-ui);
  }

  .budget-footer {
    font-size: 9.5px;
    color: #3f3f46;
    margin-top: auto;
    padding-top: 6px;
    line-height: 1.4;
    font-family: var(--font-sans, system-ui);
  }

  @media (max-width: 600px) {
    .diagram-body {
      grid-template-columns: 1fr;
    }
    .flow-panel {
      border-right: none;
      border-bottom: 1px solid #1e1e2a;
    }
  }
</style>

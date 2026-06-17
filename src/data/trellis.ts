export type TrellisCard = {
  type: string;
  tier: string;
  tag: string;
  data: Record<string, any>;
};

export type TrellisJourneyItem = {
  week?: string;
  title: string;
  detail?: string;
  kind?: string;
  id?: string;
  when?: string;
  sub?: string;
  conf?: string;
  gap?: boolean;
  source?: string;
};

export type TrellisPersona = {
  id: string;
  name: string;
  first: string;
  stageLabel: string;
  switcherStory: string;
  greeting: string;
  eyebrow: string;
  moatNote: string;
  feed: TrellisCard[];
  journey: {
    behind: TrellisJourneyItem[];
    here: {
      week: string;
      stage: string;
      chart?: string;
      inflight: Array<{ label: string; sub: string }>;
    };
    ahead: TrellisJourneyItem[];
  };
};

const asset = (path: string) => `/trellis/assets/${path}`;

export const trellisPersonas: Record<string, TrellisPersona> = {
  nina: {
    id: 'nina',
    name: 'Nina Williams',
    first: 'Nina',
    stageLabel: 'Pregnancy · Week 32',
    switcherStory: 'Nina, 34 — 18 weeks of record. Tier 1 dominates.',
    greeting: 'Good morning, Nina',
    eyebrow: 'Tuesday · Week 32',
    moatNote: '9 visits · 23 questions · 41 data points accumulated',
    feed: [
      { type: 'followup', tier: 't1', tag: '1.2 Follow-up', data: { eyebrow: 'We remembered', headline: 'Two weeks ago you mentioned round ligament pain.', sub: 'How is it feeling now?', why: 'From your conversation, May 27', responses: ['Better', 'Same', 'Worse'], escalation: 'Thanks for telling us. We’ve routed this to your care team — a nurse will follow up today.', ack: 'Noted in your symptom history. We’ll keep an eye on it together.' } },
      { type: 'trend', tier: 't1', tag: '1.1 Trend', data: { eyebrow: 'Your story in data', headline: 'Your blood pressure has stayed in a healthy range across your last 5 visits.', series: [112, 114, 110, 116, 113], labels: ['WK 16', 'WK 20', 'WK 24', 'WK 28', 'WK 31'], unit: 'systolic · mmHg', freshness: 'As of your May 28 visit', why: 'Your EHR · 5 visit vitals' } },
      { type: 'apptprep', tier: 't1', tag: '1.3 Appt prep', data: { eyebrow: 'Visit prep', title: 'Your 32-week visit is Thursday, 10:30', sub: 'Worth asking:', clinician: 'Dr. Amara Bollag', items: ['Follow up on the ferritin result from your May labs', 'Round ligament pain — pattern since week 30', 'Tdap timing — your window is open now'], cta: 'Open visit prep', why: 'Your appointments + lab history' } },
      { type: 'screening', tier: 't2', tag: '2.2 Screening', data: { eyebrow: 'Recommended for you', title: 'Tdap is recommended between weeks 27–36', sub: 'You’re at 32 and it isn’t on your record yet.', window: { lo: 27, hi: 36, now: 32 }, source: 'ACIP / ACOG guidance', journeyId: 'tdap', why: 'Screening schedule + your EHR' } },
      { type: 'drugsafety', tier: 't1', tag: '1.4 Drug safety', data: { eyebrow: 'From your med list', med: 'Sumatriptan', title: 'What MotherToBaby says about sumatriptan in the third trimester', citation: 'MotherToBaby fact sheet · reviewed Apr 2026', disclaimer: 'Never a dose recommendation — always discuss changes with your care team.', cta: 'Add to visit questions', why: 'Your med list × week 32' } },
      { type: 'knowledge', tier: 't2', tag: '2.1 Stage-aware ed', data: { eyebrow: 'Worth knowing', title: 'Why iron needs nearly double in the third trimester', sub: 'Your ferritin is below your first-trimester baseline.', img: asset('illustrations/data-graph.png'), mins: '4 min', reviewed: 'UW Medicine OB' } },
      { type: 'careteam', tier: 't2', tag: '2.4 Care team', data: { eyebrow: 'Your care team', name: 'Renata Osei, RN', note: 'Reviewed your question from last night about breathlessness on stairs: “Usually normal at 32 weeks. Mention it Thursday if it happens at rest.”', when: 'Reviewed 7:42 AM' } },
      { type: 'weekly', tier: 't3', tag: '3.1 Weekly', data: { eyebrow: 'Week 32', title: 'About 1.7 kg, and practicing breathing', mins: '2 min' } },
      { type: 'feedback', tier: 't4', tag: '4.2 Feedback', data: { prompt: 'Was today’s feed useful?' } },
    ],
    journey: {
      behind: [
        { week: 'WK 31', title: 'Labs returned', detail: 'Ferritin 18 ng/mL · recheck planned', kind: 'lab' },
        { week: 'WK 30', title: 'Symptom thread opened', detail: 'Round ligament pain · follow-up active', kind: 'symptom' },
        { week: 'WK 28', title: 'Prenatal visit', detail: 'Glucose screen clear · BP 116/74', kind: 'visit' },
        { week: 'WK 24', title: 'Prenatal visit', detail: 'Anatomy follow-up complete', kind: 'visit' },
        { week: 'WK 20', title: 'Anatomy ultrasound', detail: 'All structures reviewed', kind: 'visit' },
        { week: 'WK 9–18', title: '4 earlier visits · 12 questions answered', detail: 'Tap to expand your full record', kind: 'group' },
      ],
      here: {
        week: 'Week 32',
        stage: 'Third trimester',
        inflight: [
          { label: 'Ferritin recheck', sub: 'Pending — order placed May 28' },
          { label: 'Open follow-up', sub: 'Round ligament pain · checking in today' },
        ],
      },
      ahead: [
        { id: 'visit32', when: 'THU · WK 32', title: 'Prenatal visit · Dr. Bollag', sub: '3 prep questions saved', conf: 'scheduled' },
        { id: 'tdap', when: 'WK 27–36', title: 'Tdap vaccination window', sub: 'Open now — not yet on your record', conf: 'recommended', gap: true, source: 'ACIP / ACOG' },
        { id: 'gbs', when: 'WK 36–37', title: 'GBS swab', sub: 'Routine screening window', conf: 'recommended', source: 'ACOG' },
        { id: 'weeklies', when: 'FROM WK 36', title: 'Visits become weekly', sub: 'Common around this stage', conf: 'typical' },
        { id: 'birthprefs', when: 'BY WK 36', title: 'Birth preferences', sub: 'Worth preparing — start with the agent', conf: 'decision' },
      ],
    },
  },
  sasha: {
    id: 'sasha',
    name: 'Sasha Romero',
    first: 'Sasha',
    stageLabel: 'Day 1 · Week 6',
    switcherStory: 'Sasha, 29 — joined today. Cold start, honest feed.',
    greeting: 'Welcome, Sasha',
    eyebrow: 'Tuesday · 6 weeks, 3 days',
    moatNote: 'Day 1 — 2 imported lab draws. The record starts here.',
    feed: [
      { type: 'coldstart', tier: 't4', tag: '4.x Cold start', data: { eyebrow: 'Getting started', headline: 'The more we learn, the more useful this gets.', slots: [{ label: 'Due date', filled: true }, { label: 'Lab history', filled: true }, { label: 'Health record', filled: false }, { label: 'Conversations', filled: false }] } },
      { type: 'journeylink', tier: 't4', tag: 'Onboarding', data: { eyebrow: 'Your map is ready', title: 'See where you are — and what the next 8 weeks hold', sub: 'Your two hCG draws are already plotted on your timeline.', cta: 'Open your journey' } },
      { type: 'knowledge', tier: 't2', tag: '2.1 Stage-aware ed', data: { eyebrow: 'Worth knowing', title: 'Week 6: what’s typical, what’s worth a call', img: asset('illustrations/data-cycle.png'), mins: '5 min', reviewed: 'UW Medicine OB' } },
      { type: 'checkin', tier: 't2', tag: '2.3 Check-in', data: { eyebrow: 'Check-in', title: 'Anything new today?', sub: 'Nausea questions tend to spike around now.', cta: 'Tell the agent' } },
      { type: 'weekly', tier: 't3', tag: '3.1 Weekly', data: { eyebrow: 'Week 6', title: 'About the size of a lentil', mins: '2 min' } },
    ],
    journey: {
      behind: [
        { week: 'TODAY', title: 'Your record starts here', detail: 'Onboarding complete · profile created', kind: 'milestone' },
        { week: '5W 4D', title: 'hCG draw · 6,100 mIU/mL', detail: 'Imported from your clinic', kind: 'lab' },
        { week: '5W 1D', title: 'hCG draw · 2,400 mIU/mL', detail: 'Imported from your clinic', kind: 'lab' },
        { title: 'Trellis fills this in week over week', detail: 'Visits, labs, questions, symptoms — your accumulating record', kind: 'empty' },
      ],
      here: {
        week: '6 weeks, 3 days',
        stage: 'First trimester',
        chart: 'hcg',
        inflight: [],
      },
      ahead: [
        { id: 'dating', when: 'WK 8 · JUN 24', title: 'Dating ultrasound', sub: 'Scheduled at Cedar Women’s Clinic', conf: 'scheduled' },
        { id: 'firstvisit', when: 'WK 9 · JUL 1', title: 'First prenatal visit', sub: 'Intake, history, labs', conf: 'scheduled' },
        { id: 'nipt', when: 'WK 10–13', title: 'NIPT screening window', sub: 'Optional — worth deciding before week 10', conf: 'recommended', source: 'ACOG' },
        { id: 'nausea', when: '~WK 9', title: 'Nausea often peaks', sub: 'Common around this stage', conf: 'typical' },
        { id: 'provider', when: 'BY WK 10', title: 'OB or midwife?', sub: 'A decision worth preparing for', conf: 'decision' },
      ],
    },
  },
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    first: 'Maya',
    stageLabel: 'Postpartum · Week 6',
    switcherStory: 'Maya, 31 — the record carries forward past birth.',
    greeting: 'Good morning, Maya',
    eyebrow: 'Thursday · 6 weeks postpartum',
    moatNote: '40 weeks of pregnancy record, carried into postpartum',
    feed: [
      { type: 'continuity', tier: 't1', tag: '1.6 Continuity', data: { eyebrow: 'Carried forward', headline: 'At your 36-week visit you said you wanted to breastfeed.', person: { name: 'Leah Whitfield, IBCLC', role: 'Lactation consultant · your care team', cta: 'Message' }, why: 'Your 36-week visit notes' } },
      { type: 'debrief', tier: 't1', tag: '1.3 Debrief', data: { eyebrow: 'Visit debrief', title: 'Your 6-week visit, in plain language', sub: 'Healing is on track. Your EPDS screen was reviewed with Dr. Okafor; one care-plan item changed:', change: 'Pelvic-floor PT referral added — recommended window opens now.', reviewed: 'Clinician-reviewed summary', why: 'Yesterday’s visit notes' } },
      { type: 'followup', tier: 't1', tag: '1.2 Follow-up', data: { eyebrow: 'We remembered', headline: 'Last week you mentioned sleep was the hardest part.', sub: 'You were averaging three stretches a night. How has this week felt?', why: 'From your conversation, Jun 2', responses: ['Better', 'Same', 'Worse'], escalation: 'Thanks for telling us. Persistent exhaustion matters — we’ve flagged this for your care team to follow up today.', ack: 'Logged. Your sleep pattern stays part of your record.' } },
      { type: 'milestone', tier: 't1', tag: '1.5 Milestone', data: { eyebrow: 'Six weeks in', headline: 'Looking back at your fourth trimester so far', stats: [{ value: '11', label: 'visits across pregnancy + postpartum' }, { value: '31', label: 'questions answered' }, { value: '2', label: 'symptom threads resolved' }], cta: 'See your path ahead' } },
      { type: 'careteam', tier: 't2', tag: '2.4 Care team', data: { eyebrow: 'Your care team', name: 'Renata Osei, RN', note: 'Reviewed your 2 AM question about cluster feeding: “Very common at 6 weeks — often a growth spurt. Leah can help if it persists past a few days.”', when: 'Reviewed 6:15 AM' } },
      { type: 'knowledge', tier: 't2', tag: '2.1 Stage-aware ed', data: { eyebrow: 'Worth knowing', title: 'Returning to exercise after birth — where to start', sub: 'Vaginal delivery, PT referral in place.', img: asset('illustrations/frame-postpartum.png'), mins: '6 min', reviewed: 'UW Medicine OB' } },
      { type: 'weekly', tier: 't3', tag: '3.1 Weekly', data: { eyebrow: 'Baby · Week 6', title: 'First social smiles often arrive now', mins: '2 min' } },
    ],
    journey: {
      behind: [
        { week: 'WK 5', title: 'Lactation consult · Leah', detail: 'Latch resolved · plan updated', kind: 'visit' },
        { week: 'WK 2', title: 'Postpartum check', detail: 'Healing on track · EPDS 4', kind: 'visit' },
        { week: 'Birth', title: 'Asher born · 40w 2d', detail: '7 lb 1 oz · uncomplicated vaginal delivery', kind: 'milestone' },
        { week: 'Pregnancy', title: 'Your full pregnancy record · 28 entries', detail: '9 visits, 23 questions, every lab — carried forward', kind: 'group' },
      ],
      here: {
        week: '6 weeks postpartum',
        stage: 'Fourth trimester',
        inflight: [
          { label: 'Pelvic-floor PT referral', sub: 'New — from yesterday’s visit' },
          { label: 'Sleep follow-up', sub: 'Open thread · checking in today' },
        ],
      },
      ahead: [
        { id: 'pt', when: 'WK 6–12', title: 'Pelvic-floor PT window', sub: 'Referral active — book when ready', conf: 'recommended', gap: true, source: 'Your care plan' },
        { id: 'peds2mo', when: 'WK 8 · JUL 9', title: 'Asher’s 2-month visit', sub: 'Scheduled · first vaccines', conf: 'scheduled' },
        { id: 'contra', when: 'BY WK 8', title: 'Contraception plan', sub: 'A decision worth settling before week 8', conf: 'decision' },
        { id: 'rtw', when: 'WK 12', title: 'Return to work', sub: 'Pumping logistics, childcare handoff — prep starts ~week 10', conf: 'decision' },
        { id: 'rhythm', when: '~WK 10', title: 'Feeding rhythm often settles', sub: 'Common around this stage', conf: 'typical' },
      ],
    },
  },
};

export const trellisPersonaOrder = ['nina', 'sasha', 'maya'];

export const hcgBand = [
  { wk: 4.0, lo: 10, hi: 430 },
  { wk: 4.5, lo: 40, hi: 1800 },
  { wk: 5.0, lo: 120, hi: 7300 },
  { wk: 5.5, lo: 500, hi: 20000 },
  { wk: 6.0, lo: 1100, hi: 56500 },
  { wk: 6.5, lo: 2700, hi: 110000 },
  { wk: 7.0, lo: 7700, hi: 229000 },
  { wk: 7.5, lo: 12000, hi: 260000 },
  { wk: 8.0, lo: 20000, hi: 290000 },
];

export const hcgDraws = [
  { wk: 5.14, value: 2400, label: '5w 1d' },
  { wk: 5.57, value: 6100, label: '5w 4d' },
];

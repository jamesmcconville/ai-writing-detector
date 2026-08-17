<script lang="ts">
  import type { Report } from '@/report/types.js';
  import { onMount } from 'svelte';

  export let report: Report;

  let gaugeValue = 0;

  onMount(() => {
    setTimeout(() => {
      gaugeValue = report.score.score;
    }, 50);
  });

  $: score = report.score.score;
  $: statusColor =
    score < 30 ? 'var(--status-green)' : score < 60 ? 'var(--status-amber)' : 'var(--status-red)';
  $: statusBg =
    score < 30
      ? 'var(--status-green-bg)'
      : score < 60
        ? 'var(--status-amber-bg)'
        : 'var(--status-red-bg)';
  $: statusLabel = score < 30 ? 'Likely Human' : score < 60 ? 'Possibly AI' : 'Likely AI';
  $: activeCategories = report.patterns.categories.filter(
    (c) => c.matchCount > 0 || c.score > 0,
  );
  $: sortedContributions = [...report.contributions].sort((a, b) => b.score - a.score);

  // Gauge geometry — semicircle, 0 at left, 100 at right
  $: gaugeAngle = (gaugeValue / 100) * 180;
  $: gaugeRadians = (gaugeAngle * Math.PI) / 180;
  $: gaugeRadius = 80;
  $: gaugeCx = 90;
  $: gaugeCy = 90;
  // Arc path from left (180°) to the current angle
  $: arcEndX = gaugeCx + gaugeRadius * Math.cos(Math.PI - gaugeRadians);
  $: arcEndY = gaugeCy - gaugeRadius * Math.sin(gaugeRadians);
  $: largeArc = gaugeAngle > 180 ? 1 : 0;
  $: arcPath = `M ${gaugeCx - gaugeRadius} ${gaugeCy} A ${gaugeRadius} ${gaugeRadius} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`;

  function fmt(n: number): string {
    return n.toLocaleString('en-US');
  }

  function fmtDec(n: number, places: number = 2): string {
    return n.toFixed(places);
  }

  function pct(n: number, total: number): string {
    return total > 0 ? Math.round((n / total) * 100) + '%' : '0%';
  }

  function highlightBefore(sentence: string, term: string): string {
    const idx = sentence.toLowerCase().indexOf(term.toLowerCase());
    return idx === -1 ? sentence : sentence.slice(0, idx);
  }

  function highlightMatch(sentence: string, term: string): string {
    const idx = sentence.toLowerCase().indexOf(term.toLowerCase());
    return idx === -1 ? '' : sentence.slice(idx, idx + term.length);
  }

  function highlightAfter(sentence: string, term: string): string {
    const idx = sentence.toLowerCase().indexOf(term.toLowerCase());
    return idx === -1 ? '' : sentence.slice(idx + term.length);
  }
</script>

<!-- Hero: gauge card -->
<section class="card hero-card">
  <div class="gauge-wrap">
    <svg class="gauge" viewBox="0 0 180 100" aria-hidden="true">
      <!-- Background track -->
      <path
        d="M 10 90 A 80 80 0 0 1 170 90"
        fill="none"
        stroke="var(--border)"
        stroke-width="8"
        stroke-linecap="round"
      />
      <!-- Fill arc -->
      <path
        d={arcPath}
        fill="none"
        stroke={statusColor}
        stroke-width="8"
        stroke-linecap="round"
        style="transition: stroke 0.3s ease;"
      />
    </svg>
    <div class="gauge-center">
      <span class="gauge-score" style="color: {statusColor}">{score}</span>
      <span class="gauge-max">/ 100</span>
    </div>
  </div>
  <div class="hero-meta">
    <div class="status-badge" style="background: {statusBg}; color: {statusColor}">
      <span class="status-dot" style="background: {statusColor}"></span>
      {statusLabel}
    </div>
    <p class="classification">{report.score.classification}</p>
    <p class="explanation">{report.score.explanation}</p>
    {#if report.score.rawScore !== report.score.score}
      <p class="raw-score">Raw: {report.score.rawScore} / {report.score.maxRawScore}</p>
    {/if}
  </div>
</section>

<!-- Stat strip -->
<section class="stat-strip">
  <div class="stat-card">
    <span class="stat-label">Characters</span>
    <span class="stat-value">{fmt(report.statistics.characterCount)}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">Words</span>
    <span class="stat-value">{fmt(report.statistics.wordCount)}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">Sentences</span>
    <span class="stat-value">{fmt(report.statistics.sentenceCount)}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">Avg word length</span>
    <span class="stat-value">{fmtDec(report.statistics.averageWordLength)}</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">Avg sentence length</span>
    <span class="stat-value">{fmtDec(report.statistics.averageSentenceLength)}</span>
  </div>
</section>

<!-- Detail cards: side by side on desktop -->
<div class="detail-grid">
  <!-- Linguistic signals -->
  <section class="card">
    <h2 class="card-title">Linguistic Signals</h2>
    <ul class="factor-list">
      {#each report.linguistic.factors as factor}
        <li class="factor" class:flagged={factor.isAISignal}>
          <div class="factor-top">
            <div class="factor-id">
              {#if factor.isAISignal}
                <span class="dot dot-red"></span>
                <span class="badge badge-red">AI signal</span>
              {:else}
                <span class="dot dot-green"></span>
                <span class="badge badge-green">Normal</span>
              {/if}
            </div>
            <span class="factor-value">{factor.value}{factor.unit}</span>
          </div>
          <span class="factor-name">{factor.name}</span>
          <span class="factor-detail">{factor.interpretation}</span>
        </li>
      {/each}
    </ul>
    <p class="factor-overall">{report.linguistic.overallInterpretation}</p>
  </section>

  <!-- Patterns detected -->
  <section class="card">
    <h2 class="card-title">Patterns Detected</h2>
    {#if activeCategories.length > 0}
      <ul class="pattern-list">
        {#each activeCategories as category}
          <li class="pattern">
            <div class="pattern-header">
              <span class="pattern-name">{category.name.toUpperCase()}</span>
              <span class="pattern-score">{category.score} / {category.maxScore}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width: {pct(category.score, category.maxScore)}"></div>
            </div>
            {#if category.subcategories && category.subcategories.length > 0}
              <ul class="sub-list">
                {#each category.subcategories as sub}
                  {#if sub.count > 0}
                    <li class="sub-item">
                      <span class="sub-name">{sub.name}</span>
                      <span class="sub-meta">{sub.count} match{sub.count === 1 ? '' : 'es'} · {sub.score} pts</span>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
            {#if category.examples && category.examples.length > 0}
              <div class="examples">
                {#each category.examples as example}
                  <details class="example-row">
                    <summary class="example-term">{example.term}</summary>
                    <p class="example-sentence">
                      {highlightBefore(example.sentence, example.term)}<strong class="highlight">{highlightMatch(example.sentence, example.term)}</strong>{highlightAfter(example.sentence, example.term)}
                    </p>
                  </details>
                {/each}
              </div>
            {:else if category.matches.length > 0 && category.matches.length <= 5}
              <div class="pattern-matches">{category.matches.join(', ')}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">No patterns found in this text.</p>
    {/if}
  </section>
</div>

<!-- Score breakdown -->
<section class="card">
  <h2 class="card-title">Score Breakdown</h2>
  <ul class="breakdown-list">
    {#each sortedContributions as c}
      <li class="breakdown-row">
        <span class="breakdown-name">{c.category}</span>
        <div class="breakdown-bar">
          <div class="breakdown-bar-fill" style="width: {pct(c.score, c.maxScore)}"></div>
        </div>
        <span class="breakdown-score">{c.score} / {c.maxScore}</span>
        <span class="breakdown-pct">{pct(c.score, c.maxScore)}</span>
      </li>
    {/each}
  </ul>
  <div class="timestamp">Analyzed {report.timestamp.local}</div>
</section>

<style>
  /* Card base */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
  }

  .card-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    margin-bottom: 1.25rem;
  }

  /* Hero gauge card */
  .hero-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1.25rem;
  }

  .gauge-wrap {
    position: relative;
    flex-shrink: 0;
    width: 180px;
    height: 100px;
  }

  .gauge {
    width: 100%;
    height: 100%;
  }

  .gauge path[fill="none"]:not(:first-child) {
    transition: stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1),
      stroke 0.3s ease;
  }

  .gauge-center {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }

  .gauge-score {
    font-family: var(--font-mono);
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1;
  }

  .gauge-max {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-left: 0.125rem;
  }

  .hero-meta {
    flex: 1;
    min-width: 0;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.625rem;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .classification {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.375rem;
  }

  .explanation {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    max-width: 42ch;
  }

  .raw-score {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
  }

  /* Stat strip */
  .stat-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.625rem;
    margin-bottom: 1.25rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.875rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-tertiary);
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
  }

  /* Detail grid */
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }

  /* Factor list */
  .factor-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .factor {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .factor-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .factor-id {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-green {
    background: var(--status-green);
  }

  .dot-red {
    background: var(--status-red);
  }

  .badge {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.0625rem 0.375rem;
    border-radius: 3px;
  }

  .badge-green {
    background: var(--status-green-bg);
    color: var(--status-green);
  }

  .badge-red {
    background: var(--status-red-bg);
    color: var(--status-red);
  }

  .factor-value {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text);
  }

  .factor-name {
    font-size: 0.8125rem;
    color: var(--text);
  }

  .factor-detail {
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }

  .factor-overall {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.8125rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  /* Pattern list */
  .pattern-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .pattern-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
  }

  .pattern-name {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
  }

  .pattern-score {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }

  .bar-track {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sub-list {
    list-style: none;
    margin-top: 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sub-item {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  .sub-name {
    color: var(--text-secondary);
  }

  .sub-meta {
    color: var(--text-tertiary);
  }

  .pattern-matches {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-style: italic;
  }

  .examples {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .example-row {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .example-term {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-secondary);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .example-term::-webkit-details-marker {
    display: none;
  }

  .example-term::before {
    content: '+';
    color: var(--accent);
    font-weight: 700;
  }

  details[open] > .example-term::before {
    content: '−';
  }

  .example-sentence {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    color: var(--text);
    background: var(--bg);
    border-top: 1px solid var(--border);
    line-height: 1.5;
  }

  .highlight {
    color: var(--accent);
  }

  .empty {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    font-style: italic;
  }

  /* Score breakdown */
  .breakdown-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .breakdown-row {
    display: grid;
    grid-template-columns: 1fr 2fr auto auto;
    align-items: center;
    gap: 1rem;
  }

  .breakdown-name {
    font-size: 0.8125rem;
    color: var(--text);
  }

  .breakdown-bar {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .breakdown-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .breakdown-score {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }

  .breakdown-pct {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
    min-width: 2.5rem;
    text-align: right;
  }

  .timestamp {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-tertiary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .detail-grid {
      grid-template-columns: 1fr;
    }

    .stat-strip {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .hero-card {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .hero-meta {
      text-align: center;
    }

    .status-badge {
      justify-content: center;
    }

    .breakdown-row {
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }

    .breakdown-bar,
    .breakdown-score {
      display: none;
    }
  }
</style>

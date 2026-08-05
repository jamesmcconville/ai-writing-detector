<script lang="ts">
  import type { Report } from '@/report/types.js';

  export let report: Report;

  $: score = report.score.score;
  $: scoreColor = score < 30 ? 'var(--score-green)' : score < 60 ? 'var(--score-amber)' : 'var(--score-red)';
  $: scoreLabel = score < 30 ? 'Likely Human' : score < 60 ? 'Possibly AI' : 'Likely AI';
  $: activeCategories = report.patterns.categories.filter(
    (category) => category.matchCount > 0 || category.score > 0,
  );
  $: sortedContributions = [...report.contributions].sort((a, b) => b.score - a.score);
</script>

<div class="report">
  <details class="section" open>
    <summary>Score</summary>
    <div class="score-section">
      <div class="score-value" style="color: {scoreColor}">{score}</div>
      <div class="score-label" style="color: {scoreColor}">{scoreLabel}</div>
      <div class="classification">Classification: {report.score.classification}</div>
      <p class="explanation">{report.score.explanation}</p>
      {#if report.score.rawScore !== report.score.score}
        <div class="raw-score">
          Raw score: {report.score.rawScore} / {report.score.maxRawScore}
        </div>
      {/if}
    </div>
  </details>

  <details class="section" open>
    <summary>Text Statistics</summary>
    <dl class="stats-grid">
      <div class="stat">
        <dt>Characters</dt>
        <dd>{report.statistics.characterCount}</dd>
      </div>
      <div class="stat">
        <dt>Words</dt>
        <dd>{report.statistics.wordCount}</dd>
      </div>
      <div class="stat">
        <dt>Sentences</dt>
        <dd>{report.statistics.sentenceCount}</dd>
      </div>
      <div class="stat">
        <dt>Average Word Length</dt>
        <dd>{report.statistics.averageWordLength.toFixed(2)}</dd>
      </div>
      <div class="stat">
        <dt>Average Sentence Length</dt>
        <dd>{report.statistics.averageSentenceLength.toFixed(2)}</dd>
      </div>
    </dl>
  </details>

  <details class="section" open>
    <summary>Linguistic Factors</summary>
    <ul class="factors-list">
      {#each report.linguistic.factors as factor}
        <li class="factor" class:ai-signal={factor.isAISignal}>
          <div class="factor-header">
            <strong>{factor.name}</strong>
            <span class="factor-value">{factor.value}{factor.unit}</span>
            {#if factor.isAISignal}
              <span class="warning-badge" aria-label="AI signal detected">⚠</span>
            {/if}
          </div>
          <p class="factor-interpretation">{factor.interpretation}</p>
        </li>
      {/each}
    </ul>
    <p class="overall-interpretation">{report.linguistic.overallInterpretation}</p>
  </details>

  <details class="section" open>
    <summary>Patterns Detected</summary>
    {#if activeCategories.length > 0}
      <ul class="categories-list">
        {#each activeCategories as category}
          <li class="category">
            <div class="category-header">
              <strong>{category.name.toUpperCase()}</strong>
              <span class="category-score">{category.score} / {category.maxScore}</span>
            </div>
            {#if category.subcategories && category.subcategories.length > 0}
              <ul class="subcategories-list">
                {#each category.subcategories as subcategory}
                  {#if subcategory.count > 0}
                    <li class="subcategory">
                      <span>{subcategory.name}</span>
                      <span class="subcategory-meta">
                        count: {subcategory.count}, score: {subcategory.score} / {subcategory.maxScore}
                      </span>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
            {#if category.matches.length > 0 && category.matches.length <= 5}
              <div class="matches">Matches: {category.matches.join(', ')}</div>
            {/if}
          </li>
        {/each}
      </ul>
      <div class="total">
        Total: {report.patterns.totalScore} / {report.patterns.totalMaxScore}
      </div>
    {:else}
      <p class="empty">No patterns detected</p>
      <div class="total">
        Total: {report.patterns.totalScore} / {report.patterns.totalMaxScore}
      </div>
    {/if}
  </details>
</div>

<footer class="footer">
  <p class="timestamp">Analyzed at {report.timestamp.local}</p>

  <div class="breakdown">
    <h3>Score Breakdown</h3>
    {#if sortedContributions.length > 0}
      <ul class="breakdown-list">
        {#each sortedContributions as contribution}
          <li class="breakdown-item">
            <div class="breakdown-header">
              <span class="breakdown-name">{contribution.category}</span>
              <span class="breakdown-score">
                {contribution.score} / {contribution.maxScore}
              </span>
            </div>
            <p class="breakdown-explanation">{contribution.explanation}</p>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">No score contributions</p>
    {/if}
  </div>
</footer>

<style>
  .report {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
    background-color: #ffffff;
  }

  summary {
    font-weight: 700;
    font-size: 1.125rem;
    cursor: pointer;
    user-select: none;
  }

  .score-section {
    margin-top: 0.75rem;
  }

  .score-value {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
  }

  .score-label {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .classification {
    margin-top: 0.5rem;
    color: #4b5563;
  }

  .explanation {
    margin-top: 0.5rem;
    color: #374151;
  }

  .raw-score {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin: 0.75rem 0 0 0;
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .stat dt {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .stat dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .factors-list,
  .categories-list,
  .subcategories-list,
  .breakdown-list {
    list-style: none;
    margin: 0.75rem 0 0 0;
    padding: 0;
  }

  .factor,
  .category,
  .breakdown-item {
    padding: 0.75rem;
    border-radius: 0.375rem;
    background-color: #f8fafc;
  }

  .factor:not(:last-child),
  .category:not(:last-child),
  .breakdown-item:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .factor.ai-signal {
    border-left: 4px solid var(--score-amber);
  }

  .factor-header,
  .category-header,
  .breakdown-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .factor-value {
    color: #4b5563;
  }

  .warning-badge {
    color: var(--score-amber);
    font-weight: 700;
  }

  .factor-interpretation,
  .breakdown-explanation {
    margin: 0.25rem 0 0 0;
    font-size: 0.95rem;
    color: #4b5563;
  }

  .overall-interpretation {
    margin-top: 1rem;
    font-weight: 500;
  }

  .category-score {
    margin-left: auto;
    font-weight: 600;
  }

  .subcategories-list {
    margin-top: 0.5rem;
  }

  .subcategory {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.25rem 0;
    font-size: 0.95rem;
  }

  .subcategory-meta {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .matches {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .total {
    margin-top: 1rem;
    font-weight: 700;
  }

  .empty {
    color: #6b7280;
    font-style: italic;
  }

  .footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .timestamp {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .breakdown h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
  }

  .breakdown-name {
    font-weight: 600;
  }

  .breakdown-score {
    margin-left: auto;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    .score-value {
      font-size: 2.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

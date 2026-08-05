<script lang="ts">
  import type { Report } from '@/report/types.js';
  import { generateReport } from '@/report/assembler.js';
  import TextInput from './components/TextInput.svelte';
  import ReportView from './components/ReportView.svelte';

  let report: Report | null = null;
  let isAnalyzing = false;
  let error: string | null = null;

  function handleAnalyze(text: string) {
    if (!text.trim()) {
      error = 'Please enter some text to analyze.';
      return;
    }

    isAnalyzing = true;
    error = null;

    // Yield to the render cycle so the loading state is visible before the
    // synchronous analysis runs. For large inputs this also prevents the UI
    // from feeling frozen.
    setTimeout(() => {
      try {
        report = generateReport(text);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      } finally {
        isAnalyzing = false;
      }
    }, 0);
  }

  function handleReset() {
    report = null;
    error = null;
    isAnalyzing = false;
  }
</script>

<div class="container">
  <h1>AI Writing Detector</h1>

  {#if error}
    <div class="error" role="alert">{error}</div>
  {/if}

  {#if report}
    <ReportView {report} />
    <button class="secondary" on:click={handleReset}>Analyze Another</button>
  {:else}
    <TextInput on:analyze={(event) => handleAnalyze(event.detail)} />
    {#if isAnalyzing}
      <div class="loading" aria-live="polite">Analyzing…</div>
    {/if}
  {/if}
</div>

<style>
  .loading {
    margin-top: 1rem;
    color: #4b5563;
    font-style: italic;
  }

  .error {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    color: #991b1b;
    border-radius: 0.375rem;
  }

  .secondary {
    margin-top: 1.5rem;
    background-color: #e2e8f0;
    color: #1e293b;
  }

  .secondary:hover {
    background-color: #cbd5e1;
  }

  .secondary:disabled {
    background-color: #e2e8f0;
  }
</style>

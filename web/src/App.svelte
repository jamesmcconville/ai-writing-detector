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

{#if report}
  <div class="dashboard">
    <header class="topbar">
      <span class="topbar-title">AI Writing Detector</span>
      <button class="btn-ghost" on:click={handleReset}>← New analysis</button>
    </header>
    <ReportView {report} />
  </div>
{:else}
  <div class="landing">
    <div class="landing-card">
      <h1 class="landing-title">AI Writing Detector</h1>
      <p class="landing-subtitle">Paste, upload, or drop text to check for AI-generated patterns.</p>

      {#if error}
        <div class="error" role="alert">{error}</div>
      {/if}

      <TextInput on:analyze={(event) => handleAnalyze(event.detail)} />

      {#if isAnalyzing}
        <div class="loading" aria-live="polite">Analyzing…</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .dashboard {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1.5rem 3rem;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .topbar-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: -0.01em;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.875rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .btn-ghost:hover {
    border-color: var(--border-hover);
    color: var(--text);
  }

  .landing {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem 1.5rem;
  }

  .landing-card {
    width: 100%;
    max-width: 640px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2.5rem;
  }

  .landing-title {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .landing-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .error {
    margin-bottom: 1.25rem;
    padding: 0.625rem 0.875rem;
    background: var(--status-red-bg);
    color: var(--status-red);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
  }

  .loading {
    margin-top: 1rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  @media (max-width: 640px) {
    .dashboard {
      padding: 1rem 1rem 2rem;
    }

    .landing-card {
      padding: 1.75rem;
    }

    .topbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
</style>

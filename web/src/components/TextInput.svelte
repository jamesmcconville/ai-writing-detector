<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ analyze: string }>();

  let text = '';
  let isDragging = false;

  $: trimmedText = text.trim();
  $: characterCount = text.length;
  $: wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;
  $: canAnalyze = trimmedText.length > 0;

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      text = String(reader.result ?? '');
    };
    reader.onerror = () => {
      alert('Could not read that file. Please try again.');
    };
    reader.readAsText(file);
  }

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) readFile(file);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) readFile(file);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleAnalyze() {
    if (canAnalyze) dispatch('analyze', text);
  }
</script>

<div class="input-area">
  <textarea
    class="textarea"
    class:dragging={isDragging}
    bind:value={text}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    placeholder="Paste text here, or drop a .txt or .md file…"
    aria-label="Text to analyze"
  ></textarea>

  <div class="toolbar">
    <span class="stats">{characterCount} characters · {wordCount} words</span>

    <div class="actions">
      <input
        type="file"
        accept=".txt,.md"
        on:change={handleFileInput}
        class="visually-hidden"
        id="file-upload"
      />
      <label for="file-upload" class="btn-secondary">Upload file</label>
      <button class="btn-primary" on:click={handleAnalyze} disabled={!canAnalyze}>
        Analyze
      </button>
    </div>
  </div>
</div>

<style>
  .input-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .textarea {
    width: 100%;
    min-height: 240px;
    padding: 1rem;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  .textarea::placeholder {
    color: var(--text-tertiary);
  }

  .textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .textarea.dragging {
    border-color: var(--accent);
    background: rgba(99, 102, 241, 0.05);
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .stats {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }

  .actions {
    display: flex;
    gap: 0.625rem;
    align-items: center;
  }

  .btn-primary {
    background: var(--accent);
    color: #ffffff;
    border: 1px solid var(--accent);
    border-radius: var(--radius-sm);
    padding: 0.5rem 1.25rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-secondary {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .btn-secondary:hover {
    border-color: var(--border-hover);
    color: var(--text);
  }

  @media (max-width: 480px) {
    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .actions {
      justify-content: stretch;
    }

    .btn-primary,
    .btn-secondary {
      flex: 1;
      text-align: center;
    }
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ analyze: string }>();

  let text = '';
  let isDragging = false;
  let fileInput: HTMLInputElement | null = null;

  $: trimmedText = text.trim();
  $: characterCount = text.length;
  $: wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;
  $: canAnalyze = trimmedText.length > 0;

  function readFile(file: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      text = String(reader.result ?? '');
    };
    reader.onerror = () => {
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsText(file);
  }

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      readFile(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      readFile(file);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleAnalyze() {
    if (canAnalyze) {
      dispatch('analyze', text);
    }
  }
</script>

<div class="text-input">
  <label for="text-input">Paste text to analyze</label>
  <textarea
    id="text-input"
    class="textarea"
    class:dragging={isDragging}
    bind:value={text}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    placeholder="Paste your text here, or drag and drop a .txt or .md file…"
    aria-describedby="text-stats"
  />

  <div class="toolbar">
    <div class="stats" id="text-stats">
      <span>{characterCount} characters</span>
      <span>{wordCount} words</span>
    </div>

    <div class="actions">
      <input
        bind:this={fileInput}
        type="file"
        accept=".txt,.md"
        on:change={handleFileInput}
        class="visually-hidden"
        id="file-upload"
      />
      <label for="file-upload" class="file-button">Upload File</label>
      <button on:click={handleAnalyze} disabled={!canAnalyze}>Analyze</button>
    </div>
  </div>
</div>

<style>
  .text-input {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  label[for='text-input'] {
    font-weight: 600;
  }

  .textarea {
    width: 100%;
    min-height: 300px;
    padding: 0.75rem;
    font-size: 1rem;
    line-height: 1.6;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    resize: vertical;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .textarea.dragging {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .stats {
    display: flex;
    gap: 1rem;
    color: #4b5563;
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .file-button {
    display: inline-block;
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.375rem;
    background-color: #f1f5f9;
    color: #1e293b;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .file-button:hover {
    background-color: #e2e8f0;
  }

  button {
    background-color: #2563eb;
    color: #ffffff;
  }

  button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
</style>

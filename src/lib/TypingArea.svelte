<script lang="ts">
  import { testText, isTestRunning, userInput, timeLeft } from './store';
  
  let inputElement: HTMLTextAreaElement;

  function startTest() {
    if (!$isTestRunning) {
        $isTestRunning = true;
        // Reset or prepare logic could go here
    }
    inputElement.focus();
  }

  // Timer logic - simplest implementation for now to satisfy "start typing"
  let interval: ReturnType<typeof setInterval>;
  
  $: if ($isTestRunning && $timeLeft > 0) {
      if (!interval) {
          interval = setInterval(() => {
              timeLeft.update(n => {
                  if (n <= 1) {
                      clearInterval(interval);
                      isTestRunning.set(false);
                      return 0;
                  }
                  return n - 1;
              });
          }, 1000);
      }
  } else if (!$isTestRunning && interval) {
      clearInterval(interval);
      // @ts-ignore
      interval = null;
  }

</script>

<div class="typing-container">
  {#if !$isTestRunning}
    <div class="overlay" on:click={startTest} on:keydown={() => {}} role="button" tabindex="0">
        <button class="start-btn" on:click|stopPropagation={startTest}>Start Typing Test</button>
        <p class="instruction">Or click the text and start typing</p>
    </div>
  {/if}

  <div class="text-display" class:blurred={!$isTestRunning} on:click={startTest} on:keydown={() => {}} role="button" tabindex="0">
    {$testText}
  </div>

  <!-- Hidden textarea to capture input -->
  <textarea 
    bind:this={inputElement} 
    bind:value={$userInput}
    class="sr-only"
    aria-hidden="true"
    autocomplete="off"
    id="hidden-input"
  ></textarea>
</div>

<style lang="scss">

  .typing-container {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Sora', sans-serif;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
    background-color: transparent;
  }

  .text-display {
    font-size: 1.5rem;
    line-height: 1.6;
    color: $default-text-color;
    transition: filter 0.3s ease;
    min-height: 200px;
    background: transparent;
    border-radius: 8px;
    white-space: pre-wrap;
    user-select: none;
    text-align: start;
    margin-top: 2rem;
    
    &.blurred {
      filter: blur(6px);
      opacity: 0.5;
    }
  }

  .start-btn {
    background-color: $blue-600;
    color: $neutral-0;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 0.5rem;
    transition: transform 0.1s;

    &:hover {
      transform: scale(1.05);
      background-color: $blue-400;
    }
  }

  .instruction {
    color: $neutral-0;
    font-size: 1rem;
    font-weight: 600;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>

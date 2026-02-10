<script lang="ts">
  import { testText, isTestRunning, userInput, timeLeft, wpm, accuracy, correctCharacters, totalCharacters, showResults, selectedTimeLimit, totalErrors } from './store';
  
  let inputElement: HTMLTextAreaElement;

  // Track errors
  let previousInputLength = 0;
  
  $: {
      if (!$isTestRunning && $userInput.length === 0) {
          previousInputLength = 0;
      }
      
      // If input grew
      if ($isTestRunning && $userInput.length > previousInputLength) {
          const newCharIndex = $userInput.length - 1;
          const char = $userInput[newCharIndex];
          const targetChar = $testText[newCharIndex];
          
          if (char !== targetChar) {
              totalErrors.update(n => n + 1);
          }
      }
      previousInputLength = $userInput.length;
  }

  function startTest() {
    if (!$isTestRunning) {
        $isTestRunning = true;
    }
    inputElement.focus();
  }

  function getCharClass(char: string, index: number, input: string) {
    if (index >= input.length) {
        return '';
    }
    return char === input[index] ? 'correct' : 'incorrect';
  }

  // Check for test completion
  $: if ($isTestRunning && $userInput.length >= $testText.length) {
      const rawElapsed = $selectedTimeLimit - $timeLeft;
      // ensure at least 1s to avoid Infinity
      const elapsed = Math.max(1, rawElapsed);
      
      let correct = 0;
      const input = $userInput;
      const text = $testText;

      for (let i = 0; i < input.length; i++) {
          if (input[i] === text[i]) {
              correct++;
          }
      }
      
      correctCharacters.set(correct);
      totalCharacters.set(input.length);
      
      const netWpm = Math.round((correct / 5) / (elapsed / 60));
      wpm.set(Math.max(0, netWpm));
      
      const acc = (correct + $totalErrors) > 0 ? Math.round((correct / (correct + $totalErrors)) * 100) : 100;
      accuracy.set(acc);

      isTestRunning.set(false);
      showResults.set(true);
  }

  // Timer logic - with stats update
  let interval: ReturnType<typeof setInterval>;
  
  $: if ($isTestRunning && $timeLeft > 0) {
      if (!interval) {
          interval = setInterval(() => {
              timeLeft.update(n => {
                  const now = n - 1;
                  const elapsed = $selectedTimeLimit - now;
                  
                  // Stats calculation
                  let correct = 0;
                  // We access user input and text from store subscriptions
                  const input = $userInput;
                  const text = $testText;

                  for (let i = 0; i < input.length; i++) {
                      if (input[i] === text[i]) {
                          correct++;
                      }
                  }
                  
                  correctCharacters.set(correct);
                  totalCharacters.set(input.length);
                  
                  if (elapsed > 0) {
                      const netWpm = Math.round((correct / 5) / (elapsed / 60));
                      wpm.set(Math.max(0, netWpm));
                      
                      const acc = (correct + $totalErrors) > 0 ? Math.round((correct / (correct + $totalErrors)) * 100) : 100;
                      accuracy.set(acc);
                  }

                  if (now <= 0) {
                      clearInterval(interval);
                      isTestRunning.set(false);
                      showResults.set(true);
                      return 0;
                  }
                  return now;
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
    {#each $testText.split('') as char, i}
      <span class={getCharClass(char, i, $userInput)}>{char}</span>
    {/each}
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

    span {
        &.correct {
            color: $correct-text-color;
        }
        
        &.incorrect {
            color: $incorrect-text-color;
            text-decoration: underline;
            text-decoration-color: $incorrect-text-color;
        }
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

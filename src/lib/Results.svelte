<script lang="ts">
  import { onMount } from "svelte";
  import {
    wpm,
    accuracy,
    correctCharacters,
    totalCharacters,
    showResults,
    isTestRunning,
    userInput,
    timeLeft,
    selectedTimeLimit,
    bestWPM,
    totalErrors,
  } from "./store";

  let incorrectCharacters = 0;
  let isNewBaseline = false;
  let isNewPersonalBest = false;

  $: incorrectCharacters = $totalCharacters - $correctCharacters;

  function restartTest() {
    $showResults = false;
    $isTestRunning = false;
    $userInput = "";
    $timeLeft = $selectedTimeLimit;
    $wpm = 0;
    $accuracy = 100;
    $correctCharacters = 0;
    $totalCharacters = 0;
    $totalErrors = 0;
  }

  onMount(() => {
    let savedBestJSON = localStorage.getItem("personal-best");

    // Check for legacy key and migrate if necessary
    if (!savedBestJSON) {
      const legacyBaseline = localStorage.getItem("typing-test-baseline");
      if (legacyBaseline) {
        savedBestJSON = legacyBaseline;
        localStorage.setItem("personal-best", legacyBaseline);
        localStorage.removeItem("typing-test-baseline");
      }
    }

    const currentResult = {
      wpm: $wpm,
      accuracy: $accuracy,
      date: new Date().toISOString(),
    };

    if (!savedBestJSON) {
      isNewBaseline = true;
      localStorage.setItem("personal-best", JSON.stringify(currentResult));
      $bestWPM = $wpm;
    } else {
      try {
        const savedBest = JSON.parse(savedBestJSON);
        if ($wpm > savedBest.wpm) {
          isNewPersonalBest = true;
          localStorage.setItem("personal-best", JSON.stringify(currentResult));
          $bestWPM = $wpm;
        }
      } catch (e) {
        console.error("Error parsing saved best score:", e);
        // Fallback: treat as new baseline if corrupted
        isNewBaseline = true;
        localStorage.setItem("personal-best", JSON.stringify(currentResult));
        $bestWPM = $wpm;
      }
    }
  });
</script>

<div class="results-container">
  <div class="test-completed-icon">
    {#if isNewPersonalBest}
      <img class="new-pb-icon" src="/images/icon-new-pb.svg" alt="fireworks" />
    {:else}
      <img src="/images/icon-completed.svg" alt="check" />
    {/if}
  </div>

  <h2>
    {#if isNewBaseline}
      Baseline Established!
    {:else if isNewPersonalBest}
      High Score Smashed!
    {:else}
      Test Complete!
    {/if}
  </h2>
  <p class="completed-msg">
    {#if isNewBaseline}
      You've set the bar. Now the real challenge begins--time to beat it.
    {:else if isNewPersonalBest}
      You're getting faster. That was incredible typing.
    {:else}
      Solid run. Keep pushing to beat your high score.
    {/if}
  </p>

  <div class="stats-grid">
    <div class="stat-card">
      <h3>WPM:</h3>
      <p class="value">{$wpm}</p>
    </div>
    <div class="stat-card">
      <h3>Accuracy:</h3>
      <p
        class="value accuracy"
        class:perfect={$accuracy === 100}
        class:imperfect={$accuracy < 100}
      >
        {$accuracy}%
      </p>
    </div>
    <div class="stat-card">
      <h3>Characters:</h3>
      <div class="chars-details">
        <span class="correct">{$correctCharacters}</span>
        <span class="separator">/</span>
        <span class="incorrect">{incorrectCharacters}</span>
      </div>
      <p class="subtitle">correct / incorrect</p>
    </div>
  </div>

  <button class="restart-btn" on:click={restartTest}>
    {#if isNewBaseline || isNewPersonalBest}
      Beat This Score
    {:else}
      Go Again
    {/if}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      ><path
        fill="currentColor"
        d="M1.563 1.281h.949c.246 0 .422.211.422.457l-.07 3.446a8.6 8.6 0 0 1 7.277-3.868c4.816 0 8.718 3.938 8.718 8.72-.035 4.816-3.937 8.683-8.718 8.683a8.86 8.86 0 0 1-5.871-2.215.446.446 0 0 1 0-.633l.703-.703c.14-.14.386-.14.562 0 1.23 1.09 2.813 1.723 4.606 1.723A6.88 6.88 0 0 0 17.03 10c0-3.797-3.093-6.89-6.89-6.89-2.813 0-5.203 1.687-6.293 4.078l4.43-.106c.245 0 .456.176.456.422v.95c0 .245-.21.421-.421.421h-6.75a.406.406 0 0 1-.422-.422v-6.75c0-.21.175-.422.422-.422"
      /></svg
    >
  </button>
</div>

<style lang="scss">
  .results-container {
    max-width: 600px;
    border-radius: 12px;
    text-align: center;
    color: $neutral-0;

    .test-completed-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 1.5rem auto;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        box-shadow:
          0 0 0 7.5px hsla(140, 63%, 57%, 0.2),
          0 0 0 15px hsla(140, 63%, 57%, 0.1);
        &.new-pb-icon {
          box-shadow: none;
        }
      }
    }
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    color: $neutral-0;
    font-weight: 600;
  }

  .completed-msg {
    color: $neutral-500;
    font-weight: 500;
    font-size: 0.85rem;
    max-width: 90%;
    margin-inline: auto;
  }

  .stats-grid {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    margin-top: 1rem;
    text-align: start;

    @include desktop {
      flex-direction: row;
      gap: 1.5rem;
    }
  }

  .stat-card {
    background: $neutral-900;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    min-width: 120px;
    border: 2px solid $neutral-800;

    h3 {
      font-size: 1rem;
      color: $neutral-400;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .value {
      font-size: 1.25rem;
      font-weight: bold;
      color: $neutral-0;

      &.accuracy {
        &.perfect {
          color: $correct-text-color;
        }

        &.imperfect {
          color: $incorrect-text-color;
        }
      }
    }
  }

  .chars-details {
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .correct {
      color: $correct-text-color;
    }

    .incorrect {
      color: $incorrect-text-color;
    }

    .separator {
      color: $neutral-500;
      font-size: 1.5rem;
    }
  }

  .subtitle {
    font-size: 0.8rem;
    color: $neutral-500;
    @include sr-only;
  }

  .restart-btn {
    margin-top: 1.5rem;
    background-color: $neutral-0;
    color: $neutral-900;
    border: none;
    padding: 0.5rem 0.95rem;
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-inline: auto;

    &:hover {
      transform: scale(1.05);
    }
  }
</style>

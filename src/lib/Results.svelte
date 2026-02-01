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
  } from "./store";

  let incorrectCharacters = 0;
  let isNewBaseline = false;

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
  }

  onMount(() => {
    const savedBaseline = localStorage.getItem("typing-test-baseline");
    if (!savedBaseline) {
      isNewBaseline = true;
      localStorage.setItem(
        "typing-test-baseline",
        JSON.stringify({
          wpm: $wpm,
          accuracy: $accuracy,
          date: new Date().toISOString(),
        }),
      );
    }
  });
</script>

<div class="results-container">
  <div class="test-completed-icon">
    <img src="/images/icon-completed.svg" alt="check" />
  </div>

    <h2>
      {isNewBaseline
        ? "Baseline Established!"
        : "Test Complete!"}
    </h2>
    <p class="completed-msg">
      {isNewBaseline
        ? "You've set the bar. Now the real challenge begins--time to beat it."
        : "Solid run. Keep pushing to beat your high score."}
    </p>

  <div class="stats-grid">
    <div class="stat-card">
      <h3>WPM:</h3>
      <p class="value">{$wpm}</p>
    </div>
    <div class="stat-card">
      <h3>Accuracy:</h3>
      <p class="value">{$accuracy}%</p>
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
    {#if isNewBaseline}
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
    padding-block: 2rem;
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
      }
    }
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: $neutral-0;
    font-weight: 600;
  }

  .completed-msg {
    color: $neutral-500;
    font-weight: 500;
    font-size: 0.85rem;
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

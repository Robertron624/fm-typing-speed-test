<script lang="ts">
  import { onMount } from "svelte";
  import Header from "./lib/Header.svelte";
  import CurrentStats from "./lib/CurrentStats.svelte";
  import TypingArea from "./lib/TypingArea.svelte";
  import Results from "./lib/Results.svelte";
  import { 
    showResults, 
    bestWPM,
    testDifficulty,
    testMode,
    testText,
    isTestRunning,
    userInput,
    timeLeft,
    wpm,
    accuracy,
    correctCharacters,
    totalCharacters,
    selectedTimeLimit,
    totalErrors
  } from "./lib/store";
  import data from './data.json';
  import type { TextData } from './types';

  const textData = data as TextData;

  // React to difficulty/mode changes to reset test and update text
  $: {
      // Access values to trigger reactivity
      const difficulty = $testDifficulty;
      // We also react to mode, though text only depends on difficulty currently
      const mode = $testMode;

      // Update text
      const difficultyTexts = textData[difficulty];
      if (difficultyTexts && difficultyTexts.length > 0) {
        // Pick random text
        const randomIndex = Math.floor(Math.random() * difficultyTexts.length);
        $testText = difficultyTexts[randomIndex].text;
      }

      // Reset Test state
      $isTestRunning = false;
      $showResults = false;
      $userInput = "";
      if (mode === 'passage') {
          $timeLeft = 0;
      } else {
          $timeLeft = $selectedTimeLimit;
      }
      
      // Reset stats
      $wpm = 0;
      $accuracy = 100;
      $correctCharacters = 0;
      $totalCharacters = 0;
      $totalErrors = 0;
  }

  onMount(() => {
    const savedBestJSON = localStorage.getItem("personal-best");
    if (savedBestJSON) {
      try {
        const savedBest = JSON.parse(savedBestJSON);
        $bestWPM = savedBest.wpm || 0;
        $totalErrors = savedBest.totalErrors || 0;
      } catch (e) {
        console.error("Error loading personal best:", e);
      }
    } else {
      const legacyBaseline = localStorage.getItem("typing-test-baseline");
      if (legacyBaseline) {
        try {
          const savedBaseline = JSON.parse(legacyBaseline);
          $bestWPM = savedBaseline.wpm || 0;
        } catch (e) {
            console.error("Error loading legacy baseline:", e);
        }
      }
    }
  });
</script>

<Header />
<main class:success={$showResults}>
  {#if $showResults}
    <Results />
  {:else}
    <CurrentStats />
    <TypingArea />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 0 1em 6em 1em;
    width: 100%;
    margin-top: 2rem;
  }
  main.success {
    border: 2px solid red;
    background-image: 
      url('/images/pattern-star-2.svg'),
      url('/images/pattern-star-1.svg');

    background-repeat: no-repeat;
    background-position: 
      top 1.5rem left 1rem,
      bottom 1.5rem right 1.5rem;

    background-size: 
      21px 21px,
      39px 39px;
  }
</style>

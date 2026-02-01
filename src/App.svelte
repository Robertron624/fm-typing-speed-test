<script lang="ts">
  import Header from "./lib/Header.svelte";
  import CurrentStats from "./lib/CurrentStats.svelte";
  import TypingArea from "./lib/TypingArea.svelte";
  import Results from "./lib/Results.svelte";
  import { showResults } from "./lib/store";
</script>

<Header />
<main>
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
    padding: 0 1em 1em 1em;
    /* max-width: 240px; */
    width: 100%;
    margin-top: 2rem;
  }
</style>

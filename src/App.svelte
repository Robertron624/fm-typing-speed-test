<script lang="ts">
  import Header from "./lib/Header.svelte";
  import CurrentStats from "./lib/CurrentStats.svelte";
  import TypingArea from "./lib/TypingArea.svelte";
</script>

<Header />
<main>
  <CurrentStats />
  <TypingArea />
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

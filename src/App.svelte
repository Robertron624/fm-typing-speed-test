<script lang="ts">
  import Header from "./lib/Header.svelte";
  import CurrentStats from "./lib/CurrentStats.svelte";
</script>

<Header />
<main>
  <CurrentStats />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    /* max-width: 240px; */
    width: 100%;
  }
</style>

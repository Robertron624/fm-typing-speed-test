<script lang="ts">
  import { bestWPM } from './store';
  console.log("Header loaded");
</script>

<header>
  <!-- Two images: logo-small and logo-large for responsive design -->
  <picture>
    <source srcset="/images/logo-large.svg" media="(min-width: 768px)" />
    <img src="/images/logo-small.svg" alt="Logo" />
  </picture>
  <div class="best-score-container">
    <img src="/images/icon-personal-best.svg" alt="Trophy icon representing personal best score" />
    <div class="text">
        <p class="best-score-label">
            <span class="mobile">
                Best: <br />
            </span>
            <span class="desktop">
                Personal Best:
            </span>
        </p>
        <p class="best-score-value">{$bestWPM} WPM</p>
    </div>
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    .best-score-container {
      text-align: right;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      .text{
        display: flex;
        align-items: center;
        .best-score-label {
          font-size: 1rem;
          color: #888;
          margin: 0 .25rem 0 0;

            .desktop {
              display: none;
            }

            @include desktop {
              .desktop {
                display: inline;
              }
              .mobile {
                display: none;
              }
            }
        }
        .best-score-value {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          color: $neutral-0;
        }
      }
    }
  }
</style>

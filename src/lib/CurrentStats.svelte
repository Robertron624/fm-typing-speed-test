<script lang="ts">
    import { wpm, accuracy, timeLeft, testDifficulty, testMode } from './store';
    import type { TestDifficulty, TestMode } from '../types';
    import { clickOutside } from './actions';

    // function that takes the time left in seconds and formats it as MM:SS
    // but 60 seconds instead of 1:00 will be shown as 0:60 for better clarity
    function formatTime(seconds: number): string {
        if (seconds === 60) return '0:60';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    let difficultyOptions: TestDifficulty[] = ['easy', 'medium', 'hard'];
    let modeOptions: TestMode[] = ['timed', 'passage'];

    let isDifficultyOpen = false;
    let isModeOpen = false;
</script>

<div class="stats-and-options">
    <div class="current-stats">
        <div class="stat">
            <p class="label">WPM:</p>
            <p class="value">{$wpm}</p>
        </div>
        <div class="stat">
            <p class="label">Accuracy:</p>
            <p class="value">{$accuracy}%</p>
        </div>
        <div class="stat">
            <p class="label">Time Left:</p>
            <p class="value">{formatTime($timeLeft)}</p>
        </div>
    </div>
    <div class="options">


        <div class="mobile">
            <div class="dropdown" use:clickOutside={() => isDifficultyOpen = false}>
            <button class="dropdown-trigger" on:click={() => isDifficultyOpen = !isDifficultyOpen}>
                {$testDifficulty}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {#if isDifficultyOpen}
                <div class="dropdown-menu">
                {#each difficultyOptions as option}
                    <label>
                    <input type="radio" bind:group={$testDifficulty} value={option} on:change={() => isDifficultyOpen = false}>
                    {option}
                    </label>
                {/each}
                </div>
            {/if}
            </div>

            <div class="dropdown" use:clickOutside={() => isModeOpen = false}>
            <button class="dropdown-trigger" on:click={() => isModeOpen = !isModeOpen}>
                {$testMode === 'timed' ? 'timed (60s)' : $testMode}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {#if isModeOpen}
                <div class="dropdown-menu">
                {#each modeOptions as option}
                    <label>
                    <input type="radio" bind:group={$testMode} value={option} on:change={() => isModeOpen = false}>
                    {option === 'timed' ? 'timed (60s)' : option}
                    </label>
                {/each}
                </div>
            {/if}
            </div>
        </div>
        <div class="desktop">
            <div class="difficulty-options">
                <span class="label">
                    Difficulty:
                </span>
                <div class="buttons">
                    <button class:active={$testDifficulty === 'easy'} on:click={() => testDifficulty.set('easy')}>Easy</button>
                    <button class:active={$testDifficulty === 'medium'} on:click={() => testDifficulty.set('medium')}>Medium</button>
                    <button class:active={$testDifficulty === 'hard'} on:click={() => testDifficulty.set('hard')}>Hard</button>
                </div>
            </div>
            <div class="mode-options">
                <span class="label">
                    Mode:
                </span>
                <div class="buttons">
                    <button class:active={$testMode === 'timed'} on:click={() => testMode.set('timed')}>Timed</button>
                    <button class:active={$testMode === 'passage'} on:click={() => testMode.set('passage')}>Passage</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .stats-and-options {
        width: 100%;

        @include desktop {
            display: flex;
            justify-content: space-between;
        }
        .current-stats {
            display: flex;
            justify-content: space-around;
            padding: 1rem 0;
            border-radius: 8px;

            @include desktop {
                padding: 0;
            }
    
            .stat {
                text-align: center;
                
                @include desktop {
                    display: flex;
                }

                &:nth-child(2) {
                    border-left: 1px solid $neutral-400;
                    border-right: 1px solid $neutral-400;
                    padding: 0 1rem;
                }
    
                .label {
                    font-size: 0.875rem;
                    color: $neutral-500;
                    margin-bottom: 0.25rem;
                    font-weight: 600;
                }
    
                .value {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: $neutral-0;
                }
            }
        }

        .options {
            display: flex;
            align-items: center;
            .mobile {
                display: flex;
                justify-content: space-between;
                width: 100%;
                gap: .65rem;
                .dropdown {
                    position: relative;
                    display: inline-block;
                    width: 50%;
                    .dropdown-trigger {
                        background-color: transparent;
                        color: $neutral-0;
                        border: 1px solid $neutral-400;
                        padding: 0.25rem .5rem;
                        border-radius: 6px;
                        font-weight: 500;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        text-transform: capitalize;
                        font-size: .9rem;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }

                    .dropdown-menu {
                        position: absolute;
                        width: 100%;
                        top: 100%;
                        left: 0;
                        background-color: $neutral-800;
                        border: 1px solid $neutral-400;
                        border-radius: 4px;
                        margin-top: 0.25rem;
                        z-index: 10;
                        display: flex;
                        flex-direction: column;

                        label {
                            padding: 0.5rem 0.5rem;
                            cursor: pointer;
                            display: flex;
                            gap: 0.5rem;
                            text-transform: capitalize;

                            &:hover {
                                background-color: $neutral-500;
                            }
                        }
                    }
                }

                @include desktop {
                    display: none;
                }
            }
            .desktop {
                display: none;

                @include desktop {
                    display: flex;
                    align-items: center;
                }

                .difficulty-options, .mode-options {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;

                    &:first-of-type {
                        padding-right: 1rem;
                        border-right: 1px solid $neutral-800;
                    }
                    &:last-of-type {
                        padding-left: 1rem;
                    }

                    .label {
                        font-weight: 500;
                        color: $neutral-500;
                    }

                    .buttons {
                        display: flex;
                        gap: 0.35rem;
                        button {
                            padding: 0.25rem 0.5rem;
                            border: 1px solid $neutral-400;
                            border-radius: 6px;
                            background-color: transparent;
                            color: $neutral-0;
                            font-weight: 500;
                            font-size: .9rem;
    
                            &.active {
                                border-color: $blue-400;
                                color: $blue-400;
                            }
                        }

                    }

                }
            }
        }
    }
</style>
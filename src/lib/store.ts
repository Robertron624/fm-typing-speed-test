import { writable } from 'svelte/store';
import type { TestDifficulty, TestMode } from '../types';

export const wpm = writable(0);
export const accuracy = writable(100);
export const timeLeft = writable(60);
export const isTestRunning = writable(false);
export const typedCharacters = writable(0);
export const correctCharacters = writable(0);
export const totalCharacters = writable(0);
export const testText = writable('');
export const userInput = writable('');
export const testDifficulty = writable<TestDifficulty>('medium');
export const selectedTimeLimit = writable(60);
export const showResults = writable(false);
export const bestWPM = writable(0);
export const bestAccuracy = writable(0);
export const testMode = writable<TestMode>('timed');
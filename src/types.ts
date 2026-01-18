export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestMode = 'timed' | 'passage';

export interface TextItem {
  id: string;
  text: string;
}

export type TextData = {
  [key in TestDifficulty]: TextItem[];
};

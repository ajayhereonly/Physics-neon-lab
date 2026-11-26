import { PracticeQuestion } from '../types/physics';
import { QUESTIONS_CLASS_11_A } from './questionsClass11A';
import { QUESTIONS_CLASS_11_B } from './questionsClass11B';
import { QUESTIONS_CLASS_12_A } from './questionsClass12A';
import { QUESTIONS_CLASS_12_B } from './questionsClass12B';

export const ALL_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  ...QUESTIONS_CLASS_11_A,
  ...QUESTIONS_CLASS_11_B,
  ...QUESTIONS_CLASS_12_A,
  ...QUESTIONS_CLASS_12_B,
];

const byChapterMap = new Map<string, PracticeQuestion[]>();
for (const q of ALL_PRACTICE_QUESTIONS) {
  const arr = byChapterMap.get(q.chapterId);
  if (arr) arr.push(q);
  else byChapterMap.set(q.chapterId, [q]);
}

export function getQuestionsByChapter(chapterId: string): PracticeQuestion[] {
  return byChapterMap.get(chapterId) ?? [];
}

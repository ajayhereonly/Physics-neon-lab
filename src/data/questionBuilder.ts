import { PracticeQuestion, QuestionDifficulty } from '../types/physics';

export type RawQ = [
  difficulty: QuestionDifficulty,
  qEn: string,
  qHi: string,
  optsEn: [string, string, string, string],
  optsHi: [string, string, string, string],
  correctIndex: number,
  hintEn: string,
  hintHi: string,
  solEn: string,
  solHi: string
];

export function buildChapterQuestions(chapterId: string, rows: RawQ[]): PracticeQuestion[] {
  return rows.map((r, idx) => ({
    id: `${chapterId}-q${idx + 1}`,
    chapterId,
    difficulty: r[0],
    question: { en: r[1], hi: r[2] },
    options: [
      { en: r[3][0], hi: r[4][0] },
      { en: r[3][1], hi: r[4][1] },
      { en: r[3][2], hi: r[4][2] },
      { en: r[3][3], hi: r[4][3] },
    ],
    correctIndex: r[5],
    hint: { en: r[6], hi: r[7] },
    solution: { en: r[8], hi: r[9] },
  }));
}

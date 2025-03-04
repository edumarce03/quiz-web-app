import { Injectable } from '@angular/core';
import { QUIZ_QUESTIONS } from '../data/quiz-questions';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor() {}

  getCategories(): string[] {
    return Object.keys(QUIZ_QUESTIONS);
  }

  getQuestionsByCategory(category: string): any[] {
    return QUIZ_QUESTIONS[category as keyof typeof QUIZ_QUESTIONS] || [];
  }

  shuffleQuestions(questions: any[]): any[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

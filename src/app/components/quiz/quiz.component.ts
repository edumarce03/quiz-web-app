import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styles: ``,
})
export class QuizComponent implements OnInit {
  userName: string = ''; // Nombre del usuario
  userEmoji: string = ''; // Emoji seleccionado
  selectedCategory: string = ''; // Categoría seleccionada

  // Preguntas predefinidas por categoría
  questions: { question: string; options: string[]; answer: string }[] = [];
  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  selectedAnswer: string | null = null; // Respuesta seleccionada
  score: number = 0; // Puntaje del usuario

  constructor(private router: Router) {}

  ngOnInit() {
    // Recuperar los datos del localStorage
    this.userName = localStorage.getItem('userName') || '';
    this.userEmoji = localStorage.getItem('selectedEmoji') || '';
    this.selectedCategory = localStorage.getItem('selectedCategory') || '';

    // Cargar preguntas según la categoría seleccionada
    this.loadQuestions();
  }

  // Cargar preguntas según la categoría
  loadQuestions() {
    const questionsByCategory: { [key: string]: any[] } = {
      Ciencia: [
        {
          question: '¿Cuál es el elemento más abundante en la Tierra?',
          options: ['Oxígeno', 'Hierro', 'Silicio', 'Hidrógeno'],
          answer: 'Oxígeno',
        },
        {
          question: '¿Qué planeta es conocido como el "planeta rojo"?',
          options: ['Venus', 'Marte', 'Júpiter', 'Saturno'],
          answer: 'Marte',
        },
      ],
      Historia: [
        {
          question: '¿En qué año llegó el hombre a la Luna?',
          options: ['1969', '1975', '1980', '1955'],
          answer: '1969',
        },
        {
          question: '¿Quién fue el primer presidente de los Estados Unidos?',
          options: [
            'Thomas Jefferson',
            'George Washington',
            'Abraham Lincoln',
            'John Adams',
          ],
          answer: 'George Washington',
        },
      ],
      Cine: [
        {
          question: '¿Quién dirigió la película "El Padrino"?',
          options: [
            'Steven Spielberg',
            'Martin Scorsese',
            'Francis Ford Coppola',
            'Quentin Tarantino',
          ],
          answer: 'Francis Ford Coppola',
        },
        {
          question: '¿Qué película ganó el Oscar a Mejor Película en 2020?',
          options: [
            'Parásitos',
            '1917',
            'Joker',
            'Once Upon a Time in Hollywood',
          ],
          answer: 'Parásitos',
        },
      ],
      Matemáticas: [
        {
          question: '¿Cuál es el resultado de 2 + 2?',
          options: ['3', '4', '5', '6'],
          answer: '4',
        },
        {
          question: '¿Cuál es la raíz cuadrada de 64?',
          options: ['6', '8', '10', '12'],
          answer: '8',
        },
      ],
    };

    this.questions = questionsByCategory[this.selectedCategory] || [];
  }

  // Seleccionar una respuesta
  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
    if (answer === this.questions[this.currentQuestionIndex].answer) {
      this.score++;
    }
    this.currentQuestionIndex++;
  }

  // Reiniciar el quiz
  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
  }
}

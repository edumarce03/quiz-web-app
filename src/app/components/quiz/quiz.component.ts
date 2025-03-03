import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styles: ``,
})
export class QuizComponent implements AfterViewChecked {
  @ViewChild('resultChart') chartElement: ElementRef | undefined;
  private chart: ApexCharts | undefined;
  private chartInitialized: boolean = false;

  userName: string = ''; // Nombre del usuario
  userEmoji: string = ''; // Emoji seleccionado
  selectedCategory: string = ''; // Categoría seleccionada

  // Preguntas predefinidas por categoría
  questions: { question: string; options: string[]; answer: string }[] = [];
  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  selectedAnswer: string | null = null; // Respuesta seleccionada
  score: number = 0; // Puntaje del usuario
  isAnswerCorrect: boolean | null = null; // Estado de la respuesta (correcta o incorrecta)
  isAnswerSelected: boolean = false; // Rastrea si el usuario ya seleccionó una respuesta

  correctAnswers: number = 0; // Número de respuestas correctas
  incorrectAnswers: number = 0; // Número de respuestas incorrectas

  constructor(private userService: UserService, private router: Router) {
    // Recuperar el nombre y el emoji del servicio
    const userData = this.userService.getUser();
    this.userName = userData.name;
    this.userEmoji = userData.emoji;

    // Recuperar la categoría seleccionada
    const navigation = this.router.getCurrentNavigation();
    this.selectedCategory = navigation?.extras.state?.['category'] || '';
    this.loadQuestions();
  }

  ngAfterViewChecked() {
    if (
      this.currentQuestionIndex >= this.questions.length &&
      !this.chartInitialized
    ) {
      this.initializeChart();
      this.chartInitialized = true; // Evitar múltiples inicializaciones
    } else if (this.currentQuestionIndex < this.questions.length) {
      this.chartInitialized = false; // Permitir reinicialización en el siguiente quiz
    }
  }

  goBackToHome() {
    this.router.navigate(['/']);
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
        {
          question: '¿Qué gas es esencial para la fotosíntesis?',
          options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Hidrógeno'],
          answer: 'Dióxido de carbono',
        },
        {
          question: '¿Cuál es la velocidad de la luz en el vacío?',
          options: [
            '300,000 km/s',
            '150,000 km/s',
            '450,000 km/s',
            '600,000 km/s',
          ],
          answer: '300,000 km/s',
        },
        {
          question: '¿Qué científico formuló la teoría de la relatividad?',
          options: [
            'Isaac Newton',
            'Albert Einstein',
            'Stephen Hawking',
            'Nikola Tesla',
          ],
          answer: 'Albert Einstein',
        },
        {
          question: '¿Qué partícula subatómica tiene carga positiva?',
          options: ['Electrón', 'Protón', 'Neutrón', 'Fotón'],
          answer: 'Protón',
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
        {
          question: '¿En qué año comenzó la Segunda Guerra Mundial?',
          options: ['1939', '1941', '1945', '1935'],
          answer: '1939',
        },
        {
          question: '¿Quién escribió "Cien años de soledad"?',
          options: [
            'Gabriel García Márquez',
            'Pablo Neruda',
            'Julio Cortázar',
            'Mario Vargas Llosa',
          ],
          answer: 'Gabriel García Márquez',
        },
        {
          question: '¿Qué civilización construyó las pirámides de Giza?',
          options: ['Griegos', 'Romanos', 'Egipcios', 'Mayas'],
          answer: 'Egipcios',
        },
        {
          question: '¿En qué año cayó el Muro de Berlín?',
          options: ['1989', '1991', '1985', '1979'],
          answer: '1989',
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
        {
          question: '¿Quién interpretó a Jack en "Titanic"?',
          options: [
            'Leonardo DiCaprio',
            'Brad Pitt',
            'Tom Cruise',
            'Johnny Depp',
          ],
          answer: 'Leonardo DiCaprio',
        },
        {
          question:
            '¿Qué película es conocida por la frase "May the Force be with you"?',
          options: ['Star Wars', 'Star Trek', 'The Matrix', 'Avatar'],
          answer: 'Star Wars',
        },
        {
          question: '¿Quién dirigió "El Señor de los Anillos"?',
          options: [
            'Steven Spielberg',
            'Peter Jackson',
            'Christopher Nolan',
            'James Cameron',
          ],
          answer: 'Peter Jackson',
        },
        {
          question: '¿Qué película es protagonizada por Keanu Reeves como Neo?',
          options: ['Matrix', 'John Wick', 'Speed', 'Constantine'],
          answer: 'Matrix',
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
        {
          question: '¿Cuál es el valor de π (pi) redondeado a dos decimales?',
          options: ['3.14', '3.16', '3.12', '3.18'],
          answer: '3.14',
        },
        {
          question: '¿Qué número es primo?',
          options: ['4', '6', '7', '8'],
          answer: '7',
        },
        {
          question: '¿Cuál es el resultado de 5 × 5?',
          options: ['20', '25', '30', '35'],
          answer: '25',
        },
        {
          question: '¿Cuál es el área de un cuadrado con lado de 4 unidades?',
          options: ['16', '12', '8', '4'],
          answer: '16',
        },
      ],
    };

    this.questions = questionsByCategory[this.selectedCategory] || [];
  }

  // Método para seleccionar una respuesta
  selectAnswer(answer: string) {
    if (!this.isAnswerSelected) {
      this.selectedAnswer = answer;
      this.isAnswerCorrect =
        answer === this.questions[this.currentQuestionIndex].answer;
      this.isAnswerSelected = true;

      // Actualizar contadores para el gráfico
      if (this.isAnswerCorrect) {
        this.correctAnswers++;
        this.score++;
      } else {
        this.incorrectAnswers++;
      }
    }
  }

  // Método para avanzar a la siguiente pregunta
  nextQuestion() {
    if (this.isAnswerSelected) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.isAnswerCorrect = null;
      this.isAnswerSelected = false;

      // Si es el final del quiz, inicializar el gráfico
      if (this.currentQuestionIndex >= this.questions.length) {
        setTimeout(() => {
          this.initializeChart();
        }, 0); // Usar setTimeout para asegurar que el DOM esté listo
      }
    }
  }

  // Inicializar el gráfico de resultados
  initializeChart() {
    // Verificar que el contenedor del gráfico esté listo
    if (this.chartElement && this.chartElement.nativeElement) {
      // Colores para el gráfico: rojo y verde
      const colors = ['#10B981', '#EF4444']; // Verde y rojo

      // Configurar colores de texto
      const textColorChart = '#ffffff'; // Texto en blanco para los porcentajes

      const options = {
        series: [this.correctAnswers, this.incorrectAnswers],
        chart: {
          type: 'donut',
          height: 250,
          fontFamily: 'Inter, sans-serif',
          background: 'transparent',
          foreColor: textColorChart, // Color base del texto
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        labels: ['Correctas', 'Incorrectas'],
        colors: colors,
        legend: {
          show: false, // Ocultar las leyendas
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: any, opts: any) {
            const total = opts.w.globals.seriesTotals.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const seriesValue = opts.w.globals.seriesTotals[opts.seriesIndex];
            const percentage = ((seriesValue / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            colors: [textColorChart], // Texto en blanco para los porcentajes
          },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (val: number) {
              return `${val} respuestas`;
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: false, // Ocultar todas las etiquetas del centro (incluyendo el total)
              },
            },
          },
        },
      };

      // Destruir el gráfico anterior si existe
      if (this.chart) {
        this.chart.destroy();
      }

      // Crear y renderizar el nuevo gráfico
      this.chart = new ApexCharts(this.chartElement.nativeElement, options);
      this.chart.render();
    }
  }

  // Reiniciar el quiz
  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.isAnswerSelected = false;

    // Destruir el gráfico si existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }
}

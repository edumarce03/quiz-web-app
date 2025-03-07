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
import { QuizService } from '../../services/quiz.service';

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

  userName: string = '';
  userEmoji: string = '';
  selectedCategory: string = '';

  questions: { question: string; options: string[]; answer: string }[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: string | null = null;
  score: number = 0;
  isAnswerCorrect: boolean | null = null;
  isAnswerSelected: boolean = false;

  correctAnswers: number = 0;
  incorrectAnswers: number = 0;

  timePerQuestion: number = 15;
  timeRemaining: number = 0;
  timerInterval: any;
  unansweredQuestions: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private quizService: QuizService
  ) {
    const userData = this.userService.getUser();
    this.userName = userData.name;
    this.userEmoji = userData.emoji;
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
      this.chartInitialized = true;
    } else if (this.currentQuestionIndex < this.questions.length) {
      this.chartInitialized = false;
    }
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.timeRemaining = this.timePerQuestion;
    this.clearTimer();

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        if (!this.isAnswerSelected) {
          this.handleTimeUp();
        }
      }
    }, 1000);
  }

  handleTimeUp() {
    this.clearTimer();
    this.isAnswerSelected = true;
    this.unansweredQuestions++;
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  goBackToHome() {
    this.router.navigate(['/']);
  }

  loadQuestions() {
    this.questions = this.quizService.getQuestionsByCategory(
      this.selectedCategory
    );

    this.questions = this.quizService.shuffleQuestions(this.questions);

    this.questions = this.questions.slice(0, 6);
  }

  selectAnswer(answer: string) {
    if (!this.isAnswerSelected) {
      this.clearTimer();
      this.selectedAnswer = answer;
      this.isAnswerCorrect =
        answer === this.questions[this.currentQuestionIndex].answer;
      this.isAnswerSelected = true;

      if (this.isAnswerCorrect) {
        this.correctAnswers++;
        this.score++;
      } else {
        this.incorrectAnswers++;
      }
    }
  }

  nextQuestion() {
    if (this.isAnswerSelected) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.isAnswerCorrect = null;
      this.isAnswerSelected = false;

      if (this.currentQuestionIndex < this.questions.length) {
        this.startTimer();
      } else {
        this.clearTimer();
        setTimeout(() => {
          this.initializeChart();
        }, 0);
      }
    }
  }

  initializeChart() {
    if (this.chartElement && this.chartElement.nativeElement) {
      const colors = ['#10B981', '#EF4444', '#48dbca'];
      const textColorChart = '#ffffff';

      const options = {
        series: [
          this.correctAnswers,
          this.incorrectAnswers,
          this.unansweredQuestions,
        ],
        chart: {
          type: 'donut',
          height: 250,
          fontFamily: 'Inter, sans-serif',
          background: 'transparent',
          foreColor: textColorChart,
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        labels: ['Correctas', 'Incorrectas', 'Sin responder'],
        colors: colors,
        legend: {
          show: false,
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
            colors: [textColorChart],
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
                show: false,
              },
            },
          },
        },
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new ApexCharts(this.chartElement.nativeElement, options);
      this.chart.render();
    }
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.unansweredQuestions = 0;
    this.isAnswerSelected = false;
    this.startTimer();

    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }
}

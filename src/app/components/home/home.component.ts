import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { QuizService } from '../../services/quiz.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styles: `
    :host {
      display: block;
      height: 100vh;
    }
  `,
})
export class HomeComponent implements OnInit {
  userName: string = '';
  selectedEmoji: string = '';
  emojis: string[] = ['😊', '🦙', '🙈', '🐱', '🤓', '👨‍💻'];
  categories: any[] = [];
  editMode: boolean = false;
  profileSaved: boolean = false;
  showNameError: boolean = false;
  nameErrorMessage: string = '';

  private categoryIcons: { [key: string]: string } = {
    Ciencia: 'fas fa-flask',
    Historia: 'fas fa-landmark',
    Cine: 'fas fa-film',
    Matemáticas: 'fas fa-calculator',
    Geografía: 'fas fa-globe-americas',
    Tecnología: 'fas fa-laptop-code',
  };

  private originalName: string = '';
  private originalEmoji: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private quizService: QuizService,
    private toastr: ToastrService
  ) {
    this.loadUserData();
  }

  ngOnInit() {
    this.loadCategories();
  }

  checkName() {
    if (this.userName !== undefined && this.userName.trim() === '') {
      this.showNameError = true;
      this.nameErrorMessage =
        'El nombre no puede estar vacío o contener solo espacios';
      return;
    }

    if (this.userName && this.userName.trim().includes(' ')) {
      this.showNameError = true;
      this.nameErrorMessage = 'Por favor ingresa solo un nombre (sin espacios)';
      return;
    }

    this.showNameError = false;
    this.nameErrorMessage = '';
  }

  get isValidName(): boolean {
    if (!this.userName) return false;
    const trimmedName = this.userName.trim();
    return trimmedName !== '' && !trimmedName.includes(' ');
  }

  loadUserData() {
    const userData = this.userService.getUser();
    if (userData.name && userData.emoji) {
      this.userName = userData.name;
      this.selectedEmoji = userData.emoji;
      this.originalName = userData.name;
      this.originalEmoji = userData.emoji;
      this.profileSaved = true;
    }
  }

  loadCategories() {
    const categoryNames = this.quizService.getCategories();

    this.categories = categoryNames.map((name) => {
      return {
        name: name,
        icon: this.categoryIcons[name] || 'fas fa-question',
      };
    });
  }

  selectEmoji(emoji: string) {
    this.selectedEmoji = emoji;
  }

  saveProfile() {
    if (!this.isValidName) {
      this.checkName();
      this.toastr.error(this.nameErrorMessage, 'Error de validación');
      return;
    }

    this.userName = this.userName.trim();
    this.userService.setUser(this.userName, this.selectedEmoji);
    this.originalName = this.userName;
    this.originalEmoji = this.selectedEmoji;
    this.editMode = false;
    this.profileSaved = true;
    this.showNameError = false;

    this.toastr.success('Perfil guardado correctamente', 'Éxito');
  }

  cancelEdit() {
    this.userName = this.originalName;
    this.selectedEmoji = this.originalEmoji;
    this.editMode = false;
    this.toastr.info('Edición cancelada', 'Información');
  }

  selectCategory(category: string) {
    if (this.userName && this.selectedEmoji && this.profileSaved) {
      this.router.navigate(['/quiz'], { state: { category } });
    }
  }
}

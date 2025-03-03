import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
export class HomeComponent {
  userName: string = '';
  selectedEmoji: string = '';
  emojis: string[] = ['😊', '🦙', '🙈', '🐱', '🤓', '👨‍💻'];
  categories: any[] = [
    { name: 'Ciencia', icon: 'fas fa-flask' },
    { name: 'Historia', icon: 'fas fa-landmark' },
    { name: 'Cine', icon: 'fas fa-film' },
    { name: 'Matemáticas', icon: 'fas fa-calculator' },
  ];
  editMode: boolean = false;
  profileSaved: boolean = false; // Nueva variable para rastrear si el perfil se ha guardado

  // Propiedades para guardar los valores originales
  private originalName: string = '';
  private originalEmoji: string = '';

  constructor(private router: Router, private userService: UserService) {
    this.loadUserData();
  }

  loadUserData() {
    const userData = this.userService.getUser();
    if (userData.name && userData.emoji) {
      this.userName = userData.name;
      this.selectedEmoji = userData.emoji;
      this.originalName = userData.name;
      this.originalEmoji = userData.emoji;
      this.profileSaved = true; // Si ya hay datos, el perfil está guardado
    }
  }

  // Método para seleccionar emoji con animación
  selectEmoji(emoji: string) {
    this.selectedEmoji = emoji;
  }

  // Método para guardar perfil
  saveProfile() {
    if (this.userName && this.selectedEmoji) {
      this.userService.setUser(this.userName, this.selectedEmoji);
      this.originalName = this.userName;
      this.originalEmoji = this.selectedEmoji;
      this.editMode = false;
      this.profileSaved = true; // Marcar el perfil como guardado
    }
  }

  // Método para cancelar la edición
  cancelEdit() {
    this.userName = this.originalName;
    this.selectedEmoji = this.originalEmoji;
    this.editMode = false;
  }

  // Método para seleccionar una categoría
  selectCategory(category: string) {
    if (this.userName && this.selectedEmoji && this.profileSaved) {
      this.router.navigate(['/quiz'], { state: { category } });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  userName: string = ''; // Variable para almacenar el nombre del usuario
  selectedEmoji: string = ''; // Variable para almacenar el emoji seleccionado

  // Lista de emojis predefinidos
  emojis: string[] = ['😊', '🚀', '🎉', '🐱', '🌟', '🍕'];

  // Lista de categorías
  categories: string[] = ['Ciencia', 'Historia', 'Cine', 'Matemáticas'];

  constructor(private router: Router) {}

  // Método para seleccionar una categoría
  selectCategory(category: string) {
    if (this.userName && this.selectedEmoji) {
      // Guardar los datos en el localStorage
      localStorage.setItem('userName', this.userName);
      localStorage.setItem('selectedEmoji', this.selectedEmoji);
      localStorage.setItem('selectedCategory', category);

      // Navegar al componente del quiz
      this.router.navigate(['/quiz']);
    }
  }
}

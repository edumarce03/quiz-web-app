import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userName: string = '';
  userEmoji: string = '';

  constructor() {}

  setUser(name: string, emoji: string) {
    this.userName = name;
    this.userEmoji = emoji;
  }

  getUser() {
    return { name: this.userName, emoji: this.userEmoji };
  }

  clearUser() {
    this.userName = '';
    this.userEmoji = '';
  }
}

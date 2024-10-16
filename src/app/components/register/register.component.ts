import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.router.navigate(['/login']);
  }
  async register() {
    if (this.password === this.confirmPassword) {
      const userLogin = {
        username: this.email,
        password: this.password,
      };
      const response: any = await this.http
        .post('http://localhost:3000/register', userLogin)
        .toPromise();
      if (response.message === 'New user registered') {
        alert(response.message);
      } else {
        alert('registration failed'.toUpperCase());
      }
    } else {
      alert('password and confirm password must be the same');
    }
  }
}

import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() UmsiziUsers: Profile[] | undefined = [];
  @Output() loggedInProfile = new EventEmitter<Profile>();
  @Output() registerTrigger = new EventEmitter<void>();
  email: string = '';
  password: string = '';
  errorText: string = 'Incorrect Username Or Password.';
  isInCorrectUserDetails: boolean = false;
  constructor(private http: HttpClient, private router: Router) {}
  register() {
    this.router.navigate(['/register']);
  }
  async submitLogin() {
    const userLogin = {
      username: this.email,
      password: this.password,
    };


    try {
      const response: any = await this.http
        .post('http://localhost:3000/login', userLogin)
        .toPromise();


      if (response.message === 'unauthorized') {
        console.log('gt here', response.message);
        this.isInCorrectUserDetails = true;
      } else {
        console.log('Login successful', response);
        localStorage.setItem('email', response.username);
        localStorage.setItem('password', response.password);
        localStorage.setItem('tasks', JSON.stringify(response.tasks));
        this.isInCorrectUserDetails = false;
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }
    } catch (error) {
      console.log('err', error);
      this.isInCorrectUserDetails = true; // Optionally set the flag on error
    }
  }
}

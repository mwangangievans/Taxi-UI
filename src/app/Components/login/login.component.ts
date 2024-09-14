import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { UserSessionService } from '../../service/user-session.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private api: HttpService,
    private router: Router,
    private notify: NotificationService,
    private sessionService: UserSessionService
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      return;
    }
    this.api.postWithoutToken('auth/login', this.loginForm.value).subscribe({
      next: (res) => {
        console.log('this is res...', res);

        this.sessionService.storeUserDataAfterLoginSuccess(res);
        this.router.navigate(['home']);
      },
      error: (err) => {
        console.log('this is erro....', err.errors.message);

        this.notify.showError(`${err.message}`, 'error');
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }
}

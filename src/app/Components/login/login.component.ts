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
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private api: HttpService,
    private router: Router,
    private notify: NotificationService,
    private sessionService: UserSessionService,
    private loaderService: LoaderService
  ) {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.api.postWithoutToken('auth/login', this.loginForm.value).subscribe({
      next: (res) => {
        this.sessionService.storeUserDataAfterLoginSuccess(res);
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.notify.showError(`${err.message}`, 'error');
      },
      complete: () => {},
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}

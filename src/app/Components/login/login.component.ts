import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // loginForm!: FormGroup;
  // ngOnInit() {
  //   this.loginForm = this._formBuilder.group({
  //     email: ['', Validators.required],
  //     password: ['', Validators.required],
  //   });
  // }
  // constructor(
  //   private _formBuilder: FormBuilder,
  //   private api: HttpService,
  //   private router: Router,
  //   private notify: NotificationService
  // ) {}
}

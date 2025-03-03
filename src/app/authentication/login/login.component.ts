import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Message as MessageModel } from '@core/models/message'
import { PRIME_NG_MODULES } from '@core/utils';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/loginModel';
import { TokenResponse } from '@core/responses/tokenResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateDirective,
    TranslatePipe,
    ...PRIME_NG_MODULES
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  isBrowser: boolean = false;
  loginForm: FormGroup;
  //messages: Message[] = [];
  messages = signal<any[]>([]);
  showRemainingAttempts: boolean = false;
  attemptsRemaining: number = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const login = new LoginModel();

      login.userName = this.loginForm.get('username')?.value;
      login.password = this.loginForm.get('password')?.value;

      const response = await this.authService.AuthenticateUser(login);

      response.subscribe({
        next: (response: TokenResponse) => {
          if (response.model?.token) {
            const interactiveUser = JSON.stringify(response.model.consultant);

            localStorage.setItem('token', response.model.token);

            if (response.model?.consultant?.id)
              localStorage.setItem('interactiveUser', interactiveUser);

            this.router.navigate(['/leads']);
          }
        },
        error: (error: any) => {
          const errorMessages: Array<MessageModel>  = error.error?.messages;

          if(error.error.model.attemptsRemaining > 0) {
            this.attemptsRemaining = Number(error.error.model.attemptsRemaining);
            this.showRemainingAttempts = true;
          }

          this.messages.set([
            {
              severity: "error",
              content: this.translate.instant(`api.error.${errorMessages[0].messageText}`,
                { remaining: error.error.model.attemptsRemaining })
            }
          ]);
        }
      });
    }
  }
}

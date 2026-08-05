import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  isLoading = false;
  error = '';
  successMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    phone: ['', [Validators.pattern('^[0-9+\\-\\s()]{7,15}$')]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onSubmit() {
    const form = this.isLogin ? this.loginForm : this.registerForm;
    
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    if (this.isLogin) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          if (Array.isArray(err.error?.message)) {
            this.error = err.error.message.join(' | ');
          } else {
            this.error = err.error?.message || 'Invalid email or password';
          }
        }
      });
    } else {
      const registeredEmail = this.registerForm.value.email || '';
      const payload = {
        name: this.registerForm.value.name,
        email: registeredEmail,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone || undefined
      };

      this.authService.register(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.isLogin = true; // Switch to login view
          this.loginForm.patchValue({ email: registeredEmail });
          this.registerForm.reset();
          this.successMessage = 'Registration successful! A welcome email has been sent. Please login with your password.';
        },
        error: (err) => {
          this.isLoading = false;
          if (Array.isArray(err.error?.message)) {
            this.error = err.error.message.join(' | ');
          } else {
            this.error = err.error?.message || 'An error occurred during registration';
          }
        }
      });
    }
  }
}

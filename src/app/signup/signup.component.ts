import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordsMismatch: true };
  }

onSubmit() {
  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched(); // Optionally show validation errors
    alert('Please fill out all required fields correctly.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const newUser = {
    email: this.signupForm.value.email.trim().toLowerCase(),
    fullName: this.signupForm.value.fullName,
    password: this.signupForm.value.password,
    profilePicUrl: 'assets/anonymous.png',
    likedPosts: [],
    likedComments: [],
    role: this.signupForm.value.email === 'admin@ctu.edu' ? 'admin' : 'user'
  };

  const existing = users.find((u: any) => u.email === newUser.email);
  if (existing) {
    alert('User already exists!');
    return;
  }

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Account created! You can now log in.');
  this.router.navigate(['/login']);
}

}

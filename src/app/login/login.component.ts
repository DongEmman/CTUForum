import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

/*onSubmit() {
  if (this.loginForm.valid) {
    const email = this.loginForm.value.email;

    // For demo purposes - you can map names based on email
    let userName = 'Anonymous';
    let userPic = 'assets/anonymous.png';

    if (email === 'nina@gmail.com') {
      userName = 'Nina Pamela Godin';
      userPic = 'assets/ninya.jpg';
    } else if (email === 'christian@gmail.com') {
      userName = 'Christian Calderon';
      userPic = 'assets/chan.jpg';
    } else if (email === 'emman@gmail.com') {
      userName = 'Emmanuel Philip Godin';
      userPic = 'assets/emman.jpg';
    }

    localStorage.setItem('loggedInUser', userName);
    localStorage.setItem('userPic', userPic); // ✅ this must run

    this.router.navigate(['/home']);
  } else {
    this.loginForm.markAllAsTouched();
  }
}*/

onSubmit() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const enteredEmail = this.loginForm.value.email.trim().toLowerCase();
  const enteredPassword = this.loginForm.value.password;

  const matchedUser = users.find((u: any) =>
    u.email === enteredEmail && u.password === enteredPassword
  );

  if (!matchedUser) {
    alert('Invalid credentials or user not registered.');
    return;
  }

  // Store logged-in user info
  localStorage.setItem('loggedInUser', matchedUser.fullName);
  localStorage.setItem('userPic', matchedUser.profilePicUrl || 'assets/anonymous.png');
  localStorage.setItem('loggedInEmail', matchedUser.email);
  localStorage.setItem('loggedInUserRole', matchedUser.role); // 'admin' or 'user'

  alert(`Welcome back, ${matchedUser.fullName}!`);

  // Redirect based on role
  if (matchedUser.role === 'admin') {
    this.router.navigate(['/admin']);  // 🔁 Change this to your actual admin route
  } else {
    this.router.navigate(['/home']);
  }
}


}

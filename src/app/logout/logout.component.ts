import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private router: Router) {}

 confirmLogout() {
  // Only clear login/session info
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userPic');
  localStorage.removeItem('loggedInUserRole');
  localStorage.removeItem('loggedInEmail');

  this.router.navigate(['/login']);
}

  cancelLogout() {
    this.router.navigate(['/home']);
  }
}

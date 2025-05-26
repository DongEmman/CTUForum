import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  name = localStorage.getItem('loggedInUser') || '';
  email = localStorage.getItem('loggedInEmail') || '';
  imageUrl = localStorage.getItem('userPic') || 'assets/anonymous.png';

  constructor(private router: Router) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    localStorage.setItem('loggedInUser', this.name);
    localStorage.setItem('loggedInEmail', this.email);
    localStorage.setItem('userPic', this.imageUrl);
    this.router.navigate(['/home']);
  }
}

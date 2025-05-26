import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  admins: any[] = [];
  posts: Post[] = [];
  stats = {
    totalUsers: 0,
    totalAdmins: 0,
    totalPosts: 0
  };

  newAdmin = {
    email: '',
    fullName: '',
    password: ''
  };

  newPost = {
    title: '',
    content: '',
    author: '',
    tagsInput: ''
  };

  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('loggedInUserRole');
    if (role !== 'admin') {
      this.router.navigate(['/']);
      return;
  }

    this.loadUsers();
    this.loadPosts();
    this.updateStats();
  }

  loadUsers() {
    this.users = this.userService.getAllUsers();
    this.admins = this.users.filter(u => u.role === 'admin');
  }

  loadPosts() {
    this.posts = this.postService.getPosts();
  }

  updateStats() {
    this.stats.totalUsers = this.users.length;
    this.stats.totalAdmins = this.admins.length;
    this.stats.totalPosts = this.posts.length;
  }

  promoteToAdmin(user: any) {
    user.role = 'admin';
    this.userService.updateUserRole(user.email, 'admin');
    alert(`${user.fullName} is now an admin.`);
    this.loadUsers();
    this.updateStats();
  }

  deleteUser(user: any) {
    if (confirm(`Delete ${user.fullName}?`)) {
      this.userService.deleteUser(user.email);
      this.loadUsers();
      this.updateStats();
    }
  }

  deletePost(postId: number) {
    if (confirm('Delete this post?')) {
      this.postService.deletePost(postId);
      this.loadPosts();
      this.updateStats();
    }
  }

  createAdmin() {
    if (!this.newAdmin.email || !this.newAdmin.fullName || !this.newAdmin.password) {
      alert('Please fill all admin fields.');
      return;
    }

    this.userService.addUser({
      ...this.newAdmin,
      role: 'admin',
      profilePicUrl: 'assets/anonymous.png',
      likedPosts: [],
      likedComments: []
    });

    alert('Admin added.');
    this.newAdmin = { email: '', fullName: '', password: '' };
    this.loadUsers();
    this.updateStats();
  }

addPost() {
  if (!this.newPost.title || !this.newPost.content) {
    alert('Please complete the post form.');
    return;
  }

  const tags = this.newPost.tagsInput
    ? this.newPost.tagsInput.split(',').map(tag => tag.trim())
    : [];

  const completePost: Post = {
    id: 0,
    title: this.newPost.title,
    content: this.newPost.content,
    tags: tags,
    author: localStorage.getItem('loggedInUser') || 'Admin',
    profilePicUrl: 'assets/admin.jpg',
    timestamp: new Date(),
    upvotes: 0,
    likedBy: [],
    views: 0,
    viewTimestamps: [],
    comments: [],
    isAnnouncement: true // ✅ This marks it as an admin announcement
  };

  this.postService.addPost(completePost);
  alert('Announcement posted.');
  this.newPost = { author: '', title: '', content: '', tagsInput: '' };
  this.loadPosts();       // ✅ Reload all posts including the new one
  this.updateStats();     // ✅ Update stats if needed
}

logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userPic');
    localStorage.removeItem('loggedInUserRole');
    localStorage.removeItem('loggedInEmail');

    this.router.navigate(['/login']);
  }
}

scrollToFragment(fragment: string, event: Event) {
  event.preventDefault();  // Prevent default anchor behavior (no reload)
  const element = document.getElementById(fragment);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


}

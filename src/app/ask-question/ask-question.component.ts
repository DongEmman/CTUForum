import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent {
  postData = {
    title: '',
    content: '',
    tagsInput: ''
  };

  constructor(private postService: PostService, private router: Router) {}

    onSubmit() {
      const tags = this.postData.tagsInput.split(',').map(tag => tag.trim());
      const authorName = localStorage.getItem('loggedInUser') || 'Anonymous';
      const profilePic = localStorage.getItem('userPic') || 'assets/anonymous.png'; // ✅ get stored name

      const post: Post = {
        id: 0,
        title: this.postData.title,
        content: this.postData.content,
        tags: tags,
        author: authorName, // ✅ use real name
        timestamp: new Date(),
        profilePicUrl: profilePic // ✅ Add profile picture
      };

      this.postService.addPost(post);
      this.router.navigate(['/home']);
    }

}

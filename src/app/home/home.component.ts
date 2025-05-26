import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Post, PostComment } from '../models/post.model'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  // User data from localStorage
  profilePicUrl: string = '';
  currentUserName: string = '';

  //tags
  currentView: 'questions' | 'tags' | 'ranking' | 'myQuestions' | 'myAnswers' | 'myLikes' | 'mostCommented' | 'mostViewedToday' | 'acceptedAnswers' | 'unanswered' = 'questions';



  selectedTag: string | null = null;
  //searchbar
  searchTerm: string = '';



  // Comment section state
  newComments: { [postId: number]: string } = {};
  showComments: { [postId: number]: boolean } = {};

  // inside HomeComponent class
  commentReplyInputs: { [k: string]: string } = {};         // keyed by `${postId}_${commentIdx}`
  showReplies:    { [k: string]: boolean } = {};


  // New post form
  newPost = {
    title: '',
    content: '',
    tagsInput: ''
  };

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.profilePicUrl = localStorage.getItem('userPic') || 'assets/anonymous.png';
    this.currentUserName = localStorage.getItem('loggedInUser') || 'Anonymous';
    this.loadPosts();
  }

  loadPosts() {
    this.posts = this.postService.getPosts();
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  
  toggleReplies(postId: number, i: number) {
    const key = `${postId}_${i}`;
    this.showReplies[key] = !this.showReplies[key];
  }

  likeComment(postId: number, commentIndex: number) {
  this.postService.likeComment(postId, commentIndex, this.currentUserName);
  this.loadPosts();
}

  replyToComment(postId: number, i: number) {
    const key = `${postId}_${i}`;
    const text = this.commentReplyInputs[key]?.trim();
    if (!text) return;
    const reply = {
      author: this.currentUserName,
      profilePicUrl: this.profilePicUrl,
      text,
      timestamp: new Date()
    };
    this.postService.addReply(postId, i, reply);
    this.commentReplyInputs[key] = '';
    this.loadPosts();
  }

  getReplyCount(postId: number): number {
  const post = this.posts.find(p => p.id === postId);
  if (!post || !post.comments) return 0;

  return post.comments.reduce((total, comment) => {
    return total + (comment.replies ? comment.replies.length : 0);
  }, 0);
}

  deletePost(id: number) {
    this.postService.deletePost(id);
    this.loadPosts();
  }

  setView(view: 
  | 'questions'
  | 'tags'
  | 'ranking'
  | 'myQuestions'
  | 'myAnswers'
  | 'myLikes'
  | 'mostCommented'
  | 'mostViewedToday'
  | 'acceptedAnswers'
  | 'unanswered'
): void {
  this.currentView = view;
}



getFilteredPosts(): Post[] {
  let basePosts = this.posts;

  // If filtering by tag
 if (this.selectedTag && this.selectedTag.trim() !== '') {
  basePosts = basePosts.filter(post => post.tags.includes(this.selectedTag!));
}

  // Apply search filter
  if (this.searchTerm && this.searchTerm.trim() !== '') {
    const term = this.searchTerm.trim().toLowerCase();
    basePosts = basePosts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  return basePosts;
}


filterByTag(tag: string) {
  this.selectedTag = tag;
  this.currentView = 'questions'; // switch view when tag is clicked
}


sortedByLikes(): Post[] {
  return [...this.posts].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
}

//for hot
getMostCommentedPosts(): Post[] {
  return this.posts
    .filter(post => post.comments && post.comments.length > 0)
    .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
}

getMostViewedTodayPosts(): Post[] {
  const today = new Date().toDateString();
  return this.posts
    .map(post => {
      const todayViews = post.viewTimestamps?.filter(v => new Date(v).toDateString() === today).length || 0;
      return { ...post, todayViews };
    })
    .filter(post => post.todayViews > 0)
    .sort((a, b) => b.todayViews - a.todayViews);
}


getUnansweredQuestions(): Post[] {
  return this.posts.filter(post => !post.comments || post.comments.length === 0);
}


//for personal navigation
getMyQuestions(): Post[] {
  return this.posts.filter(post => post.author === this.currentUserName);
}

getMyAnswers(): Post[] {
  return this.posts.filter(post =>
    post.comments?.some(comment => comment.author === this.currentUserName)
  );
}

getMyLikedPosts(): Post[] {
  return this.posts.filter(post =>
    post.likedBy?.includes(this.currentUserName)
  );
}

getMyLikedComments(): { postTitle: string; comment: PostComment }[] {
  const result: { postTitle: string; comment: PostComment }[] = [];

  this.posts.forEach(post => {
    post.comments?.forEach(comment => {
      if (comment.likedBy?.includes(this.currentUserName)) {
        result.push({ postTitle: post.title, comment });
      }
    });
  });

  return result;
}

  onSubmit() {
    const tags = this.newPost.tagsInput.split(',').map(tag => tag.trim());

    const post: Post = {
      id: 0,
      title: this.newPost.title,
      content: this.newPost.content,
      tags: tags,
      author: this.currentUserName,
      timestamp: new Date(),
      profilePicUrl: this.profilePicUrl,
      views: 0,
      upvotes: 0,
      comments: []
    };

    this.postService.addPost(post);
    this.newPost = { title: '', content: '', tagsInput: '' };
    this.loadPosts();
  }

  onView(postId: number) {
    this.postService.incrementView(postId);
    this.loadPosts();
  }

  onUpvote(postId: number) {
  this.postService.upvote(postId, this.currentUserName);
  this.loadPosts();
}

clearTagFilter() {
  this.selectedTag = null;
}

  addComment(postId: number, commentText: string) {
    if (!commentText?.trim()) return;

    const comment: PostComment = {
      author: this.currentUserName,
      profilePicUrl: this.profilePicUrl,
      text: commentText,
      timestamp: new Date()
    };

    this.postService.addComment(postId, comment);
    this.newComments[postId] = '';
    this.loadPosts();
  }
}
